from app.matching.engine import run_matching
from app.matching.scorer import calculate_score, ScoreBreakdown, MATCH_THRESHOLD
from app.matching.similarity import (
    category_similarity,
    location_similarity,
    description_similarity,
    date_proximity,
)

__all__ = [
    "run_matching",
    "calculate_score",
    "ScoreBreakdown",
    "MATCH_THRESHOLD",
    "category_similarity",
    "location_similarity",
    "description_similarity",
    "date_proximity",
]
