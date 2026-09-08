import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, Enum, DateTime, ForeignKey, Text, Uuid
from sqlalchemy.orm import relationship
from app.database import Base


class ClaimStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class Claim(Base):
    __tablename__ = "claims"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id = Column(Uuid(as_uuid=True), ForeignKey("items.id"), nullable=False)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # Ownership verification fields — never shown publicly
    proof_description = Column(Text, nullable=False)
    distinctive_features = Column(Text, nullable=True)
    approximate_time = Column(String(100), nullable=True)
    additional_info = Column(Text, nullable=True)

    status = Column(Enum(ClaimStatus, native_enum=False), default=ClaimStatus.PENDING, nullable=False)
    reviewed_by = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=True)
    admin_note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)

    # Relationships
    item = relationship("Item", back_populates="claims")
    claimant = relationship("User", back_populates="claims", foreign_keys=[user_id])
    reviewer = relationship("User", back_populates="reviewed_claims", foreign_keys=[reviewed_by])
