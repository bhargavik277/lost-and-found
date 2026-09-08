from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.notification import NotificationType


class NotificationOut(BaseModel):
    id: UUID
    user_id: UUID
    message: str
    type: NotificationType
    is_read: bool
    related_item_id: Optional[UUID]
    related_match_id: Optional[UUID]
    created_at: datetime

    model_config = {"from_attributes": True}
