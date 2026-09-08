from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.claim import ClaimStatus


class ClaimCreate(BaseModel):
    item_id: UUID
    proof_description: str
    distinctive_features: Optional[str] = None
    approximate_time: Optional[str] = None
    additional_info: Optional[str] = None


class ClaimReview(BaseModel):
    status: ClaimStatus
    admin_note: Optional[str] = None


class ClaimantInfo(BaseModel):
    id: UUID
    name: str
    student_id: Optional[str]
    email: str

    model_config = {"from_attributes": True}


class ClaimOut(BaseModel):
    id: UUID
    item_id: UUID
    user_id: UUID
    # Note: proof_description, distinctive_features, approximate_time are omitted
    # from public-facing responses; they are only available to admins
    status: ClaimStatus
    admin_note: Optional[str]
    created_at: datetime
    reviewed_at: Optional[datetime]
    claimant: Optional[ClaimantInfo] = None

    model_config = {"from_attributes": True}


class ClaimOutAdmin(ClaimOut):
    """Extended claim schema for admin use — includes private verification fields."""
    proof_description: str
    distinctive_features: Optional[str]
    approximate_time: Optional[str]
    additional_info: Optional[str]
