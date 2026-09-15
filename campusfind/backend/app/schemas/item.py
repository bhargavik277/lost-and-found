from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime, date
from uuid import UUID
from app.models.item import ReportType, ItemStatus


class ItemCreate(BaseModel):
    item_name: str
    category: str
    description: Optional[str] = None
    location: str
    date_reported: date
    time_reported: Optional[str] = None
    report_type: ReportType
    additional_details: Optional[str] = None

    @field_validator("item_name")
    @classmethod
    def item_name_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Item name cannot be empty")
        return v.strip()

    @field_validator("location")
    @classmethod
    def location_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Location cannot be empty")
        return v.strip()

    @field_validator("description", "time_reported", "additional_details", mode="before")
    @classmethod
    def sanitize_optional_strings(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            trimmed = v.strip()
            return trimmed if trimmed else None
        return v


class ItemUpdate(BaseModel):
    item_name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ItemStatus] = None
    additional_details: Optional[str] = None


class ReporterInfo(BaseModel):
    id: UUID
    name: str
    student_id: Optional[str]

    model_config = {"from_attributes": True}


class ItemTimelineOut(BaseModel):
    id: UUID
    item_id: UUID
    status: str
    actor_id: Optional[UUID] = None
    actor_role: Optional[str] = None
    actor_name: Optional[str] = None
    note: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ItemOut(BaseModel):
    id: UUID
    reported_by: UUID
    item_name: str
    category: str
    description: Optional[str]
    location: str
    date_reported: date
    time_reported: Optional[str]
    report_type: ReportType
    image_url: Optional[str]
    status: ItemStatus
    additional_details: Optional[str]
    days_to_recovery: Optional[int]
    created_at: datetime
    updated_at: datetime
    reporter: Optional[ReporterInfo] = None
    timeline_events: Optional[list[ItemTimelineOut]] = None

    model_config = {"from_attributes": True}



class ItemSearchParams(BaseModel):
    query: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    report_type: Optional[ReportType] = None
    status: Optional[ItemStatus] = None
    date_from: Optional[date] = None
    date_to: Optional[date] = None
    page: int = 1
    page_size: int = 20


class ItemListResponse(BaseModel):
    items: list[ItemOut]
    total: int
    page: int
    page_size: int
    total_pages: int
