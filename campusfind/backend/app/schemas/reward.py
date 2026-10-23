from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class BadgeOut(BaseModel):
    key: str
    name: str
    description: str
    threshold: int
    is_unlocked: bool
    unlocked_at: Optional[datetime] = None
    progress: int  # 0 to 100 percentage
    current_count: int

    model_config = {"from_attributes": True}


class MilestoneOut(BaseModel):
    key: str
    name: str
    threshold: int
    remaining: int
    progress: int

    model_config = {"from_attributes": True}


class RecentRecoveryOut(BaseModel):
    item_id: UUID
    item_name: str
    category: str
    verified_at: datetime
    stars_awarded: int = 1

    model_config = {"from_attributes": True}


class UserRewardsSummaryOut(BaseModel):
    user_id: UUID
    total_stars: int
    verified_recoveries: int
    badges: List[BadgeOut]
    next_milestone: Optional[MilestoneOut] = None
    recent_recoveries: List[RecentRecoveryOut] = []

    model_config = {"from_attributes": True}
