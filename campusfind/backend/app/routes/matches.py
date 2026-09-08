from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.user import User
from app.models.match import Match, MatchStatus
from app.schemas.match import MatchOut, MatchUpdate
from app.services.auth_service import get_current_user
from app.services.item_service import get_user_items

router = APIRouter(prefix="/matches", tags=["Matches"])


@router.get("", response_model=list[MatchOut])
def get_my_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all match suggestions for the current user's lost items."""
    user_item_ids = [item.id for item in get_user_items(db, current_user.id)]

    matches = (
        db.query(Match)
        .options(
            joinedload(Match.lost_item),
            joinedload(Match.found_item),
        )
        .filter(Match.lost_item_id.in_(user_item_ids))
        .order_by(Match.match_score.desc())
        .all()
    )
    return matches


@router.get("/{match_id}", response_model=MatchOut)
def get_match_detail(
    match_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    match = (
        db.query(Match)
        .options(joinedload(Match.lost_item), joinedload(Match.found_item))
        .filter(Match.id == match_id)
        .first()
    )
    if not match:
        raise HTTPException(status_code=404, detail="Match not found.")
    # Only the owner of the lost item or admin can view match details
    from app.models.user import UserRole
    if (match.lost_item.reported_by != current_user.id
            and current_user.role != UserRole.ADMIN):
        raise HTTPException(status_code=403, detail="Access denied.")
    return match


@router.patch("/{match_id}", response_model=MatchOut)
def update_match_status(
    match_id: UUID,
    data: MatchUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a match as ACCEPTED or REJECTED."""
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found.")
    if match.lost_item.reported_by != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied.")

    match.status = data.status
    db.commit()
    db.refresh(match)
    return match
