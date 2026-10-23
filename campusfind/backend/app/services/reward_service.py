import logging
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.reward import ItemRecovery, UserBadge, BadgeKey
from app.models.claim import Claim, ClaimStatus
from app.models.item import Item, ItemStatus
from app.models.user import User
from app.models.notification import NotificationType
from app.services.notification_service import create_notification

logger = logging.getLogger("campusfind.reward_service")

# Authoritative Milestone Definitions
BADGE_DEFINITIONS = [
    {
        "key": BadgeKey.FIRST_FIND.value,
        "name": "First Find",
        "description": "1 verified successful recovery",
        "threshold": 1,
    },
    {
        "key": BadgeKey.GOOD_SAMARITAN.value,
        "name": "Good Samaritan",
        "description": "3 verified successful recoveries",
        "threshold": 3,
    },
    {
        "key": BadgeKey.CAMPUS_HERO.value,
        "name": "Campus Hero",
        "description": "5 verified successful recoveries",
        "threshold": 5,
    },
    {
        "key": BadgeKey.CAMPUS_LEGEND.value,
        "name": "Campus Legend",
        "description": "10 verified successful recoveries",
        "threshold": 10,
    },
]


def process_item_recovery(db: Session, claim: Claim) -> Optional[ItemRecovery]:
    """
    Authoritative point to record a unique verified recovery and award stars/badges.
    Rules:
      1. A recovery counts ONLY after the workflow confirms item is RETURNED and OTP is used.
      2. The finder (who reported the found item) receives 1 star.
      3. A user cannot award stars to themselves (finder_id != claimant_id).
      4. Unique constraint prevents duplicate stars for the same recovery.
      5. Automatically evaluates and awards milestone badges.
    """
    if not claim:
        return None

    # Must be approved and OTP must be verified/used
    if claim.status != ClaimStatus.APPROVED or not claim.is_otp_used:
        logger.warning(f"Claim {claim.id} is not verified/completed; no recovery awarded.")
        return None

    item = claim.item or db.query(Item).filter(Item.id == claim.item_id).first()
    if not item or item.status != ItemStatus.RETURNED:
        logger.warning(f"Item {claim.item_id} is not marked RETURNED; no recovery awarded.")
        return None

    finder_id = item.reported_by
    claimant_id = claim.user_id

    # Self-claim protection: cannot award stars to self
    if finder_id == claimant_id:
        logger.warning(f"Self-claim detected: finder {finder_id} == claimant {claimant_id}. No star awarded.")
        return None

    # Check for existing recovery on this item
    existing = db.query(ItemRecovery).filter(ItemRecovery.item_id == item.id).first()
    if existing:
        return existing

    # Check for existing recovery on this claim
    existing_claim = db.query(ItemRecovery).filter(ItemRecovery.claim_id == claim.id).first()
    if existing_claim:
        return existing_claim

    try:
        recovery = ItemRecovery(
            item_id=item.id,
            claim_id=claim.id,
            finder_id=finder_id,
            claimant_id=claimant_id,
            stars_awarded=1,
            created_at=datetime.utcnow(),
        )
        db.add(recovery)
        db.flush()

        # Evaluate and unlock milestone badges
        evaluate_and_award_badges(db, finder_id)

        # Notify finder of their earned star
        create_notification(
            db,
            user_id=finder_id,
            message=(
                f"⭐ Verified Recovery! Your found item '{item.item_name}' was safely returned to its owner. "
                f"You earned 1 Star Reputation!"
            ),
            notif_type=NotificationType.ITEM_RETURNED,
            related_item_id=item.id,
        )

        return recovery
    except IntegrityError:
        db.rollback()
        return db.query(ItemRecovery).filter(ItemRecovery.item_id == item.id).first()
    except Exception as e:
        logger.error(f"Error processing item recovery: {e}")
        return None


def evaluate_and_award_badges(db: Session, user_id: UUID) -> List[UserBadge]:
    """
    Recalculates eligibility using the authoritative verified recovery count.
    Unlocks badges safely and idempotently.
    """
    recovery_count = (
        db.query(ItemRecovery)
        .filter(ItemRecovery.finder_id == user_id)
        .count()
    )

    existing_badges = {
        b.badge_key: b for b in db.query(UserBadge).filter(UserBadge.user_id == user_id).all()
    }

    newly_awarded = []
    for badge_def in BADGE_DEFINITIONS:
        b_key = badge_def["key"]
        threshold = badge_def["threshold"]

        if recovery_count >= threshold and b_key not in existing_badges:
            badge = UserBadge(
                user_id=user_id,
                badge_key=b_key,
                badge_name=badge_def["name"],
                description=badge_def["description"],
                threshold=threshold,
                unlocked_at=datetime.utcnow(),
            )
            db.add(badge)
            try:
                db.flush()
                newly_awarded.append(badge)

                # Celebration notification
                create_notification(
                    db,
                    user_id=user_id,
                    message=(
                        f"🏆 Achievement Unlocked: {badge_def['name']}! "
                        f"You reached {threshold} verified recoveries on campus."
                    ),
                    notif_type=NotificationType.ITEM_RETURNED,
                )
            except IntegrityError:
                db.rollback()

    return newly_awarded


def get_user_rewards(db: Session, user_id: UUID) -> Dict[str, Any]:
    """
    Computes authoritative star reputation, badges, progress towards milestones,
    and recent verified recoveries for a user.
    """
    # Evaluate any pending badge awards first
    evaluate_and_award_badges(db, user_id)

    verified_recoveries = (
        db.query(ItemRecovery)
        .filter(ItemRecovery.finder_id == user_id)
        .count()
    )
    total_stars = verified_recoveries  # 1 star for each unique verified recovery

    user_badges_dict = {
        b.badge_key: b
        for b in db.query(UserBadge).filter(UserBadge.user_id == user_id).all()
    }

    badges_out = []
    next_milestone = None

    for badge_def in BADGE_DEFINITIONS:
        b_key = badge_def["key"]
        threshold = badge_def["threshold"]
        badge_record = user_badges_dict.get(b_key)
        is_unlocked = badge_record is not None or verified_recoveries >= threshold

        progress = min(100, int((verified_recoveries / threshold) * 100)) if threshold > 0 else 100
        current_count = min(verified_recoveries, threshold)

        badges_out.append({
            "key": b_key,
            "name": badge_def["name"],
            "description": badge_def["description"],
            "threshold": threshold,
            "is_unlocked": is_unlocked,
            "unlocked_at": badge_record.unlocked_at if badge_record else None,
            "progress": progress,
            "current_count": current_count,
        })

        if not is_unlocked and next_milestone is None:
            next_milestone = {
                "key": b_key,
                "name": badge_def["name"],
                "threshold": threshold,
                "remaining": max(0, threshold - verified_recoveries),
                "progress": progress,
            }

    # Fetch recent recoveries credited to this user
    recent_records = (
        db.query(ItemRecovery)
        .filter(ItemRecovery.finder_id == user_id)
        .order_by(ItemRecovery.created_at.desc())
        .limit(5)
        .all()
    )

    recent_recoveries = []
    for r in recent_records:
        item = r.item or db.query(Item).filter(Item.id == r.item_id).first()
        recent_recoveries.append({
            "item_id": r.item_id,
            "item_name": item.item_name if item else "Recovered Item",
            "category": item.category if item else "General",
            "verified_at": r.created_at,
            "stars_awarded": r.stars_awarded,
        })

    return {
        "user_id": user_id,
        "total_stars": total_stars,
        "verified_recoveries": verified_recoveries,
        "badges": badges_out,
        "next_milestone": next_milestone,
        "recent_recoveries": recent_recoveries,
    }
