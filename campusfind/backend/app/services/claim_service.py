import re
import secrets
import hashlib
from typing import Optional, List, Dict, Any, Set
from uuid import UUID
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session, joinedload
from app.models.claim import Claim, ClaimStatus
from app.models.item import Item, ItemStatus, ReportType
from app.models.match import Match
from app.models.user import User, UserRole
from app.models.timeline import ItemTimeline
from app.schemas.claim import ClaimCreate, ClaimReview, EvidenceStrengthInfo
from app.services.notification_service import create_notification
from app.services.timeline_service import record_timeline_event
from app.models.notification import NotificationType


def get_utc_now() -> datetime:
    """Returns current UTC time as a timezone-aware datetime."""
    return datetime.now(timezone.utc)


def normalize_to_utc(dt: Optional[datetime]) -> Optional[datetime]:
    """Coerces any datetime (naive or aware) to timezone-aware UTC."""
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def is_otp_expired(otp_expires_at: Optional[datetime]) -> bool:
    """Safely checks if an OTP expiration datetime is in the past, handling both naive and aware datetimes."""
    if not otp_expires_at:
        return True
    exp_utc = normalize_to_utc(otp_expires_at)
    now_utc = get_utc_now()
    return now_utc > exp_utc


STOPWORDS: Set[str] = {
    "a", "an", "the", "and", "or", "in", "on", "at", "to", "for", "with", "by", "from",
    "is", "was", "are", "were", "it", "its", "my", "of", "about", "after", "near", "this",
    "that", "has", "have", "had", "can", "could", "would", "please", "very", "some"
}


def _tokenize(text: Optional[str]) -> Set[str]:
    """Tokenize and remove common stopwords from text."""
    if not text:
        return set()
    words = re.findall(r"\b[a-zA-Z0-9]{3,}\b", text.lower())
    return {w for w in words if w not in STOPWORDS}


def calculate_evidence_strength(
    found_item: Optional[Item],
    claim: Claim,
    lost_item: Optional[Item] = None,
) -> EvidenceStrengthInfo:
    """
    Computes a transparent, assist-only Evidence Strength indicator.
    Evaluates:
      1. Proof description detail (>30 chars = +25, 10-30 chars = +15)
      2. Distinctive identifiers provided = +20
      3. Approximate time misplaced = +15
      4. Proof image or additional notes = +10
      5. Keyword/feature overlap with found item description/location = up to +25 (5 pts per matched token)
    Total is capped at 95% (never 100% since evidence assists and cannot mathematically prove ownership).
    """
    score = 0
    breakdown = {}

    # 1. Proof description completeness
    desc = (claim.proof_description or "").strip()
    if len(desc) >= 30:
        desc_pts = 25
        desc_note = "Detailed ownership description provided (>30 chars)"
    elif len(desc) >= 10:
        desc_pts = 15
        desc_note = "Basic ownership description provided"
    else:
        desc_pts = 5
        desc_note = "Minimal description"
    score += desc_pts
    breakdown["proof_description"] = {"points": desc_pts, "max": 25, "note": desc_note}

    # 2. Distinctive identifiers
    ident = (claim.distinctive_features or "").strip()
    if ident:
        ident_pts = 20
        ident_note = f"Distinctive identifier/marker provided ({ident[:30]}...)"
    else:
        ident_pts = 0
        ident_note = "No serial number, stickers, or distinctive marks specified"
    score += ident_pts
    breakdown["distinctive_identifiers"] = {"points": ident_pts, "max": 20, "note": ident_note}

    # 3. Approximate time
    time_val = (claim.approximate_time or "").strip()
    if time_val:
        time_pts = 15
        time_note = f"Specific timeframe specified ({time_val[:30]})"
    else:
        time_pts = 0
        time_note = "No specific loss timeframe specified"
    score += time_pts
    breakdown["approximate_time"] = {"points": time_pts, "max": 15, "note": time_note}

    # 4. Proof image or additional notes
    notes = (claim.additional_info or "").strip()
    img = (claim.proof_image_url or "").strip()
    bonus_pts = 0
    bonus_notes = []
    if img:
        bonus_pts += 5
        bonus_notes.append("Claimant proof photo/receipt attached")
    if notes:
        bonus_pts += 5
        bonus_notes.append("Additional verification notes provided")
    score += bonus_pts
    breakdown["additional_evidence"] = {
        "points": bonus_pts,
        "max": 10,
        "note": " & ".join(bonus_notes) if bonus_notes else "No additional notes or images"
    }

    # 5. Semantic keyword overlap between Claim Evidence (+ Lost report) and Found Report
    matched_keywords = []
    if found_item:
        found_tokens = _tokenize(f"{found_item.item_name} {found_item.category} {found_item.location} {found_item.description}")
        claim_tokens = _tokenize(f"{claim.proof_description} {claim.distinctive_features} {claim.additional_info}")
        if lost_item:
            claim_tokens |= _tokenize(f"{lost_item.item_name} {lost_item.description} {lost_item.location}")

        overlap = found_tokens.intersection(claim_tokens)
        matched_keywords = sorted(list(overlap))
        overlap_pts = min(25, len(matched_keywords) * 5)
        score += overlap_pts
        breakdown["keyword_correlation"] = {
            "points": overlap_pts,
            "max": 25,
            "note": f"{len(matched_keywords)} matching keyword(s) with found item report: {', '.join(matched_keywords[:6])}"
        }
    else:
        breakdown["keyword_correlation"] = {"points": 0, "max": 25, "note": "No found item details to correlate"}

    # Cap at 95%
    final_score = min(95, max(10, score))
    level = "High" if final_score >= 75 else ("Moderate" if final_score >= 45 else "Low")

    return EvidenceStrengthInfo(
        score=final_score,
        level=level,
        matched_keywords=matched_keywords,
        breakdown=breakdown,
        disclaimer="Evidence strength is an assistance indicator and does not prove ownership.",
    )


def _enrich_claim_admin(db: Session, claim: Claim) -> Claim:
    """Helper to attach AI Match, Lost Report, Evidence Strength, and Timeline to a Claim."""
    if not claim:
        return claim

    # 1. Look for a Match between this found item and any lost item reported by the claimant
    match = (
        db.query(Match)
        .options(joinedload(Match.lost_item), joinedload(Match.found_item))
        .join(Item, Match.lost_item_id == Item.id)
        .filter(
            Match.found_item_id == claim.item_id,
            Item.reported_by == claim.user_id,
            Item.report_type == ReportType.LOST,
        )
        .order_by(Match.match_score.desc())
        .first()
    )

    lost_item = None
    if match and match.lost_item:
        lost_item = match.lost_item
    else:
        # Check if claimant has reported a lost item matching category or most recent lost report
        if claim.item:
            lost_item = (
                db.query(Item)
                .filter(
                    Item.reported_by == claim.user_id,
                    Item.report_type == ReportType.LOST,
                    Item.category == claim.item.category,
                )
                .order_by(Item.date_reported.desc())
                .first()
            )
        if not lost_item:
            lost_item = (
                db.query(Item)
                .filter(
                    Item.reported_by == claim.user_id,
                    Item.report_type == ReportType.LOST,
                )
                .order_by(Item.date_reported.desc())
                .first()
            )
        if not match:
            match = (
                db.query(Match)
                .options(joinedload(Match.lost_item), joinedload(Match.found_item))
                .filter(Match.found_item_id == claim.item_id)
                .order_by(Match.match_score.desc())
                .first()
            )

    setattr(claim, "match", match)
    setattr(claim, "lost_item", lost_item)

    # 2. Evidence Strength
    evidence_strength = calculate_evidence_strength(claim.item, claim, lost_item)
    setattr(claim, "evidence_strength", evidence_strength)

    # 3. Item Timeline events
    timeline = (
        db.query(ItemTimeline)
        .filter(ItemTimeline.item_id == claim.item_id)
        .order_by(ItemTimeline.created_at.asc())
        .all()
    )
    setattr(claim, "timeline", timeline)

    return claim


def create_claim(db: Session, data: ClaimCreate, user_id: UUID) -> Claim:
    # Check if user already has a pending/approved claim on this item
    existing = db.query(Claim).filter(
        Claim.item_id == data.item_id,
        Claim.user_id == user_id,
        Claim.status.in_([ClaimStatus.PENDING, ClaimStatus.APPROVED]),
    ).first()
    if existing:
        raise ValueError("You already have an active or pending claim for this item.")

    claim = Claim(
        item_id=data.item_id,
        user_id=user_id,
        proof_description=data.proof_description,
        distinctive_features=data.distinctive_features,
        approximate_time=data.approximate_time,
        additional_info=data.additional_info,
        proof_image_url=data.proof_image_url,
    )
    db.add(claim)

    # Update item status to CLAIMED
    item = db.query(Item).filter(Item.id == data.item_id).first()
    if item:
        item.status = ItemStatus.CLAIMED
        # Get claimant name
        claimant = db.query(User).filter(User.id == user_id).first()
        claimant_name = claimant.name if claimant else "Student"
        # Record timeline event
        record_timeline_event(
            db,
            item_id=item.id,
            status="CLAIM_SUBMITTED",
            actor_id=user_id,
            actor_role="STUDENT",
            actor_name=claimant_name,
            note=f"Ownership claim submitted by {claimant_name}",
        )

    db.commit()
    db.refresh(claim)
    return claim


def get_claim(db: Session, claim_id: UUID) -> Optional[Claim]:
    claim = (
        db.query(Claim)
        .options(
            joinedload(Claim.claimant),
            joinedload(Claim.item).joinedload(Item.reporter),
        )
        .filter(Claim.id == claim_id)
        .first()
    )
    if claim:
        _enrich_claim_admin(db, claim)
    return claim


def get_user_claims(db: Session, user_id: UUID) -> List[Claim]:
    return (
        db.query(Claim)
        .options(joinedload(Claim.item))
        .filter(Claim.user_id == user_id)
        .order_by(Claim.created_at.desc())
        .all()
    )


def get_all_claims(db: Session, status: Optional[ClaimStatus] = None) -> List[Claim]:
    q = db.query(Claim).options(
        joinedload(Claim.claimant),
        joinedload(Claim.item).joinedload(Item.reporter),
    )
    if status:
        q = q.filter(Claim.status == status)
    claims = q.order_by(Claim.created_at.desc()).all()
    for c in claims:
        _enrich_claim_admin(db, c)
    return claims


def review_claim(
    db: Session,
    claim: Claim,
    review_data: ClaimReview,
    admin_id: UUID,
) -> Claim:
    claim.status = review_data.status
    claim.reviewed_by = admin_id
    claim.admin_note = review_data.admin_note
    claim.reviewed_at = get_utc_now()

    item = db.query(Item).filter(Item.id == claim.item_id).first()
    admin = db.query(User).filter(User.id == admin_id).first()
    admin_name = admin.name if admin else "Campus Admin"

    if review_data.status == ClaimStatus.APPROVED:
        # Generate secure 6-digit collection OTP
        raw_otp = f"{secrets.randbelow(1000000):06d}"
        claim.otp_plain = raw_otp
        claim.otp_hash = hashlib.sha256(raw_otp.encode()).hexdigest()
        claim.otp_expires_at = get_utc_now() + timedelta(hours=72)
        claim.is_otp_used = False

        if item:
            # Item remains CLAIMED / staged for collection until Security verifies OTP
            item.status = ItemStatus.CLAIMED
            item.updated_at = get_utc_now()

        # Record timeline events
        record_timeline_event(
            db,
            item_id=claim.item_id,
            status="APPROVED",
            actor_id=admin_id,
            actor_role="ADMIN",
            actor_name=admin_name,
            note=f"Claim approved by {admin_name}. Collection OTP generated.",
        )
        record_timeline_event(
            db,
            item_id=claim.item_id,
            status="READY_FOR_COLLECTION",
            actor_id=admin_id,
            actor_role="ADMIN",
            actor_name=admin_name,
            note="Item is staged at Main Campus Security Desk for handover.",
        )

        item_title = item.item_name if item else "item"

        # 1. Notify claimant with OTP and instructions
        create_notification(
            db,
            user_id=claim.user_id,
            message=(
                f"Your claim for '{item_title}' has been approved! "
                f"Your Collection OTP is {raw_otp}. Please visit the Main Security Desk to collect your item."
            ),
            notif_type=NotificationType.CLAIM_APPROVED,
            related_item_id=claim.item_id,
        )

        # 2. Notify Security Desk staff (without plaintext OTP)
        claimant = db.query(User).filter(User.id == claim.user_id).first()
        claimant_name = claimant.name if claimant else "Student"
        student_id_str = claimant.student_id if claimant and claimant.student_id else "No Student ID"
        sec_msg = (
            f"New collection request: '{item_title}' claimed by {claimant_name} ({student_id_str}). "
            f"Verify the student's Collection OTP at the Main Security Desk."
        )

        security_users = db.query(User).filter(User.role == UserRole.SECURITY).all()
        for sec_u in security_users:
            create_notification(
                db,
                user_id=sec_u.id,
                message=sec_msg,
                notif_type=NotificationType.COLLECTION_PENDING,
                related_item_id=claim.item_id,
            )

    elif review_data.status == ClaimStatus.REJECTED:
        if item:
            # Check if there are other pending/approved claims
            other_active = db.query(Claim).filter(
                Claim.item_id == item.id,
                Claim.id != claim.id,
                Claim.status.in_([ClaimStatus.PENDING, ClaimStatus.APPROVED]),
            ).first()
            if not other_active:
                item.status = ItemStatus.ACTIVE

        # Record timeline event
        record_timeline_event(
            db,
            item_id=claim.item_id,
            status="UNDER_REVIEW",
            actor_id=admin_id,
            actor_role="ADMIN",
            actor_name=admin_name,
            note=f"Claim rejected by {admin_name}. {review_data.admin_note or ''}",
        )

        create_notification(
            db,
            user_id=claim.user_id,
            message=f"Your claim for '{item.item_name if item else 'item'}' was not approved. {review_data.admin_note or 'Please contact admin.'}",
            notif_type=NotificationType.CLAIM_REJECTED,
            related_item_id=claim.item_id,
        )

    db.commit()
    db.refresh(claim)
    _enrich_claim_admin(db, claim)
    return claim


def regenerate_claim_otp(
    db: Session,
    claim_id: UUID,
    current_user: User,
) -> tuple[Claim, str]:
    """
    Safely regenerates a 6-digit collection OTP for an approved claim.
    Callable by the claimant student or an Administrator.
    - Generates a new 6-digit OTP
    - Replaces previous OTP hash and plaintext
    - Resets expiration window to 72 hours from now
    - Resets is_otp_used to False
    - Invalidates the previous OTP
    - Creates timeline event and sends notification
    """
    claim = (
        db.query(Claim)
        .options(joinedload(Claim.item), joinedload(Claim.claimant))
        .filter(Claim.id == claim_id)
        .first()
    )
    if not claim:
        raise ValueError("Claim not found.")

    # Authorization: claimant or admin
    if claim.user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise ValueError("You are not authorized to regenerate this collection OTP.")

    if claim.status != ClaimStatus.APPROVED:
        raise ValueError("Cannot regenerate OTP for a claim that is not approved.")

    item = db.query(Item).filter(Item.id == claim.item_id).first()
    if item and item.status == ItemStatus.RETURNED:
        raise ValueError("Item has already been returned and collected. OTP cannot be regenerated.")

    # Generate new 6-digit collection OTP
    raw_otp = f"{secrets.randbelow(1000000):06d}"
    claim.otp_plain = raw_otp
    claim.otp_hash = hashlib.sha256(raw_otp.encode()).hexdigest()
    claim.otp_expires_at = get_utc_now() + timedelta(hours=72)
    claim.is_otp_used = False

    actor_name = current_user.name if current_user else "User"
    actor_role = current_user.role.value if (current_user and current_user.role) else "STUDENT"

    # Record timeline event
    record_timeline_event(
        db,
        item_id=claim.item_id,
        status="OTP_REGENERATED",
        actor_id=current_user.id if current_user else None,
        actor_role=actor_role,
        actor_name=actor_name,
        note=f"Collection OTP regenerated by {actor_name} ({actor_role}). New OTP issued.",
    )

    item_title = item.item_name if item else "item"

    # Notify claimant
    create_notification(
        db,
        user_id=claim.user_id,
        message=(
            f"A new Collection OTP ({raw_otp}) has been generated for '{item_title}'. "
            f"Please present this 6-digit code at the Main Security Desk."
        ),
        notif_type=NotificationType.CLAIM_APPROVED,
        related_item_id=claim.item_id,
    )

    db.commit()
    db.refresh(claim)
    _enrich_claim_admin(db, claim)
    return claim, raw_otp


def verify_claim_otp(
    db: Session,
    claim_id: UUID,
    otp_input: str,
    admin_user: User,
) -> Claim:
    """
    Verifies the collection OTP presented by the claimant at the Security Desk.
    Transitions the item status to RETURNED upon successful verification.
    """
    claim = (
        db.query(Claim)
        .options(joinedload(Claim.item), joinedload(Claim.claimant))
        .filter(Claim.id == claim_id)
        .first()
    )
    if not claim:
        raise ValueError("Claim not found.")

    if claim.status != ClaimStatus.APPROVED:
        raise ValueError("This claim is not approved for collection.")

    if claim.is_otp_used:
        raise ValueError("This collection OTP has already been used.")

    if is_otp_expired(claim.otp_expires_at):
        raise ValueError("This collection OTP has expired. Please ask the student or administrator to regenerate an OTP.")

    item = db.query(Item).filter(Item.id == claim.item_id).first()
    if item and item.status == ItemStatus.RETURNED:
        raise ValueError("Item has already been returned and collected.")

    if not claim.otp_hash and not claim.otp_plain:
        raise ValueError("No collection OTP exists for this claim.")

    input_clean = (otp_input or "").strip()
    input_hash = hashlib.sha256(input_clean.encode()).hexdigest()

    # Constant time comparison
    matches_hash = secrets.compare_digest(input_hash, claim.otp_hash or "")
    matches_plain = secrets.compare_digest(input_clean, claim.otp_plain or "")

    if not matches_hash and not matches_plain:
        raise ValueError("Invalid collection OTP. Please double-check the 6-digit code.")

    # Mark OTP as used
    claim.is_otp_used = True

    # Mark item as RETURNED and recovered
    if item:
        item.status = ItemStatus.RETURNED
        item.recovered = True
        item.updated_at = get_utc_now()

        # Calculate days to recovery if dates exist
        if item.date_reported:
            days = (get_utc_now().date() - item.date_reported).days
            item.days_to_recovery = max(0, days)

    staff_name = admin_user.name if admin_user else "Main Security Desk"
    staff_role = "ADMIN" if (admin_user and admin_user.role == UserRole.ADMIN) else "SECURITY"

    # Record timeline transitions safely (prevent duplicates on repeat verification attempts)
    existing_collected = db.query(ItemTimeline).filter(
        ItemTimeline.item_id == claim.item_id,
        ItemTimeline.status == "COLLECTED",
    ).first()
    if not existing_collected:
        record_timeline_event(
            db,
            item_id=claim.item_id,
            status="COLLECTED",
            actor_id=admin_user.id if admin_user else None,
            actor_role=staff_role,
            actor_name=staff_name,
            note=f"Item collected from Main Security Desk. Verified by {staff_name}.",
        )

    existing_returned = db.query(ItemTimeline).filter(
        ItemTimeline.item_id == claim.item_id,
        ItemTimeline.status == "RETURNED",
    ).first()
    if not existing_returned:
        record_timeline_event(
            db,
            item_id=claim.item_id,
            status="RETURNED",
            actor_id=admin_user.id if admin_user else None,
            actor_role=staff_role,
            actor_name=staff_name,
            note="Item recovery lifecycle completed. Status updated to RETURNED.",
        )

    # Notify claimant
    item_title = item.item_name if item else "item"
    create_notification(
        db,
        user_id=claim.user_id,
        message=f"Item '{item_title}' has been successfully handed over at the Security Desk! Recovery completed.",
        notif_type=NotificationType.ITEM_RETURNED,
        related_item_id=claim.item_id,
    )

    # Notify security staff confirmation
    claimant_name = claim.claimant.name if claim.claimant else "Student"
    if admin_user:
        create_notification(
            db,
            user_id=admin_user.id,
            message=f"Collection completed: '{item_title}' handed over to {claimant_name}.",
            notif_type=NotificationType.ITEM_RETURNED,
            related_item_id=claim.item_id,
        )

    db.commit()
    db.refresh(claim)
    _enrich_claim_admin(db, claim)
    return claim


def get_security_collections(
    db: Session,
    status_filter: Optional[str] = None,
) -> list[dict]:
    """
    Fetches approved claims for the Security Desk dashboard.
    Sanitized — never returns plaintext OTP or OTP hashes.
    """
    q = (
        db.query(Claim)
        .options(
            joinedload(Claim.item),
            joinedload(Claim.claimant),
        )
        .filter(Claim.status == ClaimStatus.APPROVED)
    )

    if status_filter == "PENDING":
        q = q.filter(Claim.is_otp_used == False)
    elif status_filter == "COMPLETED":
        q = q.filter(Claim.is_otp_used == True)

    claims = q.order_by(Claim.reviewed_at.desc(), Claim.created_at.desc()).all()

    results = []
    for c in claims:
        item = c.item
        claimant = c.claimant
        col_status = "COMPLETED" if c.is_otp_used else "PENDING"
        results.append({
            "id": c.id,
            "item_id": c.item_id,
            "item_name": item.item_name if item else "Unknown Item",
            "category": item.category if item else "General",
            "location": item.location if item else "Unknown Location",
            "item_image_url": item.image_url if item else None,
            "claimant_id": c.user_id,
            "claimant_name": claimant.name if claimant else "Student",
            "student_id": claimant.student_id if claimant else None,
            "claimant_email": claimant.email if claimant else "",
            "approved_at": c.reviewed_at,
            "collected_at": c.reviewed_at if c.is_otp_used else None,
            "collection_status": col_status,
            "is_otp_used": c.is_otp_used,
            "status": c.status,
            "admin_note": c.admin_note,
            "created_at": c.created_at,
        })
    return results
