from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.match import MatchStatus
from app.schemas.item import ItemOut


class MatchOut(BaseModel):
    id: UUID
    lost_item_id: UUID
    found_item_id: UUID
    match_score: float
    category_score: float
    location_score: float
    description_score: float
    date_score: float
    status: MatchStatus
    created_at: datetime
    lost_item: Optional[ItemOut] = None
    found_item: Optional[ItemOut] = None

    model_config = {"from_attributes": True}


class MatchUpdate(BaseModel):
    status: MatchStatus
