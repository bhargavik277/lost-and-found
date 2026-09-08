from typing import Optional, List
from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Session, joinedload
from app.models.claim import Claim, ClaimStatus
from app.models.item import Item, ItemStatus
from app.models.user import User
from app.schemas.claim import ClaimCreate, ClaimReview
from app.services.notification_service import create_notification
from app.models.notification import NotificationType


def create_claim(db: Session, data: ClaimCreate, user_id: UUID) -> Claim:
    # Check if user already has a pending/approved claim on this item
    existing = db.query(Claim).filter(
        Claim.item_id == data.item_id,
        Claim.user_id == user_id,
        Claim.status == ClaimStatus.PENDING,
    ).first()
    if existing:
        raise ValueError("You already have a pending claim for this item.")

    claim = Claim(
        item_id=data.item_id,
        user_id=user_id,
        proof_description=data.proof_description,
        distinctive_features=data.distinctive_features,
        approximate_time=data.approximate_time,
        additional_info=data.additional_info,
    )
    db.add(claim)

    # Update item status to CLAIMED
    item = db.query(Item).filter(Item.id == data.item_id).first()
    if item:
        item.status = ItemStatus.CLAIMED
        # Notify admin (handled at route level)

    db.commit()
    db.refresh(claim)
    return claim


def get_claim(db: Session, claim_id: UUID) -> Optional[Claim]:
    return (
        db.query(Claim)
        .options(joinedload(Claim.claimant), joinedload(Claim.item))
        .filter(Claim.id == claim_id)
        .first()
    )


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
        joinedload(Claim.item),
    )
    if status:
        q = q.filter(Claim.status == status)
    return q.order_by(Claim.created_at.desc()).all()


def review_claim(
    db: Session,
    claim: Claim,
    review_data: ClaimReview,
    admin_id: UUID,
) -> Claim:
    claim.status = review_data.status
    claim.reviewed_by = admin_id
    claim.admin_note = review_data.admin_note
    claim.reviewed_at = datetime.utcnow()

    item = db.query(Item).filter(Item.id == claim.item_id).first()

    if review_data.status == ClaimStatus.APPROVED:
        if item:
            item.status = ItemStatus.RETURNED
            item.recovered = True
        # Notify claimant
        create_notification(
            db,
            user_id=claim.user_id,
            message=f"Your claim for '{item.item_name if item else 'item'}' has been approved! Please collect it.",
            notif_type=NotificationType.CLAIM_APPROVED,
            related_item_id=claim.item_id,
        )
    elif review_data.status == ClaimStatus.REJECTED:
        if item:
            item.status = ItemStatus.ACTIVE  # revert back to active
        create_notification(
            db,
            user_id=claim.user_id,
            message=f"Your claim for '{item.item_name if item else 'item'}' was not approved. Please contact the admin for more information.",
            notif_type=NotificationType.CLAIM_REJECTED,
            related_item_id=claim.item_id,
        )

    db.commit()
    db.refresh(claim)
    return claim
