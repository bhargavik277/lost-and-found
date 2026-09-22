from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.claim import SecurityCollectionOut, ClaimVerifyOTP, SecurityVerificationResponse
from app.services.auth_service import require_security_or_admin
from app.services.claim_service import get_security_collections, verify_claim_otp

router = APIRouter(prefix="/security", tags=["Security Desk"])


@router.get("/collections", response_model=list[SecurityCollectionOut])
def list_all_collections(
    db: Session = Depends(get_db),
    _: User = Depends(require_security_or_admin),
):
    """Retrieve all approved collection records (Pending + Completed)."""
    return get_security_collections(db, status_filter=None)


@router.get("/collections/pending", response_model=list[SecurityCollectionOut])
def list_pending_collections(
    db: Session = Depends(get_db),
    _: User = Depends(require_security_or_admin),
):
    """Retrieve approved collection records waiting for claimant pickup."""
    return get_security_collections(db, status_filter="PENDING")


@router.get("/collections/completed", response_model=list[SecurityCollectionOut])
def list_completed_collections(
    db: Session = Depends(get_db),
    _: User = Depends(require_security_or_admin),
):
    """Retrieve collection history for successfully handed-over items."""
    return get_security_collections(db, status_filter="COMPLETED")


@router.post("/collections/{claim_id}/verify-otp", response_model=SecurityVerificationResponse)
def security_verify_collection_otp(
    claim_id: UUID,
    data: ClaimVerifyOTP,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_security_or_admin),
):
    """
    Security officer verifies the student's 6-digit Collection OTP at the handover desk.
    Transitions the item status to RETURNED and logs the collection.
    """
    try:
        claim = verify_claim_otp(db, claim_id, data.otp, current_user)
        item = claim.item
        claimant = claim.claimant
        return SecurityVerificationResponse(
            success=True,
            message="Collection successfully verified and recorded. Item handed over to student.",
            claim_id=claim.id,
            item_id=claim.item_id,
            item_name=item.item_name if item else "Item",
            claimant_name=claimant.name if claimant else "Student",
            student_id=claimant.student_id if claimant else None,
            collected_at=datetime.now(timezone.utc),
            status="RETURNED",
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
