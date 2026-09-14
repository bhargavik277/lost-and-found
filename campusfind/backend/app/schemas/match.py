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
    name_score: float = 0.0
    category_score: float = 0.0
    location_score: float = 0.0
    description_score: float = 0.0
    date_score: float = 0.0
    status: MatchStatus
    created_at: datetime
    lost_item: Optional[ItemOut] = None
    found_item: Optional[ItemOut] = None

    model_config = {"from_attributes": True}


class MatchUpdate(BaseModel):
    status: MatchStatus
