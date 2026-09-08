from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, UserRole
from app.models.item import Item
from app.schemas.claim import ClaimCreate, ClaimReview, ClaimOut, ClaimOutAdmin
from app.services.auth_service import get_current_user
from app.services.claim_service import (
    create_claim, get_claim, get_user_claims, review_claim
)
from app.services.notification_service import create_notification
from app.models.notification import NotificationType

router = APIRouter(prefix="/claims", tags=["Claims"])


@router.post("", response_model=ClaimOut, status_code=status.HTTP_201_CREATED)
def submit_claim(
    data: ClaimCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit an ownership claim for a found item."""
    item = db.query(Item).filter(Item.id == data.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")

    # Cannot claim your own item
    if item.reported_by == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot claim your own report.")

    try:
        claim = create_claim(db, data, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Notify all admins about the new claim
    admins = db.query(User).filter(User.role == UserRole.ADMIN).all()
    for admin in admins:
        create_notification(
            db,
            user_id=admin.id,
            message=f"New claim submitted by {current_user.name} for item '{item.item_name}'.",
            notif_type=NotificationType.CLAIM_SUBMITTED,
            related_item_id=item.id,
        )

    # Notify claimant of submission
    create_notification(
        db,
        user_id=current_user.id,
        message=f"Your claim for '{item.item_name}' has been submitted and is under review.",
        notif_type=NotificationType.CLAIM_SUBMITTED,
        related_item_id=item.id,
    )

    return claim


@router.get("/my", response_model=list[ClaimOut])
def my_claims(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_user_claims(db, current_user.id)


@router.get("/{claim_id}", response_model=ClaimOutAdmin)
def get_claim_detail(
    claim_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Full claim detail — admin only (includes private verification fields)."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required.")
    claim = get_claim(db, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found.")
    return claim


@router.patch("/{claim_id}/approve", response_model=ClaimOut)
def approve_claim(
    claim_id: UUID,
    data: ClaimReview,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Admin approves or rejects a claim."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required.")
    claim = get_claim(db, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found.")
    return review_claim(db, claim, data, current_user.id)
