from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case

from app.database import get_db
from app.models.user import User, UserRole
from app.models.item import Item, ReportType, ItemStatus
from app.models.match import Match, MatchStatus
from app.models.claim import Claim, ClaimStatus
from app.models.survey import SurveyResponse
from app.schemas.item import ItemOut, ItemUpdate
from app.schemas.claim import ClaimOutAdmin, ClaimReview
from app.schemas.user import UserOut
from app.services.auth_service import get_current_user, require_admin
from app.services.item_service import get_item, update_item
from app.services.claim_service import get_claim, get_all_claims, review_claim

router = APIRouter(prefix="/admin", tags=["Admin"])


# ── Items Management ──────────────────────────────────────────────────────────

@router.get("/items", response_model=list[ItemOut])
def admin_list_items(
    report_type: Optional[ReportType] = Query(None),
    status: Optional[ItemStatus] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    q = db.query(Item)
    if report_type:
        q = q.filter(Item.report_type == report_type)
    if status:
        q = q.filter(Item.status == status)
    return q.order_by(Item.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()


@router.patch("/items/{item_id}", response_model=ItemOut)
def admin_update_item(
    item_id: UUID,
    data: ItemUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    item = get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    return update_item(db, item, data)


# ── Claims Management ─────────────────────────────────────────────────────────

@router.get("/claims", response_model=list[ClaimOutAdmin])
def admin_list_claims(
    status: Optional[ClaimStatus] = Query(None),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return get_all_claims(db, status)


@router.get("/claims/{claim_id}", response_model=ClaimOutAdmin)
def admin_get_claim(
    claim_id: UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    claim = get_claim(db, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found.")
    return claim


@router.patch("/claims/{claim_id}/review", response_model=ClaimOutAdmin)
def admin_review_claim(
    claim_id: UUID,
    data: ClaimReview,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    claim = get_claim(db, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found.")
    return review_claim(db, claim, data, current_user.id)


# ── Users Management ──────────────────────────────────────────────────────────

@router.get("/users", response_model=list[UserOut])
def admin_list_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return db.query(User).order_by(User.created_at.desc()).all()


# ── Analytics ─────────────────────────────────────────────────────────────────

@router.get("/analytics")
def admin_analytics(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """
    Returns all analytics data for the admin dashboard.
    Sourced from the actual database (seeded from the dataset).
    """
    # KPI summary
    total_items = db.query(Item).count()
    total_lost = db.query(Item).filter(Item.report_type == ReportType.LOST).count()
    total_found = db.query(Item).filter(Item.report_type == ReportType.FOUND).count()
    total_returned = db.query(Item).filter(Item.status == ItemStatus.RETURNED).count()
    pending_claims = db.query(Claim).filter(Claim.status == ClaimStatus.PENDING).count()
    active_matches = db.query(Match).filter(Match.status == MatchStatus.SUGGESTED).count()

    recovery_rate = round((total_returned / total_lost * 100), 1) if total_lost > 0 else 0.0

    # Avg days to recovery (only items that were recovered)
    avg_days_row = db.query(func.avg(Item.days_to_recovery)).filter(
        Item.recovered == True,
        Item.days_to_recovery.isnot(None),
        Item.days_to_recovery > 0,
    ).scalar()
    avg_days = round(float(avg_days_row), 1) if avg_days_row else 0.0

    # Items by category
    by_category = db.query(Item.category, func.count(Item.id)).group_by(Item.category).all()

    # Items by location
    by_location = (
        db.query(Item.location, func.count(Item.id))
        .group_by(Item.location)
        .order_by(func.count(Item.id).desc())
        .all()
    )

    # Lost item hotspots (lost only, sorted by count)
    hotspots = (
        db.query(Item.location, func.count(Item.id).label("count"))
        .filter(Item.report_type == ReportType.LOST)
        .group_by(Item.location)
        .order_by(func.count(Item.id).desc())
        .limit(5)
        .all()
    )

    # Most common category per hotspot
    hotspot_data = []
    for loc, count in hotspots:
        top_cat = (
            db.query(Item.category, func.count(Item.id).label("c"))
            .filter(Item.location == loc, Item.report_type == ReportType.LOST)
            .group_by(Item.category)
            .order_by(func.count(Item.id).desc())
            .first()
        )
        hotspot_data.append({
            "location": loc,
            "count": count,
            "top_category": top_cat[0] if top_cat else "N/A",
        })

    # Status distribution
    by_status = db.query(Item.status, func.count(Item.id)).group_by(Item.status).all()

    # Survey analytics (from seeded dataset)
    search_methods = (
        db.query(SurveyResponse.search_method, func.count(SurveyResponse.id))
        .filter(SurveyResponse.search_method.isnot(None))
        .group_by(SurveyResponse.search_method)
        .order_by(func.count(SurveyResponse.id).desc())
        .all()
    )
    difficulties = (
        db.query(SurveyResponse.difficulty, func.count(SurveyResponse.id))
        .filter(SurveyResponse.difficulty.isnot(None))
        .group_by(SurveyResponse.difficulty)
        .order_by(func.count(SurveyResponse.id).desc())
        .all()
    )
    preferred_features = (
        db.query(SurveyResponse.preferred_feature, func.count(SurveyResponse.id))
        .filter(SurveyResponse.preferred_feature.isnot(None))
        .group_by(SurveyResponse.preferred_feature)
        .order_by(func.count(SurveyResponse.id).desc())
        .all()
    )
    usefulness = (
        db.query(SurveyResponse.system_usefulness, func.count(SurveyResponse.id))
        .filter(SurveyResponse.system_usefulness.isnot(None))
        .group_by(SurveyResponse.system_usefulness)
        .all()
    )

    # Days to recovery distribution (buckets)
    recovery_items = db.query(Item.days_to_recovery).filter(
        Item.recovered == True, Item.days_to_recovery.isnot(None), Item.days_to_recovery > 0
    ).all()
    recovery_dist = {"1-2 days": 0, "3-5 days": 0, "6-7 days": 0, "7+ days": 0}
    for (days,) in recovery_items:
        if days <= 2:
            recovery_dist["1-2 days"] += 1
        elif days <= 5:
            recovery_dist["3-5 days"] += 1
        elif days <= 7:
            recovery_dist["6-7 days"] += 1
        else:
            recovery_dist["7+ days"] += 1

    return {
        "kpis": {
            "total_items": total_items,
            "total_lost": total_lost,
            "total_found": total_found,
            "total_returned": total_returned,
            "pending_claims": pending_claims,
            "active_matches": active_matches,
            "recovery_rate": recovery_rate,
            "avg_days_to_recovery": avg_days,
        },
        "by_category": [{"category": c, "count": n} for c, n in by_category],
        "by_location": [{"location": l, "count": n} for l, n in by_location],
        "by_status": [{"status": s.value, "count": n} for s, n in by_status],
        "hotspots": hotspot_data,
        "search_methods": [{"method": m, "count": n} for m, n in search_methods],
        "difficulties": [{"difficulty": d, "count": n} for d, n in difficulties],
        "preferred_features": [{"feature": f, "count": n} for f, n in preferred_features],
        "system_usefulness": [{"rating": r, "count": n} for r, n in usefulness],
        "recovery_distribution": [{"range": k, "count": v} for k, v in recovery_dist.items()],
    }
