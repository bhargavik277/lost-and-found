import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, UniqueConstraint, Uuid
from sqlalchemy.orm import relationship
from app.database import Base


class BadgeKey(str, enum.Enum):
    FIRST_FIND = "FIRST_FIND"
    GOOD_SAMARITAN = "GOOD_SAMARITAN"
    CAMPUS_HERO = "CAMPUS_HERO"
    CAMPUS_LEGEND = "CAMPUS_LEGEND"


class ItemRecovery(Base):
    """
    Authoritative record of a unique, verified item recovery.
    Created ONLY when an approved claim's OTP is verified and the item is confirmed RETURNED.
    """
    __tablename__ = "item_recoveries"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id = Column(Uuid(as_uuid=True), ForeignKey("items.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    claim_id = Column(Uuid(as_uuid=True), ForeignKey("claims.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    finder_id = Column(Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    claimant_id = Column(Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    stars_awarded = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    item = relationship("Item", foreign_keys=[item_id])
    claim = relationship("Claim", foreign_keys=[claim_id])
    finder = relationship("User", foreign_keys=[finder_id])
    claimant = relationship("User", foreign_keys=[claimant_id])


class UserBadge(Base):
    """
    Unlocked achievement badges for users.
    Idempotent and locked by unique constraint (user_id, badge_key).
    """
    __tablename__ = "user_badges"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    badge_key = Column(String(50), nullable=False)
    badge_name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    threshold = Column(Integer, nullable=False)
    unlocked_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "badge_key", name="uq_user_badge"),
    )

    # Relationships
    user = relationship("User", foreign_keys=[user_id])
