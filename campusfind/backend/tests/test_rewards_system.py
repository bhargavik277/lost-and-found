import sys
import uuid
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models.claim import Claim, ClaimStatus
from app.models.item import Item, ItemStatus, ReportType
from app.models.reward import ItemRecovery, UserBadge, BadgeKey
from app.models.user import User
from app.services.reward_service import process_item_recovery, get_user_rewards

client = TestClient(app)


def test_unverified_claim_earns_no_star():
    """
    Rule: Creating a found-item listing, submitting a claim, or receiving an approval
    must NOT independently earn a star. Only verified return earns a star.
    """
    uid = uuid.uuid4().hex[:6]

    # Register finder student
    res_finder = client.post("/auth/register", json={
        "name": f"Finder {uid}",
        "student_id": f"STU_F_{uid}",
        "email": f"finder_{uid}@campus.edu",
        "password": "password123"
    })
    assert res_finder.status_code == 201
    finder_token = res_finder.json()["access_token"]
    finder_headers = {"Authorization": f"Bearer {finder_token}"}

    # Register claimant student
    res_claimant = client.post("/auth/register", json={
        "name": f"Claimant {uid}",
        "student_id": f"STU_C_{uid}",
        "email": f"claimant_{uid}@campus.edu",
        "password": "password123"
    })
    assert res_claimant.status_code == 201
    claimant_token = res_claimant.json()["access_token"]
    claimant_headers = {"Authorization": f"Bearer {claimant_token}"}

    # 1. Check initial rewards for finder
    r_initial = client.get("/rewards/my", headers=finder_headers)
    assert r_initial.status_code == 200
    data = r_initial.json()
    assert data["total_stars"] == 0
    assert data["verified_recoveries"] == 0
    assert all(not b["is_unlocked"] for b in data["badges"])

    # 2. Finder reports found item -> listing alone must not award a star
    found_res = client.post("/items/found", data={
        "item_name": f"Calculus Textbook {uid}",
        "category": "Study Materials",
        "location": "Science Library Floor 2",
        "date_reported": "2026-09-21",
        "description": "Hardcover calculus book with yellow bookmark",
    }, headers=finder_headers)
    assert found_res.status_code == 201
    found_id = found_res.json()["id"]

    r_after_report = client.get("/rewards/my", headers=finder_headers)
    assert r_after_report.json()["total_stars"] == 0
    assert r_after_report.json()["verified_recoveries"] == 0

    # 3. Claimant submits a claim -> unverified claim must not award a star
    claim_res = client.post("/claims", json={
        "item_id": found_id,
        "proof_description": "My math book with my name penciled inside cover",
        "distinctive_features": "Yellow sticky note on chapter 4",
    }, headers=claimant_headers)
    assert claim_res.status_code == 201
    claim_id = claim_res.json()["id"]

    r_after_claim = client.get("/rewards/my", headers=finder_headers)
    assert r_after_claim.json()["total_stars"] == 0
    assert r_after_claim.json()["verified_recoveries"] == 0

    # 4. Admin approves claim -> approval alone must not award a star until OTP is verified
    admin_login = client.post("/auth/login", json={"email": "admin@campusfind.edu", "password": "admin123"})
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    review_res = client.patch(f"/admin/claims/{claim_id}/review", json={
        "status": "APPROVED",
        "admin_note": "Ownership verified. Collection pending at desk.",
    }, headers=admin_headers)
    assert review_res.status_code == 200

    r_after_approval = client.get("/rewards/my", headers=finder_headers)
    assert r_after_approval.json()["total_stars"] == 0
    assert r_after_approval.json()["verified_recoveries"] == 0


def test_verified_recovery_awards_one_star_and_first_find_badge():
    """
    Rule: Award one star for each unique, verified successful item recovery.
    Unlock 'First Find' badge at 1 recovery.
    """
    uid = uuid.uuid4().hex[:6]

    res_finder = client.post("/auth/register", json={
        "name": f"Alice {uid}",
        "student_id": f"STU_A_{uid}",
        "email": f"alice_{uid}@campus.edu",
        "password": "password123"
    })
    finder_token = res_finder.json()["access_token"]
    finder_headers = {"Authorization": f"Bearer {finder_token}"}

    res_claimant = client.post("/auth/register", json={
        "name": f"Bob {uid}",
        "student_id": f"STU_B_{uid}",
        "email": f"bob_{uid}@campus.edu",
        "password": "password123"
    })
    claimant_token = res_claimant.json()["access_token"]
    claimant_headers = {"Authorization": f"Bearer {claimant_token}"}

    admin_login = client.post("/auth/login", json={"email": "admin@campusfind.edu", "password": "admin123"})
    admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}

    sec_login = client.post("/auth/login", json={"email": "security@campusfind.edu", "password": "security123"})
    sec_headers = {"Authorization": f"Bearer {sec_login.json()['access_token']}"}

    # 1. Report found item
    found_res = client.post("/items/found", data={
        "item_name": f"Scientific Calculator {uid}",
        "category": "Electronics",
        "location": "Room 304",
        "date_reported": "2026-09-22",
        "description": "Casio FX-991EX calculator in sliding cover",
    }, headers=finder_headers)
    found_id = found_res.json()["id"]

    # 2. Claim item
    claim_res = client.post("/claims", json={
        "item_id": found_id,
        "proof_description": "My Casio scientific calculator with sticker on back",
    }, headers=claimant_headers)
    claim_id = claim_res.json()["id"]

    # 3. Approve claim
    client.patch(f"/admin/claims/{claim_id}/review", json={
        "status": "APPROVED",
        "admin_note": "Approved for pickup.",
    }, headers=admin_headers)

    # 4. Claimant retrieves OTP
    otp_res = client.get(f"/claims/{claim_id}/otp", headers=claimant_headers)
    assert otp_res.status_code == 200
    otp = otp_res.json()["otp"]

    # 5. Security Desk verifies OTP -> Handover complete
    verify_res = client.post(f"/security/collections/{claim_id}/verify-otp", json={"otp": otp}, headers=sec_headers)
    assert verify_res.status_code == 200
    assert verify_res.json()["status"] == "RETURNED"

    # 6. Check Finder's rewards: Must earn EXACTLY ONE STAR & unlock First Find badge
    rewards_res = client.get("/rewards/my", headers=finder_headers)
    assert rewards_res.status_code == 200
    rewards = rewards_res.json()
    assert rewards["total_stars"] == 1
    assert rewards["verified_recoveries"] == 1

    first_find_badge = next((b for b in rewards["badges"] if b["key"] == "FIRST_FIND"), None)
    assert first_find_badge is not None
    assert first_find_badge["is_unlocked"] is True
    assert first_find_badge["progress"] == 100

    good_samaritan_badge = next((b for b in rewards["badges"] if b["key"] == "GOOD_SAMARITAN"), None)
    assert good_samaritan_badge is not None
    assert good_samaritan_badge["is_unlocked"] is False
    assert good_samaritan_badge["progress"] == 33  # 1/3 = 33%

    # Next milestone should point to Good Samaritan
    assert rewards["next_milestone"] is not None
    assert rewards["next_milestone"]["key"] == "GOOD_SAMARITAN"
    assert rewards["next_milestone"]["remaining"] == 2

    # 7. Check Claimant rewards: Must be 0 stars (they were the owner receiving the item)
    claimant_rewards = client.get("/rewards/my", headers=claimant_headers).json()
    assert claimant_rewards["total_stars"] == 0
    assert claimant_rewards["verified_recoveries"] == 0


def test_duplicate_recovery_never_awards_duplicate_stars():
    """
    Rule: The same recovery must never earn multiple stars.
    Repeated or concurrent processing must be strictly idempotent.
    """
    uid = uuid.uuid4().hex[:6]

    res_finder = client.post("/auth/register", json={
        "name": f"Daisy {uid}",
        "student_id": f"STU_D_{uid}",
        "email": f"daisy_{uid}@campus.edu",
        "password": "password123"
    })
    finder_token = res_finder.json()["access_token"]
    finder_headers = {"Authorization": f"Bearer {finder_token}"}

    res_claimant = client.post("/auth/register", json={
        "name": f"Eric {uid}",
        "student_id": f"STU_E_{uid}",
        "email": f"eric_{uid}@campus.edu",
        "password": "password123"
    })
    claimant_token = res_claimant.json()["access_token"]
    claimant_headers = {"Authorization": f"Bearer {claimant_token}"}

    admin_login = client.post("/auth/login", json={"email": "admin@campusfind.edu", "password": "admin123"})
    admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}

    sec_login = client.post("/auth/login", json={"email": "security@campusfind.edu", "password": "security123"})
    sec_headers = {"Authorization": f"Bearer {sec_login.json()['access_token']}"}

    # Report, claim, approve
    found_res = client.post("/items/found", data={
        "item_name": f"Umbrella {uid}",
        "category": "Personal Items",
        "location": "Main Entrance",
        "date_reported": "2026-09-22",
        "description": "Black compact umbrella",
    }, headers=finder_headers)
    found_id = found_res.json()["id"]

    claim_res = client.post("/claims", json={"item_id": found_id, "proof_description": "My black umbrella"}, headers=claimant_headers)
    claim_id = claim_res.json()["id"]

    client.patch(f"/admin/claims/{claim_id}/review", json={"status": "APPROVED", "admin_note": "OK"}, headers=admin_headers)

    otp = client.get(f"/claims/{claim_id}/otp", headers=claimant_headers).json()["otp"]

    # First OTP verification
    v1 = client.post(f"/security/collections/{claim_id}/verify-otp", json={"otp": otp}, headers=sec_headers)
    assert v1.status_code == 200

    r1 = client.get("/rewards/my", headers=finder_headers).json()
    assert r1["total_stars"] == 1

    # Second OTP verification attempt: Should be rejected by backend
    v2 = client.post(f"/security/collections/{claim_id}/verify-otp", json={"otp": otp}, headers=sec_headers)
    assert v2.status_code == 400
    assert "already been used" in v2.json()["detail"].lower()

    # Even direct calls to process_item_recovery in the backend service must not duplicate stars
    db = SessionLocal()
    try:
        claim_obj = db.query(Claim).filter(Claim.id == uuid.UUID(claim_id)).first()
        duplicate_rec = process_item_recovery(db, claim_obj)
        db.commit()
    finally:
        db.close()

    r2 = client.get("/rewards/my", headers=finder_headers).json()
    assert r2["total_stars"] == 1, "Duplicate recovery awarded extra stars!"
    assert r2["verified_recoveries"] == 1


def test_user_cannot_award_stars_to_themselves():
    """
    Rule: Ensure one user cannot award stars to themselves or modify their own score.
    """
    uid = uuid.uuid4().hex[:6]

    res_user = client.post("/auth/register", json={
        "name": f"Sneaky {uid}",
        "student_id": f"STU_SN_{uid}",
        "email": f"sneaky_{uid}@campus.edu",
        "password": "password123"
    })
    token = res_user.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. User reports found item
    found_res = client.post("/items/found", data={
        "item_name": f"Backpack {uid}",
        "category": "Personal Items",
        "location": "Gym",
        "date_reported": "2026-09-22",
    }, headers=headers)
    found_id = found_res.json()["id"]

    # 2. User attempts to claim their own item -> Must be blocked
    self_claim = client.post("/claims", json={
        "item_id": found_id,
        "proof_description": "Trying to claim my own report to get a star",
    }, headers=headers)
    assert self_claim.status_code == 400
    assert "cannot claim your own report" in self_claim.json()["detail"].lower()

    # 3. Direct service guard: if finder_id == claimant_id, process_item_recovery rejects it
    db = SessionLocal()
    try:
        fake_claim = Claim(
            id=uuid.uuid4(),
            item_id=uuid.UUID(found_id),
            user_id=uuid.UUID(res_user.json()["user"]["id"]),  # same as finder
            status=ClaimStatus.APPROVED,
            is_otp_used=True,
            proof_description="Self claim bypass test",
        )
        rec = process_item_recovery(db, fake_claim)
        assert rec is None, "process_item_recovery allowed self-award!"
    finally:
        db.close()

    # 4. Check user rewards: 0 stars
    r = client.get("/rewards/my", headers=headers).json()
    assert r["total_stars"] == 0


def test_badge_thresholds_progression():
    """
    Rule: Unlock badges automatically:
      - First Find: 1 recovery
      - Good Samaritan: 3 recoveries
      - Campus Hero: 5 recoveries
      - Campus Legend: 10 recoveries
    """
    uid = uuid.uuid4().hex[:6]

    res_super = client.post("/auth/register", json={
        "name": f"Hero {uid}",
        "student_id": f"STU_H_{uid}",
        "email": f"hero_{uid}@campus.edu",
        "password": "password123"
    })
    user_id = uuid.UUID(res_super.json()["user"]["id"])
    token = res_super.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    db = SessionLocal()
    try:
        other_user = User(
            id=uuid.uuid4(),
            student_id=f"STU_OTH_{uid}",
            name="Other Student",
            email=f"other_{uid}@campus.edu",
            password_hash="fake",
        )
        db.add(other_user)
        db.commit()

        # Helper to simulate a verified recovery for user_id
        def add_verified_recovery(idx):
            item = Item(
                id=uuid.uuid4(),
                reported_by=user_id,
                item_name=f"Item #{idx}",
                category="Personal Items",
                location="Campus",
                date_reported=datetime.date(2026, 9, 20),
                report_type=ReportType.FOUND,
                status=ItemStatus.RETURNED,
                recovered=True,
            )
            claim = Claim(
                id=uuid.uuid4(),
                item_id=item.id,
                user_id=other_user.id,
                status=ClaimStatus.APPROVED,
                is_otp_used=True,
                proof_description="Ownership verified",
            )
            item.claims.append(claim)
            db.add(item)
            db.add(claim)
            db.commit()
            rec = process_item_recovery(db, claim)
            db.commit()
            return rec

        import datetime

        # 0 Recoveries: All locked
        r0 = client.get("/rewards/my", headers=headers).json()
        assert r0["total_stars"] == 0
        assert r0["next_milestone"]["key"] == "FIRST_FIND"

        # 1 Recovery: First Find unlocked
        add_verified_recovery(1)
        r1 = client.get("/rewards/my", headers=headers).json()
        assert r1["total_stars"] == 1
        assert r1["verified_recoveries"] == 1
        b_map = {b["key"]: b for b in r1["badges"]}
        assert b_map["FIRST_FIND"]["is_unlocked"] is True
        assert b_map["GOOD_SAMARITAN"]["is_unlocked"] is False
        assert r1["next_milestone"]["key"] == "GOOD_SAMARITAN"
        assert r1["next_milestone"]["remaining"] == 2

        # 2 Recoveries: Still only First Find
        add_verified_recovery(2)
        r2 = client.get("/rewards/my", headers=headers).json()
        assert r2["total_stars"] == 2
        assert r2["verified_recoveries"] == 2
        b_map = {b["key"]: b for b in r2["badges"]}
        assert b_map["GOOD_SAMARITAN"]["is_unlocked"] is False
        assert b_map["GOOD_SAMARITAN"]["progress"] == 66  # 2/3 = 66%

        # 3 Recoveries: Good Samaritan unlocked
        add_verified_recovery(3)
        r3 = client.get("/rewards/my", headers=headers).json()
        assert r3["total_stars"] == 3
        b_map = {b["key"]: b for b in r3["badges"]}
        assert b_map["FIRST_FIND"]["is_unlocked"] is True
        assert b_map["GOOD_SAMARITAN"]["is_unlocked"] is True
        assert b_map["CAMPUS_HERO"]["is_unlocked"] is False
        assert r3["next_milestone"]["key"] == "CAMPUS_HERO"
        assert r3["next_milestone"]["remaining"] == 2

        # 4 & 5 Recoveries: Campus Hero unlocked
        add_verified_recovery(4)
        add_verified_recovery(5)
        r5 = client.get("/rewards/my", headers=headers).json()
        assert r5["total_stars"] == 5
        b_map = {b["key"]: b for b in r5["badges"]}
        assert b_map["CAMPUS_HERO"]["is_unlocked"] is True
        assert b_map["CAMPUS_LEGEND"]["is_unlocked"] is False
        assert r5["next_milestone"]["key"] == "CAMPUS_LEGEND"
        assert r5["next_milestone"]["remaining"] == 5

        # 6, 7, 8, 9, 10 Recoveries: Campus Legend unlocked
        for i in range(6, 11):
            add_verified_recovery(i)

        r10 = client.get("/rewards/my", headers=headers).json()
        assert r10["total_stars"] == 10
        assert r10["verified_recoveries"] == 10
        b_map = {b["key"]: b for b in r10["badges"]}
        assert b_map["FIRST_FIND"]["is_unlocked"] is True
        assert b_map["GOOD_SAMARITAN"]["is_unlocked"] is True
        assert b_map["CAMPUS_HERO"]["is_unlocked"] is True
        assert b_map["CAMPUS_LEGEND"]["is_unlocked"] is True
        assert r10["next_milestone"] is None  # All unlocked!
    finally:
        db.close()


def test_user_cannot_tamper_with_rewards_api():
    """
    Verify that reward score cannot be modified via POST/PUT/PATCH endpoints.
    """
    uid = uuid.uuid4().hex[:6]
    res_user = client.post("/auth/register", json={
        "name": f"Tamper {uid}",
        "student_id": f"STU_T_{uid}",
        "email": f"tamper_{uid}@campus.edu",
        "password": "password123"
    })
    headers = {"Authorization": f"Bearer {res_user.json()['access_token']}"}

    # Attempting to POST or PATCH /rewards/my
    post_res = client.post("/rewards/my", json={"total_stars": 999}, headers=headers)
    assert post_res.status_code == 405  # Method Not Allowed

    patch_res = client.patch("/rewards/my", json={"total_stars": 999}, headers=headers)
    assert patch_res.status_code == 405  # Method Not Allowed

    put_res = client.put("/rewards/my", json={"total_stars": 999}, headers=headers)
    assert put_res.status_code == 405  # Method Not Allowed
