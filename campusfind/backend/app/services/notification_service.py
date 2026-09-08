from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.notification import Notification, NotificationType
from app.models.user import UserRole


def create_notification(
    db: Session,
    user_id: UUID,
    message: str,
    notif_type: NotificationType = NotificationType.GENERAL,
    related_item_id: Optional[UUID] = None,
    related_match_id: Optional[UUID] = None,
) -> Notification:
    notif = Notification(
        user_id=user_id,
        message=message,
        type=notif_type,
        related_item_id=related_item_id,
        related_match_id=related_match_id,
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


def get_user_notifications(db: Session, user_id: UUID):
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )


def mark_as_read(db: Session, notif_id: UUID, user_id: UUID) -> Optional[Notification]:
    notif = db.query(Notification).filter(
        Notification.id == notif_id,
        Notification.user_id == user_id,
    ).first()
    if notif:
        notif.is_read = True
        db.commit()
        db.refresh(notif)
    return notif


def mark_all_read(db: Session, user_id: UUID):
    db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False,
    ).update({"is_read": True})
    db.commit()


def get_unread_count(db: Session, user_id: UUID) -> int:
    return db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False,
    ).count()
