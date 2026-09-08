from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.notification import NotificationOut
from app.services.auth_service import get_current_user
from app.services.notification_service import (
    get_user_notifications, mark_as_read, mark_all_read, get_unread_count
)

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=list[NotificationOut])
def list_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_user_notifications(db, current_user.id)


@router.get("/unread-count")
def unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return {"count": get_unread_count(db, current_user.id)}


@router.patch("/{notif_id}/read", response_model=NotificationOut)
def read_notification(
    notif_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notif = mark_as_read(db, notif_id, current_user.id)
    if not notif:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Notification not found.")
    return notif


@router.post("/read-all")
def read_all_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    mark_all_read(db, current_user.id)
    return {"message": "All notifications marked as read."}
