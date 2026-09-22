import sys
import uuid
import datetime
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models.claim import Claim, ClaimStatus
from app.models.item import Item, ItemStatus
from app.models.user import User, UserRole
from app.models.timeline import ItemTimeline
from app.models.notification import Notification

client = TestClient(app)


def test_security_desk_complete_workflow():
    uid = uuid.uuid4().hex[:6]

    # Setup demo security user if not logged in
    sec_login = client.post("/auth/login", json={"email": "security@campusfind.edu", "password": "security123"})
    assert sec_login.status_code == 200, f"Security login failed: {sec_login.text}"
    sec_token = sec_login.json()["access_token"]
    sec_headers = {"Authorization": f"Bearer {sec_token}"}

    # Setup admin user
    admin_login = client.post("/auth/login", json={"email": "admin@campusfind.edu", "password": "admin123"})
    assert admin_login.status_code == 200, f"Admin login failed: {admin_login.text}"
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Register student Sam (reporter of lost item)
    stu_sam = client.post("/auth/register", json={
        "name": f"Sam Wilson {uid}",
        "student_id": f"STU_S_{uid}",
        "email": f"sam_{uid}@campus.edu",
        "password": "password123"
    })
    assert stu_sam.status_code == 201
    sam_token = stu_sam.json()["access_token"]
    sam_headers = {"Authorization": f"Bearer {sam_token}"}

    # Register student Sarah (finder of item)
    stu_sarah = client.post("/auth/register", json={
        "name": f"Sarah Connor {uid}",
        "student_id": f"STU_F_{uid}",
        "email": f"sarah_{uid}@campus.edu",
        "password": "password123"
    })
    assert stu_sarah.status_code == 201
    sarah_token = stu_sarah.json()["access_token"]
    sarah_headers = {"Authorization": f"Bearer {sarah_token}"}

    # 1. Report found item
    found_res = client.post("/items/found", data={
        "item_name": f"Leather Wallet {uid}",
        "category": "Personal Items",
        "location": "Main Cafeteria",
        "date_reported": "2026-09-20",
        "description": "Brown leather bifold wallet found near coffee counter",
    }, headers=sarah_headers)
    assert found_res.status_code == 201
    found_id = found_res.json()["id"]

    # 2. Sam submits an ownership claim
    claim_res = client.post("/claims", json={
        "item_id": found_id,
        "proof_description": "Brown leather wallet containing my ID card and coffee reward stamps",
        "distinctive_features": "Small coin pocket with embossed initials SW",
        "approximate_time": "Left around 12:30 PM",
    }, headers=sam_headers)
    assert claim_res.status_code == 201
    claim_id = claim_res.json()["id"]

    # ----------------------------------------------------
    # TEST 2: Student gets 403 on security endpoint
    # ----------------------------------------------------
    stu_sec_check = client.get("/security/collections/pending", headers=sam_headers)
    assert stu_sec_check.status_code == 403, f"Expected 403 for student on security endpoint, got {stu_sec_check.status_code}"

    # ----------------------------------------------------
    # 3. Admin approves the claim
    # ----------------------------------------------------
    review_res = client.patch(f"/admin/claims/{claim_id}/review", json={
        "status": "APPROVED",
        "admin_note": "Ownership proof verified. Staged at Security Desk.",
    }, headers=admin_headers)
    assert review_res.status_code == 200

    # ----------------------------------------------------
    # TEST 4: Approved claim creates Security Desk notification
    # ----------------------------------------------------
    sec_notifs = client.get("/notifications", headers=sec_headers)
    assert sec_notifs.status_code == 200
    sec_notifs_list = sec_notifs.json()
    matching_sec_notif = next(
        (n for n in sec_notifs_list if f"Leather Wallet {uid}" in n["message"]),
        None
    )
    assert matching_sec_notif is not None, "Security Desk did not receive notification for approved claim"
    assert "Verify the student's Collection OTP" in matching_sec_notif["message"]

    # ----------------------------------------------------
    # TEST 1: Security user can access pending collections
    # ----------------------------------------------------
    pending_res = client.get("/security/collections/pending", headers=sec_headers)
    assert pending_res.status_code == 200
    pending_list = pending_res.json()
    target_pending = next((c for c in pending_list if c["id"] == claim_id), None)
    assert target_pending is not None, "Pending claim not found in Security pending collections"
    assert target_pending["collection_status"] == "PENDING"
    assert target_pending["claimant_name"] == f"Sam Wilson {uid}"
    assert target_pending["student_id"] == f"STU_S_{uid}"

    # ----------------------------------------------------
    # TEST 3: Admin can access security collection information
    # ----------------------------------------------------
    admin_pending_res = client.get("/security/collections/pending", headers=admin_headers)
    assert admin_pending_res.status_code == 200
    assert any(c["id"] == claim_id for c in admin_pending_res.json())

    # ----------------------------------------------------
    # TEST 5: Security API does not expose OTP
    # ----------------------------------------------------
    assert "otp" not in target_pending
    assert "otp_plain" not in target_pending
    assert "otp_hash" not in target_pending

    # ----------------------------------------------------
    # Claimant retrieves their OTP
    # ----------------------------------------------------
    otp_res = client.get(f"/claims/{claim_id}/otp", headers=sam_headers)
    assert otp_res.status_code == 200
    real_otp = otp_res.json()["otp"]
    assert len(real_otp) == 6

    # ----------------------------------------------------
    # TEST 7: Wrong OTP is rejected
    # ----------------------------------------------------
    wrong_res = client.post(f"/security/collections/{claim_id}/verify-otp", json={"otp": "000000"}, headers=sec_headers)
    assert wrong_res.status_code == 400
    assert "Invalid collection OTP" in wrong_res.json()["detail"]

    # ----------------------------------------------------
    # TEST 6: Correct OTP successfully completes collection
    # ----------------------------------------------------
    verify_res = client.post(f"/security/collections/{claim_id}/verify-otp", json={"otp": real_otp}, headers=sec_headers)
    assert verify_res.status_code == 200
    v_data = verify_res.json()
    assert v_data["success"] is True
    assert v_data["status"] == "RETURNED"

    # ----------------------------------------------------
    # TEST 12: Successful collection changes item status to RETURNED
    # ----------------------------------------------------
    item_check = client.get(f"/items/{found_id}")
    assert item_check.status_code == 200
    assert item_check.json()["status"] == "RETURNED"

    # ----------------------------------------------------
    # TEST 13: Successful collection sets recovered=true
    # ----------------------------------------------------
    db = SessionLocal()
    try:
        db_item = db.query(Item).filter(Item.id == uuid.UUID(found_id)).first()
        assert db_item is not None
        assert db_item.recovered is True
        assert db_item.status == ItemStatus.RETURNED

        # ----------------------------------------------------
        # TEST 11: Successful collection creates timeline event
        # ----------------------------------------------------
        timelines = db.query(ItemTimeline).filter(ItemTimeline.item_id == uuid.UUID(found_id)).all()
        timeline_statuses = [t.status for t in timelines]
        assert "COLLECTED" in timeline_statuses, "COLLECTED timeline event missing"
        assert "RETURNED" in timeline_statuses, "RETURNED timeline event missing"

        # Count how many COLLECTED events exist
        collected_count_before = sum(1 for t in timelines if t.status == "COLLECTED")
    finally:
        db.close()

    # ----------------------------------------------------
    # TEST 9: Already-used OTP is rejected
    # ----------------------------------------------------
    used_res = client.post(f"/security/collections/{claim_id}/verify-otp", json={"otp": real_otp}, headers=sec_headers)
    assert used_res.status_code == 400
    assert "already been used" in used_res.json()["detail"].lower()

    # ----------------------------------------------------
    # TEST 14: Repeated verification does not create duplicate collection events
    # ----------------------------------------------------
    db = SessionLocal()
    try:
        timelines_after = db.query(ItemTimeline).filter(ItemTimeline.item_id == uuid.UUID(found_id)).all()
        collected_count_after = sum(1 for t in timelines_after if t.status == "COLLECTED")
        assert collected_count_after == collected_count_before == 1
    finally:
        db.close()

    # Verify pending collection moved to completed collections
    pending_after = client.get("/security/collections/pending", headers=sec_headers).json()
    assert not any(c["id"] == claim_id for c in pending_after)

    completed_after = client.get("/security/collections/completed", headers=sec_headers).json()
    assert any(c["id"] == claim_id for c in completed_after)


def test_expired_otp_and_returned_item_rejection():
    uid = uuid.uuid4().hex[:6]
    sec_login = client.post("/auth/login", json={"email": "security@campusfind.edu", "password": "security123"})
    sec_headers = {"Authorization": f"Bearer {sec_login.json()['access_token']}"}

    admin_login = client.post("/auth/login", json={"email": "admin@campusfind.edu", "password": "admin123"})
    admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}

    # Register student
    stu = client.post("/auth/register", json={
        "name": f"Test Student {uid}",
        "student_id": f"STU_E_{uid}",
        "email": f"test_e_{uid}@campus.edu",
        "password": "password123"
    })
    stu_headers = {"Authorization": f"Bearer {stu.json()['access_token']}"}

    # Found item
    f_res = client.post("/items/found", data={
        "item_name": f"Calculus Book {uid}",
        "category": "Study Materials",
        "location": "Math Dept",
        "date_reported": "2026-09-20",
        "description": "Calculus 10th edition hardcover",
    }, headers=stu_headers)
    found_id = f_res.json()["id"]

    # Register claimant
    stu2 = client.post("/auth/register", json={
        "name": f"Claimant {uid}",
        "student_id": f"STU_C_{uid}",
        "email": f"claimant_{uid}@campus.edu",
        "password": "password123"
    })
    claimant_headers = {"Authorization": f"Bearer {stu2.json()['access_token']}"}

    # Submit claim
    c_res = client.post("/claims", json={
        "item_id": found_id,
        "proof_description": "Book with my name written on page 1",
    }, headers=claimant_headers)
    claim_id = c_res.json()["id"]

    # Admin approves
    client.patch(f"/admin/claims/{claim_id}/review", json={"status": "APPROVED"}, headers=admin_headers)

    otp_res = client.get(f"/claims/{claim_id}/otp", headers=claimant_headers)
    real_otp = otp_res.json()["otp"]

    # ----------------------------------------------------
    # TEST 8: Expired OTP is rejected
    # ----------------------------------------------------
    db = SessionLocal()
    try:
        db_claim = db.query(Claim).filter(Claim.id == uuid.UUID(claim_id)).first()
        # Set expiration in past
        db_claim.otp_expires_at = datetime.datetime.utcnow() - datetime.timedelta(days=1)
        db.commit()
    finally:
        db.close()

    expired_res = client.post(f"/security/collections/{claim_id}/verify-otp", json={"otp": real_otp}, headers=sec_headers)
    assert expired_res.status_code == 400
    assert "expired" in expired_res.json()["detail"].lower()

    # Reset expiration and mark item as already RETURNED
    db = SessionLocal()
    try:
        db_claim = db.query(Claim).filter(Claim.id == uuid.UUID(claim_id)).first()
        db_claim.otp_expires_at = datetime.datetime.utcnow() + datetime.timedelta(days=3)
        db_item = db.query(Item).filter(Item.id == uuid.UUID(found_id)).first()
        db_item.status = ItemStatus.RETURNED
        db.commit()
    finally:
        db.close()

    # ----------------------------------------------------
    # TEST 10: Returned item cannot be collected again
    # ----------------------------------------------------
    ret_res = client.post(f"/security/collections/{claim_id}/verify-otp", json={"otp": real_otp}, headers=sec_headers)
    assert ret_res.status_code == 400
    assert "already been returned" in ret_res.json()["detail"].lower()


if __name__ == "__main__":
    test_security_desk_complete_workflow()
    test_expired_otp_and_returned_item_rejection()
    print("\nALL 14 SECURITY DESK WORKFLOW TESTS PASSED PERFECTLY!")
