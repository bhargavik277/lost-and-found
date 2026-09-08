import math
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from sqlalchemy.orm import Session
from datetime import date as date_type

from app.database import get_db
from app.models.user import User
from app.models.item import ReportType, ItemStatus
from app.schemas.item import ItemOut, ItemListResponse, ItemUpdate
from app.services.item_service import (
    create_item, get_item, search_items, get_user_items, update_item
)
from app.services.auth_service import get_current_user
from app.matching.engine import run_matching
from app.utils.file_upload import save_upload

router = APIRouter(prefix="/items", tags=["Items"])


@router.get("", response_model=ItemListResponse)
def list_items(
    query: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    report_type: Optional[ReportType] = Query(None),
    status: Optional[ItemStatus] = Query(None),
    date_from: Optional[date_type] = Query(None),
    date_to: Optional[date_type] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Public search — returns all items with optional filters."""
    from app.schemas.item import ItemSearchParams
    params = ItemSearchParams(
        query=query, category=category, location=location,
        report_type=report_type, status=status,
        date_from=date_from, date_to=date_to,
        page=page, page_size=page_size,
    )
    items, total = search_items(db, params)
    return ItemListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total else 0,
    )


@router.get("/my", response_model=list[ItemOut])
def my_items(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all items reported by the current user."""
    return get_user_items(db, current_user.id)


@router.get("/{item_id}", response_model=ItemOut)
def get_item_detail(item_id: UUID, db: Session = Depends(get_db)):
    """Get a single item by ID."""
    item = get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    return item


@router.post("/lost", response_model=ItemOut, status_code=status.HTTP_201_CREATED)
async def report_lost(
    item_name: str = Form(...),
    category: str = Form(...),
    description: Optional[str] = Form(None),
    location: str = Form(...),
    date_reported: date_type = Form(...),
    time_reported: Optional[str] = Form(None),
    additional_details: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Report a lost item. Triggers the matching engine after creation."""
    image_url = None
    if image and image.filename:
        image_url = await save_upload(image, "items")

    from app.schemas.item import ItemCreate
    data = ItemCreate(
        item_name=item_name,
        category=category,
        description=description,
        location=location,
        date_reported=date_reported,
        time_reported=time_reported,
        report_type=ReportType.LOST,
        additional_details=additional_details,
    )
    item = create_item(db, data, current_user.id, image_url)

    # Run matching engine asynchronously (in same request for simplicity)
    try:
        run_matching(item, db)
    except Exception:
        pass  # Matching failure should not fail item creation

    return item


@router.post("/found", response_model=ItemOut, status_code=status.HTTP_201_CREATED)
async def report_found(
    item_name: str = Form(...),
    category: str = Form(...),
    description: Optional[str] = Form(None),
    location: str = Form(...),
    date_reported: date_type = Form(...),
    time_reported: Optional[str] = Form(None),
    additional_details: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Report a found item. Triggers the matching engine after creation."""
    image_url = None
    if image and image.filename:
        image_url = await save_upload(image, "items")

    from app.schemas.item import ItemCreate
    data = ItemCreate(
        item_name=item_name,
        category=category,
        description=description,
        location=location,
        date_reported=date_reported,
        time_reported=time_reported,
        report_type=ReportType.FOUND,
        additional_details=additional_details,
    )
    item = create_item(db, data, current_user.id, image_url)

    try:
        run_matching(item, db)
    except Exception:
        pass

    return item


@router.patch("/{item_id}", response_model=ItemOut)
def update_item_route(
    item_id: UUID,
    data: ItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update an item (owner or admin only)."""
    from app.models.user import UserRole
    item = get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    if item.reported_by != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="You can only update your own items.")
    return update_item(db, item, data)
