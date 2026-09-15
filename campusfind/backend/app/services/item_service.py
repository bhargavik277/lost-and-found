from typing import Optional, List, Tuple
from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_, func
from app.models.item import Item, ReportType, ItemStatus
from app.models.user import User
from app.schemas.item import ItemCreate, ItemUpdate, ItemSearchParams


from app.services.timeline_service import record_timeline_event


def create_item(db: Session, data: ItemCreate, user_id: UUID, image_url: Optional[str] = None) -> Item:
    item = Item(
        reported_by=user_id,
        item_name=data.item_name,
        category=data.category,
        description=data.description,
        location=data.location,
        date_reported=data.date_reported,
        time_reported=data.time_reported,
        report_type=data.report_type,
        image_url=image_url,
        additional_details=data.additional_details,
        status=ItemStatus.ACTIVE,
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    # Record initial timeline event
    user = db.query(User).filter(User.id == user_id).first()
    actor_role = "FINDER" if data.report_type == ReportType.FOUND else "STUDENT"
    actor_name = user.name if user else "Reporter"
    record_timeline_event(
        db,
        item_id=item.id,
        status="REPORTED",
        actor_id=user_id,
        actor_role=actor_role,
        actor_name=actor_name,
        note=f"{data.report_type.value} report logged for '{item.item_name}' at {item.location}",
    )
    db.commit()

    return item



def get_item(db: Session, item_id: UUID) -> Optional[Item]:
    return (
        db.query(Item)
        .options(joinedload(Item.reporter))
        .filter(Item.id == item_id)
        .first()
    )


def search_items(db: Session, params: ItemSearchParams) -> Tuple[List[Item], int]:
    q = db.query(Item).options(joinedload(Item.reporter))

    if params.query:
        search_term = f"%{params.query}%"
        q = q.filter(
            or_(
                Item.item_name.ilike(search_term),
                Item.description.ilike(search_term),
                Item.location.ilike(search_term),
            )
        )
    if params.category:
        q = q.filter(Item.category == params.category)
    if params.location:
        q = q.filter(Item.location.ilike(f"%{params.location}%"))
    if params.report_type:
        q = q.filter(Item.report_type == params.report_type)
    if params.status:
        q = q.filter(Item.status == params.status)
    if params.date_from:
        q = q.filter(Item.date_reported >= params.date_from)
    if params.date_to:
        q = q.filter(Item.date_reported <= params.date_to)

    total = q.count()
    items = (
        q.order_by(Item.created_at.desc())
        .offset((params.page - 1) * params.page_size)
        .limit(params.page_size)
        .all()
    )
    return items, total


def get_user_items(db: Session, user_id: UUID) -> List[Item]:
    return (
        db.query(Item)
        .filter(Item.reported_by == user_id)
        .order_by(Item.created_at.desc())
        .all()
    )


def update_item(db: Session, item: Item, data: ItemUpdate) -> Item:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item


def update_item_status(db: Session, item: Item, status: ItemStatus) -> Item:
    item.status = status
    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item


def get_active_items_by_type(db: Session, report_type: ReportType) -> List[Item]:
    return (
        db.query(Item)
        .filter(Item.report_type == report_type, Item.status == ItemStatus.ACTIVE)
        .all()
    )


def archive_item(db: Session, item: Item, admin_user: Optional[User] = None) -> Item:
    """Safely transitions an item to CLOSED/ARCHIVED status with timeline record."""
    item.status = ItemStatus.CLOSED
    item.updated_at = datetime.utcnow()
    admin_name = admin_user.name if admin_user else "Admin"
    record_timeline_event(
        db,
        item_id=item.id,
        status="ARCHIVED",
        actor_id=admin_user.id if admin_user else None,
        actor_role="ADMIN",
        actor_name=admin_name,
        note=f"Item report archived and closed by {admin_name}",
    )
    db.commit()
    db.refresh(item)
    return item


def delete_item(db: Session, item: Item) -> dict:

    item_id = item.id
    item_name = item.item_name

    # 1. Notify claimants with active/pending claims before removing the report
    from app.models.claim import Claim, ClaimStatus
    from app.models.notification import Notification, NotificationType
    from app.services.notification_service import create_notification

    if item.claims:
        for claim in item.claims:
            if claim.status == ClaimStatus.PENDING:
                create_notification(
                    db,
                    user_id=claim.user_id,
                    message=f"The report for '{item_name}' that you claimed was removed by campus administrators.",
                    notif_type=NotificationType.GENERAL,
                )

    # 2. Clean up any loose notifications referencing this item_id
    db.query(Notification).filter(Notification.related_item_id == item_id).delete(synchronize_session=False)

    # 3. Delete item (SQLAlchemy cascade deletes matches, claims, survey_response)
    db.delete(item)
    db.commit()

    return {"message": "Item deleted successfully.", "deleted_id": str(item_id)}

