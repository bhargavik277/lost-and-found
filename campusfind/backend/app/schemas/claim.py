from pydantic import BaseModel
from typing import Optional, Any, List
from datetime import datetime
from uuid import UUID
from app.models.claim import ClaimStatus
from app.schemas.item import ItemOut, ItemTimelineOut
from app.schemas.match import MatchOut


class ClaimCreate(BaseModel):
    item_id: UUID
    proof_description: str
    distinctive_features: Optional[str] = None
    approximate_time: Optional[str] = None
    additional_info: Optional[str] = None
    proof_image_url: Optional[str] = None


class ClaimReview(BaseModel):
    status: ClaimStatus
    admin_note: Optional[str] = None


class ClaimVerifyOTP(BaseModel):
    otp: str


class ClaimantInfo(BaseModel):
    id: UUID
    name: str
    student_id: Optional[str] = None
    email: str

    model_config = {"from_attributes": True}


class EvidenceStrengthInfo(BaseModel):
    score: int
    level: str  # High, Moderate, Low
    matched_keywords: List[str] = []
    breakdown: dict[str, Any] = {}
    disclaimer: str = "Evidence strength is an assistance indicator and does not prove ownership."


class ClaimOut(BaseModel):
    id: UUID
    item_id: UUID
    user_id: UUID
    # Note: sensitive verification details are only returned to the claimant or admin
    status: ClaimStatus
    admin_note: Optional[str] = None
    created_at: datetime
    reviewed_at: Optional[datetime] = None
    claimant: Optional[ClaimantInfo] = None
    item: Optional[ItemOut] = None
    otp_plain: Optional[str] = None
    otp_expires_at: Optional[datetime] = None
    is_otp_used: Optional[bool] = False

    model_config = {"from_attributes": True}


class ClaimOutAdmin(ClaimOut):
    """Extended claim schema for admin use — includes private verification fields, AI match breakdown, evidence strength, and claimant's lost report."""
    proof_description: str
    distinctive_features: Optional[str] = None
    approximate_time: Optional[str] = None
    additional_info: Optional[str] = None
    proof_image_url: Optional[str] = None
    match: Optional[MatchOut] = None
    lost_item: Optional[ItemOut] = None
    evidence_strength: Optional[EvidenceStrengthInfo] = None
    timeline: Optional[List[ItemTimelineOut]] = None


