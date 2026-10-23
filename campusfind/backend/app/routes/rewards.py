from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.reward import UserRewardsSummaryOut
from app.services.auth_service import get_current_user
from app.services.reward_service import get_user_rewards

router = APIRouter(prefix="/rewards", tags=["Rewards & Badges"])


@router.get("/my", response_model=UserRewardsSummaryOut)
def get_my_rewards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve authoritative star reputation and achievement badges for the authenticated user.
    Calculated authoritatively on the backend. Never trusting frontend star counts.
    """
    return get_user_rewards(db, current_user.id)


@router.get("/user/{user_id}", response_model=UserRewardsSummaryOut)
def get_user_public_rewards(
    user_id: UUID,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """
    Retrieve public star reputation and achievement badges for another student.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )
    return get_user_rewards(db, user_id)
