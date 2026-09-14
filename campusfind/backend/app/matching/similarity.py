"""
Similarity scoring functions for the CampusFind matching engine.
Uses semantic synonym clustering, token alignment, and TF-IDF + cosine similarity.
All similarity functions return a float in [0.0, 1.0].
"""

import re
import difflib
from datetime import date
from typing import Set, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# Canonical synonym clusters for campus items
ITEM_SYNONYM_CLUSTERS = {
    "audio": {
        "earphone", "earphones", "earbud", "earbuds", "headphone", "headphones",
        "airpod", "airpods", "tws", "earpiece", "headset", "buds", "ear pods",
        "wireless earphones", "bluetooth earbuds", "wireless headphones"
    },
    "phone": {
        "phone", "mobile", "smartphone", "iphone", "android", "cellphone", "cell phone",
        "handset", "galaxy", "oneplus", "pixel", "redmi", "realme", "xiaomi"
    },
    "laptop": {
        "laptop", "macbook", "notebook", "chromebook", "ultrabook", "computer", "thinkpad"
    },
    "storage": {
        "usb", "pendrive", "pen drive", "flashdrive", "flash drive", "thumbdrive",
        "thumb drive", "hard drive", "ssd", "hdd", "sd card", "memory card", "flashdisk"
    },
    "bottle": {
        "bottle", "flask", "sipper", "thermos", "waterbottle", "water bottle", "tumbler"
    },
    "charging": {
        "charger", "adapter", "powerbank", "cable", "charging cable", "power bank",
        "lightning cable", "type c cable", "usbc cable", "wire"
    },
    "wallet": {
        "wallet", "purse", "billfold", "cardholder", "card holder", "money clip", "pouch"
    },
    "keys": {
        "keys", "key", "keychain", "key ring", "keyring", "car key", "bike key"
    },
    "id_card": {
        "id card", "identity card", "id", "campus id", "student id", "badge", "idcard"
    },
    "watch": {
        "watch", "smartwatch", "smart watch", "fitness band", "band", "fitbit", "apple watch"
    },
    "glasses": {
        "spectacles", "glasses", "sunglasses", "shades", "specs", "goggles", "eyewear"
    },
    "bag": {
        "backpack", "bag", "rucksack", "handbag", "tote", "tote bag", "duffel", "duffle", "satchel"
    },
    "calculator": {
        "calculator", "scientific calculator", "calc", "casio calculator"
    },
    "umbrella": {
        "umbrella", "parasol"
    },
    "stationery": {
        "notebook", "diary", "register", "journal", "notes", "spiral notebook", "textbook", "book"
    },
    "clothing": {
        "jacket", "hoodie", "sweater", "sweatshirt", "coat", "blazer", "muffler", "cap", "hat"
    }
}

# Inverted index from word/phrase to cluster name
WORD_TO_CLUSTER = {}
for cluster_name, synonyms in ITEM_SYNONYM_CLUSTERS.items():
    for syn in synonyms:
        WORD_TO_CLUSTER[syn.lower()] = cluster_name


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


def normalize_text(text: str) -> str:
    """Lowercase and strip punctuation."""
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    return " ".join(text.split())


def extract_clusters(text: str) -> Set[str]:
    """Extract known semantic clusters present in text."""
    norm = normalize_text(text)
    words = norm.split()
    clusters = set()

    # Check multi-word synonyms first (e.g. 'pen drive', 'water bottle')
    for syn, cluster in WORD_TO_CLUSTER.items():
        if " " in syn and syn in norm:
            clusters.add(cluster)

    # Check single words
    for word in words:
        if word in WORD_TO_CLUSTER:
            clusters.add(WORD_TO_CLUSTER[word])

    return clusters


def validate_chronology(lost_date: date, found_date: date) -> Tuple[bool, str]:
    """
    Stage 1 Hard Filter:
    An item cannot be found before it was reported lost.
    Returns (is_valid, reason).
    """
    if lost_date is None or found_date is None:
        return True, "Chronology valid (date unspecified)"
    if found_date < lost_date:
        return False, f"Found date ({found_date}) is before lost date ({lost_date})"
    return True, "Chronology valid"


def check_item_type_compatibility(name_a: str, name_b: str) -> Tuple[bool, str]:
    """
    Stage 2 Hard Filter:
    Checks whether two item names belong to mutually incompatible core object types.
    Returns (is_compatible, reason).
    """
    clusters_a = extract_clusters(name_a)
    clusters_b = extract_clusters(name_b)

    if clusters_a and clusters_b and not (clusters_a & clusters_b):
        a_types = "/".join(sorted(clusters_a))
        b_types = "/".join(sorted(clusters_b))
        return False, f"Incompatible item types: '{name_a}' ({a_types}) vs '{name_b}' ({b_types})"

    return True, "Compatible item types"


def token_level_semantic_similarity(text_a: str, text_b: str) -> float:
    """
    Computes soft token-level semantic match considering:
    1. Exact token matches
    2. Synonym cluster matches
    3. Character fuzzy similarity for brand/item names
    """
    norm_a = normalize_text(text_a)
    norm_b = normalize_text(text_b)

    if not norm_a or not norm_b:
        return 0.0
    if norm_a == norm_b:
        return 1.0

    tokens_a = norm_a.split()
    tokens_b = norm_b.split()

    clusters_a = extract_clusters(text_a)
    clusters_b = extract_clusters(text_b)

    if clusters_a and clusters_b and not (clusters_a & clusters_b):
        return 0.0

    matched_a = 0.0
    for ta in tokens_a:
        best_match = 0.0
        ca = WORD_TO_CLUSTER.get(ta)
        for tb in tokens_b:
            cb = WORD_TO_CLUSTER.get(tb)
            if ta == tb:
                score = 1.0
            elif ca and cb and ca == cb:
                score = 0.95
            else:
                sim = difflib.SequenceMatcher(None, ta, tb).ratio()
                score = sim if sim > 0.8 else 0.0
            if score > best_match:
                best_match = score
        matched_a += best_match

    matched_b = 0.0
    for tb in tokens_b:
        best_match = 0.0
        cb = WORD_TO_CLUSTER.get(tb)
        for ta in tokens_a:
            ca = WORD_TO_CLUSTER.get(ta)
            if ta == tb:
                score = 1.0
            elif ca and cb and ca == cb:
                score = 0.95
            else:
                sim = difflib.SequenceMatcher(None, ta, tb).ratio()
                score = sim if sim > 0.8 else 0.0
            if score > best_match:
                best_match = score
        matched_b += best_match

    precision = matched_a / len(tokens_a) if tokens_a else 0.0
    recall = matched_b / len(tokens_b) if tokens_b else 0.0

    if precision + recall == 0:
        token_sim = 0.0
    else:
        containment = max(precision, recall)
        avg_f1 = 2 * (precision * recall) / (precision + recall)
        token_sim = 0.6 * avg_f1 + 0.4 * containment

    if clusters_a and clusters_b and (clusters_a & clusters_b):
        token_sim = max(token_sim, 0.75)

    return min(1.0, token_sim)


def item_name_semantic_similarity(name_a: str, name_b: str) -> float:
    """
    Computes semantic similarity specifically for item names.
    Combines token semantic matching with char n-gram TF-IDF.
    """
    compatible, _ = check_item_type_compatibility(name_a, name_b)
    if not compatible:
        return 0.0

    norm_a = normalize_text(name_a)
    norm_b = normalize_text(name_b)

    if not norm_a or not norm_b:
        return 0.0
    if norm_a == norm_b:
        return 1.0

    token_sim = token_level_semantic_similarity(name_a, name_b)

    try:
        vec = TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 4))
        mat = vec.fit_transform([norm_a, norm_b])
        char_sim = float(cosine_similarity(mat[0:1], mat[1:2])[0][0])
    except Exception:
        char_sim = 0.0

    score = 0.7 * token_sim + 0.3 * char_sim
    return max(0.0, min(1.0, score))


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
    Computes TF-IDF cosine similarity between two text strings
    blended with soft token semantic similarity.
    """
    if not text_a or not text_b:
        return 0.0
    texts = [text_a.strip(), text_b.strip()]
    tfidf_score = 0.0
    try:
        vectorizer = TfidfVectorizer(stop_words="english", min_df=1)
        tfidf_matrix = vectorizer.fit_transform(texts)
        tfidf_score = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
    except Exception:
        tfidf_score = 0.0

    token_sim = token_level_semantic_similarity(text_a, text_b)
    combined = max(tfidf_score, 0.5 * tfidf_score + 0.5 * token_sim)
    return min(1.0, combined)


def date_proximity(lost_date: date, found_date: date) -> float:
    """
    Returns a score that decays as the gap between lost date and found date grows.
    Calculated ONLY when found_date >= lost_date.
    - If found_date < lost_date: 0.0
    - Same day: 1.0 (10 pts)
    - 1 day apart: ~0.88 (8.8 pts)
    - 7 days apart: 0.5 (5 pts)
    - 14 days apart: ~0.33 (3.3 pts)
    Formula: 1 / (1 + days_diff / 7)
    """
    if lost_date is None or found_date is None:
        return 0.5  # neutral when date unknown
    if found_date < lost_date:
        return 0.0
    days_diff = (found_date - lost_date).days
    return 1.0 / (1.0 + days_diff / 7.0)
