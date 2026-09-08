"""
CampusFind Smart Matching Engine

When a LOST item is submitted → compares against FOUND items.
When a FOUND item is submitted → compares against LOST items.

Modular design: swap scorer/similarity modules to upgrade from TF-IDF
to sentence embeddings without changing this orchestrator.
"""
from typing import List
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.item import Item, ReportType, ItemStatus
from app.models.match import Match, MatchStatus
from app.matching.scorer import calculate_score, MATCH_THRESHOLD
from app.services.notification_service import create_notification
from app.models.notification import NotificationType


def run_matching(new_item: Item, db: Session) -> List[Match]:
    """
    Run the matching engine for a newly submitted item.
    Compares against opposite-type active items and stores matches above threshold.
    """
    # Determine which pool to search
    opposite_type = (
        ReportType.FOUND if new_item.report_type == ReportType.LOST else ReportType.LOST
    )

    candidates = (
        db.query(Item)
        .filter(
            Item.report_type == opposite_type,
            Item.status.in_([ItemStatus.ACTIVE, ItemStatus.MATCHED]),
            Item.id != new_item.id,
        )
        .all()
    )

    created_matches: List[Match] = []

    for candidate in candidates:
        # Assign lost/found correctly regardless of which is new
        if new_item.report_type == ReportType.LOST:
            lost_item, found_item = new_item, candidate
        else:
            lost_item, found_item = candidate, new_item

        # Skip if a match between these two already exists
        existing = db.query(Match).filter(
            Match.lost_item_id == lost_item.id,
            Match.found_item_id == found_item.id,
        ).first()
        if existing:
            continue

        breakdown = calculate_score(lost_item, found_item)

        if not breakdown.meets_threshold:
            continue

        # Save match record
        match_record = Match(
            lost_item_id=lost_item.id,
            found_item_id=found_item.id,
            match_score=breakdown.total_score,
            category_score=breakdown.category_score,
            location_score=breakdown.location_score,
            description_score=breakdown.description_score,
            date_score=breakdown.date_score,
            status=MatchStatus.SUGGESTED,
        )
        db.add(match_record)

        # Update item statuses to MATCHED
        if lost_item.status == ItemStatus.ACTIVE:
            lost_item.status = ItemStatus.MATCHED
        if found_item.status == ItemStatus.ACTIVE:
            found_item.status = ItemStatus.MATCHED

        db.commit()
        db.refresh(match_record)
        created_matches.append(match_record)

        # Send notification to the lost-item reporter
        _notify_match(db, lost_item, found_item, match_record, breakdown.total_score)

    return created_matches


def _notify_match(
    db: Session,
    lost_item: Item,
    found_item: Item,
    match: Match,
    score: float,
) -> None:
    """Notify the reporter of the lost item about a possible match."""
    strength = "strong" if score >= 70 else "possible"
    create_notification(
        db,
        user_id=lost_item.reported_by,
        message=(
            f"A {strength} match ({score:.0f}%) was found for your lost '{lost_item.item_name}'. "
            f"A '{found_item.item_name}' was reported found at {found_item.location}."
        ),
        notif_type=NotificationType.MATCH_FOUND,
        related_item_id=lost_item.id,
        related_match_id=match.id,
    )
