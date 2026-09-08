"""
Similarity scoring functions for the CampusFind matching engine.
Uses TF-IDF + cosine similarity for description matching.
All functions return a float in [0.0, 1.0].
"""

import math
from datetime import date
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# Campus location zones — items in the same zone get partial credit
LOCATION_ZONES = {
    "Library": "academic",
    "Computer Lab": "academic",
    "Classroom": "academic",
    "Laboratory": "academic",
    "Auditorium": "events",
    "Canteen": "social",
    "Corridor": "transit",
    "Parking": "outdoor",
    "Playground": "outdoor",
    "Sports Room": "outdoor",
}


def category_similarity(cat_a: str, cat_b: str) -> float:
    """Exact match = 1.0, else 0.0."""
    return 1.0 if cat_a.strip().lower() == cat_b.strip().lower() else 0.0


def location_similarity(loc_a: str, loc_b: str) -> float:
    """
    Exact match = 1.0
    Same zone = 0.5
    Different = 0.0
    """
    if loc_a.strip().lower() == loc_b.strip().lower():
        return 1.0
    zone_a = LOCATION_ZONES.get(loc_a, "unknown")
    zone_b = LOCATION_ZONES.get(loc_b, "unknown")
    if zone_a == zone_b and zone_a != "unknown":
        return 0.5
    return 0.0


def description_similarity(text_a: str, text_b: str) -> float:
    """
    Computes TF-IDF cosine similarity between two text strings.
    Returns 0.0 if either string is empty.
    """
    if not text_a or not text_b:
        return 0.0
    texts = [text_a.strip(), text_b.strip()]
    try:
        vectorizer = TfidfVectorizer(stop_words="english", min_df=1)
        tfidf_matrix = vectorizer.fit_transform(texts)
        score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(score)
    except Exception:
        return 0.0


def date_proximity(date_a: date, date_b: date) -> float:
    """
    Returns a score that decays as the gap between dates grows.
    Same day = 1.0, 7 days apart ≈ 0.5, 30+ days ≈ 0.03
    Formula: 1 / (1 + |days_diff| / 7)
    """
    if date_a is None or date_b is None:
        return 0.5  # neutral when date unknown
    days_diff = abs((date_a - date_b).days)
    return 1.0 / (1.0 + days_diff / 7.0)


def item_name_similarity(name_a: str, name_b: str) -> float:
    """Exact match on normalised name = 1.0, else TF-IDF similarity."""
    if name_a.strip().lower() == name_b.strip().lower():
        return 1.0
    return description_similarity(name_a, name_b)
