import logging
from typing import Optional
from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.timeline import ItemTimeline

logger = logging.getLogger("campusfind.timeline")


def record_timeline_event(
    db: Session,
    item_id: UUID,
    status: str,
    actor_id: Optional[UUID] = None,
    actor_role: Optional[str] = None,
    actor_name: Optional[str] = None,
    note: Optional[str] = None,
) -> ItemTimeline:
    """Safely records a chain of custody / recovery lifecycle transition event."""
    try:
        event = ItemTimeline(
            item_id=item_id,
            status=status,
            actor_id=actor_id,
            actor_role=actor_role,
            actor_name=actor_name,
            note=note,
            created_at=datetime.utcnow(),
        )
        db.add(event)
        # We do not do a separate commit here to allow it to be atomic with parent transaction
        return event
    except Exception as e:
        logger.error(f"Failed to record timeline event for item {item_id}: {e}")
        return None
