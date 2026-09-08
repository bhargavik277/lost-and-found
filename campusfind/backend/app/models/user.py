import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, Enum, DateTime, ForeignKey, Boolean, Integer, Float, Text, Date, Time, Uuid
from sqlalchemy.orm import relationship
from app.database import Base


class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"
    ADMIN = "ADMIN"


class User(Base):
    __tablename__ = "users"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(String(20), unique=True, nullable=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole, native_enum=False), default=UserRole.STUDENT, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    items = relationship("Item", back_populates="reporter", foreign_keys="Item.reported_by")
    claims = relationship("Claim", back_populates="claimant", foreign_keys="Claim.user_id")
    notifications = relationship("Notification", back_populates="user")
    reviewed_claims = relationship("Claim", back_populates="reviewer", foreign_keys="Claim.reviewed_by")
