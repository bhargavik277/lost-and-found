"""
Weighted score calculator for CampusFind matching engine.
Combines individual similarity scores into a final match score
with explainability breakdown.

Weights:
- Item/name semantic similarity: 30%
- Category: 20%
- Location: 20%
- Description: 20%
- Date proximity: 10%
"""
from dataclasses import dataclass
from typing import Optional, List, Dict, Any
from app.matching.similarity import (
    validate_chronology,
    check_item_type_compatibility,
    item_name_semantic_similarity,
    category_similarity,
    location_similarity,
    description_similarity,
    date_proximity,
)
from app.models.item import Item

# Weights sum exactly to 1.0 (100%)
WEIGHTS = {
    "name": 0.30,
    "category": 0.20,
    "location": 0.20,
    "description": 0.20,
    "date": 0.10,
}

# Minimum match score threshold (0-100) to record a match
MATCH_THRESHOLD = 40.0


@dataclass
class ScoreBreakdown:
    """Holds individual and total match scores (0-100 scale)."""
    name_score: float         # max 30
    category_score: float     # max 20
    location_score: float     # max 20
    description_score: float  # max 20
    date_score: float         # max 10
    total_score: float        # max 100
    is_valid_match: bool = True
    rejection_reason: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name_score": round(self.name_score, 2),
            "category_score": round(self.category_score, 2),
            "location_score": round(self.location_score, 2),
            "description_score": round(self.description_score, 2),
            "date_score": round(self.date_score, 2),
            "match_score": round(self.total_score, 2),
            "is_valid_match": self.is_valid_match,
            "rejection_reason": self.rejection_reason,
            "match_label": self.match_label,
            "claim_allowed": self.claim_allowed,
        }

    @property
    def match_label(self) -> str:
        if not self.is_valid_match:
            return f"INVALID ({self.rejection_reason})" if self.rejection_reason else "INVALID"
        if self.total_score >= 80.0:
            return "Strong Match"
        elif self.total_score >= 60.0:
            return "Possible Match"
        elif self.total_score >= 40.0:
            return "Weak Match"
        else:
            return "Low Match"

    @property
    def is_strong_match(self) -> bool:
        return self.is_valid_match and self.total_score >= 80.0

    @property
    def meets_threshold(self) -> bool:
        """Only valid candidates meeting MATCH_THRESHOLD are eligible."""
        return self.is_valid_match and self.total_score >= MATCH_THRESHOLD

    @property
    def claim_allowed(self) -> bool:
        """Claim submission is permitted only for valid candidates meeting threshold."""
        return self.meets_threshold

    def explain(self) -> List[Dict[str, Any]]:
        """Returns human-readable explanation items for the frontend."""
        if not self.is_valid_match:
            return [{"icon": "✗", "text": self.rejection_reason, "positive": False}]

        explanations = []

        if self.name_score >= 20:
            explanations.append({"icon": "✓", "text": "High item name semantic match", "positive": True})
        elif self.name_score >= 10:
            explanations.append({"icon": "~", "text": "Partial item name match", "positive": True})
        else:
            explanations.append({"icon": "✗", "text": "Low item name similarity", "positive": False})

        if self.category_score >= 18:
            explanations.append({"icon": "✓", "text": "Same category", "positive": True})
        else:
            explanations.append({"icon": "✗", "text": "Different category", "positive": False})

        if self.location_score >= 16:
            explanations.append({"icon": "✓", "text": "Same location", "positive": True})
        elif self.location_score >= 8:
            explanations.append({"icon": "~", "text": "Nearby location zone", "positive": True})
        else:
            explanations.append({"icon": "✗", "text": "Different location", "positive": False})

        if self.description_score >= 12:
            explanations.append({"icon": "✓", "text": "Similar description keywords", "positive": True})
        else:
            explanations.append({"icon": "~", "text": "Partial description match", "positive": False})

        if self.date_score >= 7:
            explanations.append({"icon": "✓", "text": "Reported within close dates", "positive": True})
        else:
            explanations.append({"icon": "~", "text": "Reported days apart", "positive": False})

        return explanations


def calculate_score(lost_item: Item, found_item: Item) -> ScoreBreakdown:
    """
    Calculates weighted match score between a lost and found item.
    Executes a 3-stage validation pipeline:
      1. Hard Chronological Filter (found_date >= lost_date)
      2. Hard Incompatible Item Type Filter
      3. 5-Component Weighted Matching
    """
    # 1. HARD CHRONOLOGICAL VALIDITY CHECK
    chrono_valid, chrono_reason = validate_chronology(lost_item.date_reported, found_item.date_reported)
    if not chrono_valid:
        return ScoreBreakdown(
            name_score=0.0,
            category_score=0.0,
            location_score=0.0,
            description_score=0.0,
            date_score=0.0,
            total_score=0.0,
            is_valid_match=False,
            rejection_reason="Impossible Chronology",
        )

    # 2. HARD INCOMPATIBLE ITEM-TYPE CHECK
    type_compatible, type_reason = check_item_type_compatibility(lost_item.item_name, found_item.item_name)
    if not type_compatible:
        return ScoreBreakdown(
            name_score=0.0,
            category_score=0.0,
            location_score=0.0,
            description_score=0.0,
            date_score=0.0,
            total_score=0.0,
            is_valid_match=False,
            rejection_reason="Incompatible Item Type",
        )

    # 3. 5-COMPONENT WEIGHTED SCORING
    name_raw = item_name_semantic_similarity(lost_item.item_name, found_item.item_name)
    cat_raw = category_similarity(lost_item.category, found_item.category)
    loc_raw = location_similarity(lost_item.location, found_item.location)
    desc_raw = description_similarity(lost_item.description or "", found_item.description or "")
    date_raw = date_proximity(lost_item.date_reported, found_item.date_reported)

    name_score = name_raw * WEIGHTS["name"] * 100
    cat_score = cat_raw * WEIGHTS["category"] * 100
    loc_score = loc_raw * WEIGHTS["location"] * 100
    desc_score = desc_raw * WEIGHTS["description"] * 100
    date_score = date_raw * WEIGHTS["date"] * 100

    total = name_score + cat_score + loc_score + desc_score + date_score

    return ScoreBreakdown(
        name_score=name_score,
        category_score=cat_score,
        location_score=loc_score,
        description_score=desc_score,
        date_score=date_score,
        total_score=total,
        is_valid_match=True,
    )
