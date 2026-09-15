import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Uuid
from sqlalchemy.orm import relationship
from app.database import Base


class ItemTimeline(Base):
    __tablename__ = "item_timelines"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id = Column(Uuid(as_uuid=True), ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), nullable=False)  # e.g. REPORTED, MATCHED, CLAIM_SUBMITTED, UNDER_REVIEW, APPROVED, READY_FOR_COLLECTION, RETURNED, ARCHIVED
    actor_id = Column(Uuid(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    actor_role = Column(String(50), nullable=True)  # 'FINDER', 'STUDENT', 'ADMIN', 'SYSTEM'
    actor_name = Column(String(100), nullable=True)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    item = relationship("Item", back_populates="timeline_events")
    actor = relationship("User", foreign_keys=[actor_id])
