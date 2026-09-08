import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, Enum, DateTime, ForeignKey, Boolean, Integer, Float, Text, Date, Time, Uuid
from sqlalchemy.orm import relationship
from app.database import Base


class ReportType(str, enum.Enum):
    LOST = "LOST"
    FOUND = "FOUND"


class ItemStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    MATCHED = "MATCHED"
    CLAIMED = "CLAIMED"
    RETURNED = "RETURNED"
    CLOSED = "CLOSED"


class ItemCategory(str, enum.Enum):
    ELECTRONICS = "Electronics"
    PERSONAL_ITEMS = "Personal Items"
    STUDY_MATERIALS = "Study Materials"
    CLOTHING = "Clothing"
    DOCUMENTS = "Documents"
    OTHER = "Other"


class Item(Base):
    __tablename__ = "items"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reported_by = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)
    item_name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String(100), nullable=False)
    date_reported = Column(Date, nullable=False)
    time_reported = Column(String(10), nullable=True)  # stored as HH:MM string
    report_type = Column(Enum(ReportType, native_enum=False), nullable=False)
    image_url = Column(String(500), nullable=True)
    status = Column(Enum(ItemStatus, native_enum=False), default=ItemStatus.ACTIVE, nullable=False)
    # Dataset-derived analytics fields
    recovered = Column(Boolean, nullable=True)
    days_to_recovery = Column(Integer, nullable=True, default=0)
    additional_details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    reporter = relationship("User", back_populates="items", foreign_keys=[reported_by])
    lost_matches = relationship("Match", back_populates="lost_item", foreign_keys="Match.lost_item_id")
    found_matches = relationship("Match", back_populates="found_item", foreign_keys="Match.found_item_id")
    claims = relationship("Claim", back_populates="item")
    survey_response = relationship("SurveyResponse", back_populates="item", uselist=False)
