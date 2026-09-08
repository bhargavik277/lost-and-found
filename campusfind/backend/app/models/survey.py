import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Uuid
from sqlalchemy.orm import relationship
from app.database import Base


class SurveyResponse(Base):
    """
    Stores survey/opinion columns from the dataset (search_method, difficulty,
    system_usefulness, preferred_feature). Separate from operational items table
    to keep analytics and operational data clearly separated.
    """
    __tablename__ = "survey_responses"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id = Column(Uuid(as_uuid=True), ForeignKey("items.id"), unique=True, nullable=False)
    search_method = Column(String(100), nullable=True)
    difficulty = Column(String(200), nullable=True)
    system_usefulness = Column(String(50), nullable=True)
    preferred_feature = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    item = relationship("Item", back_populates="survey_response")
