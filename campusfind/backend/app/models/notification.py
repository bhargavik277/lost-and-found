import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, Enum, DateTime, ForeignKey, Boolean, Text, Uuid
from sqlalchemy.orm import relationship
from app.database import Base


class NotificationType(str, enum.Enum):
    MATCH_FOUND = "MATCH_FOUND"
    CLAIM_SUBMITTED = "CLAIM_SUBMITTED"
    CLAIM_APPROVED = "CLAIM_APPROVED"
    CLAIM_REJECTED = "CLAIM_REJECTED"
    ITEM_RETURNED = "ITEM_RETURNED"
    GENERAL = "GENERAL"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(Enum(NotificationType, native_enum=False), default=NotificationType.GENERAL)
    is_read = Column(Boolean, default=False)
    related_item_id = Column(Uuid(as_uuid=True), nullable=True)
    related_match_id = Column(Uuid(as_uuid=True), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="notifications")
