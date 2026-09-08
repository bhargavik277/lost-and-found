import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, Enum, DateTime, ForeignKey, Float, Uuid
from sqlalchemy.orm import relationship
from app.database import Base


class MatchStatus(str, enum.Enum):
    SUGGESTED = "SUGGESTED"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"


class Match(Base):
    __tablename__ = "matches"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lost_item_id = Column(Uuid(as_uuid=True), ForeignKey("items.id"), nullable=False)
    found_item_id = Column(Uuid(as_uuid=True), ForeignKey("items.id"), nullable=False)

    # Weighted scores (0.0 - 1.0 scale, then multiply by weight for display)
    match_score = Column(Float, nullable=False)       # overall 0-100
    category_score = Column(Float, default=0.0)       # 0-30
    location_score = Column(Float, default=0.0)       # 0-25
    description_score = Column(Float, default=0.0)    # 0-25
    date_score = Column(Float, default=0.0)            # 0-20

    status = Column(Enum(MatchStatus, native_enum=False), default=MatchStatus.SUGGESTED, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    lost_item = relationship("Item", back_populates="lost_matches", foreign_keys=[lost_item_id])
    found_item = relationship("Item", back_populates="found_matches", foreign_keys=[found_item_id])
