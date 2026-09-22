import logging
import uuid as _uuid_mod
from typing import Optional, Union
from uuid import UUID
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.timeline import ItemTimeline

logger = logging.getLogger("campusfind.timeline")


def _to_uuid(val) -> Optional[UUID]:
    """Coerce str or UUID to a UUID object; returns None if val is None."""
    if val is None:
        return None
    if isinstance(val, UUID):
        return val
    try:
        return _uuid_mod.UUID(str(val))
    except (ValueError, AttributeError):
        return None


def record_timeline_event(
    db: Session,
    item_id: Union[UUID, str],
    status: str,
    actor_id: Optional[Union[UUID, str]] = None,
    actor_role: Optional[str] = None,
    actor_name: Optional[str] = None,
    note: Optional[str] = None,
) -> ItemTimeline:
    """Safely records a chain of custody / recovery lifecycle transition event."""
    try:
        event = ItemTimeline(
            item_id=_to_uuid(item_id),
            status=status,
            actor_id=_to_uuid(actor_id),
            actor_role=actor_role,
            actor_name=actor_name,
            note=note,
            created_at=datetime.now(timezone.utc),
        )
        db.add(event)
        # We do not do a separate commit here to allow it to be atomic with parent transaction
        return event
    except Exception as e:
        logger.error(f"Failed to record timeline event for item {item_id}: {e}")
        return None

