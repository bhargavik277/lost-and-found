"""
Weighted score calculator for CampusFind matching engine.
Combines individual similarity scores into a final match score
with explainability breakdown.
"""
from dataclasses import dataclass
from app.matching.similarity import (
    category_similarity,
    location_similarity,
    description_similarity,
    date_proximity,
    item_name_similarity,
)
from app.models.item import Item

# Weights must sum to 1.0
WEIGHTS = {
    "category": 0.30,
    "location": 0.25,
    "description": 0.25,
    "date": 0.20,
}

# Minimum match score threshold (0-100) to record a match
MATCH_THRESHOLD = 40.0


@dataclass
class ScoreBreakdown:
    """Holds individual and total match scores (0-100 scale)."""
    category_score: float   # max 30
    location_score: float   # max 25
    description_score: float  # max 25
    date_score: float        # max 20
    total_score: float       # max 100

    def to_dict(self) -> dict:
        return {
            "category_score": round(self.category_score, 2),
            "location_score": round(self.location_score, 2),
            "description_score": round(self.description_score, 2),
            "date_score": round(self.date_score, 2),
            "match_score": round(self.total_score, 2),
        }

    @property
    def is_strong_match(self) -> bool:
        return self.total_score >= 70.0

    @property
    def meets_threshold(self) -> bool:
        return self.total_score >= MATCH_THRESHOLD

    def explain(self) -> list[dict]:
        """Returns human-readable explanation items for the frontend."""
        explanations = []
        if self.category_score >= 28:
            explanations.append({"icon": "✓", "text": "Same category", "positive": True})
        else:
            explanations.append({"icon": "✗", "text": "Different category", "positive": False})

        if self.location_score >= 20:
            explanations.append({"icon": "✓", "text": "Same location", "positive": True})
        elif self.location_score >= 10:
            explanations.append({"icon": "~", "text": "Nearby location", "positive": True})
        else:
            explanations.append({"icon": "✗", "text": "Different location", "positive": False})

        if self.description_score >= 15:
            explanations.append({"icon": "✓", "text": "Similar description", "positive": True})
        else:
            explanations.append({"icon": "~", "text": "Partial description match", "positive": False})

        if self.date_score >= 15:
            explanations.append({"icon": "✓", "text": "Similar date/time", "positive": True})
        else:
            explanations.append({"icon": "~", "text": "Different dates", "positive": False})

        return explanations


def calculate_score(lost_item: Item, found_item: Item) -> ScoreBreakdown:
    """
    Calculates weighted match score between a lost and found item.
    All raw similarity values are 0.0–1.0; multiplied by weight × 100 for display.
    """
    # Combine item_name into description for richer text comparison
    lost_text = f"{lost_item.item_name} {lost_item.description or ''}".strip()
    found_text = f"{found_item.item_name} {found_item.description or ''}".strip()

    cat_raw = category_similarity(lost_item.category, found_item.category)
    loc_raw = location_similarity(lost_item.location, found_item.location)
    desc_raw = description_similarity(lost_text, found_text)
    date_raw = date_proximity(lost_item.date_reported, found_item.date_reported)

    cat_score = cat_raw * WEIGHTS["category"] * 100
    loc_score = loc_raw * WEIGHTS["location"] * 100
    desc_score = desc_raw * WEIGHTS["description"] * 100
    date_score = date_raw * WEIGHTS["date"] * 100

    total = cat_score + loc_score + desc_score + date_score

    return ScoreBreakdown(
        category_score=cat_score,
        location_score=loc_score,
        description_score=desc_score,
        date_score=date_score,
        total_score=total,
    )
