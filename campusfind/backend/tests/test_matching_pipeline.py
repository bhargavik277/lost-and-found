import sys
from pathlib import Path
from datetime import date
import pytest
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.matching.similarity import (
    validate_chronology,
    check_item_type_compatibility,
    item_name_semantic_similarity,
    category_similarity,
    location_similarity,
    description_similarity,
    date_proximity,
)
from app.matching.scorer import calculate_score
from app.models.item import Item, ReportType, ItemStatus



def create_dummy_item(name, category, location, description, report_date, report_type=ReportType.LOST):
    return Item(
        item_name=name,
        category=category,
        location=location,
        description=description,
        date_reported=report_date,
        report_type=report_type,
        status=ItemStatus.ACTIVE,
    )


def test_chronology_rejection_when_found_before_lost():
    lost = create_dummy_item("Boat Earphones", "Electronics", "Library", "black earphones", date(2026, 9, 11), ReportType.LOST)
    found = create_dummy_item("Boat Earphones", "Electronics", "Library", "black earphones", date(2026, 8, 25), ReportType.FOUND)

    score = calculate_score(lost, found)
    assert not score.is_valid_match
    assert score.total_score == 0.0
    assert not score.meets_threshold
    assert not score.claim_allowed
    assert "Chronology" in score.match_label


def test_incompatible_types_hard_rejection():
    lost = create_dummy_item("Earphone", "Electronics", "Library", "black earphones", date(2026, 9, 11), ReportType.LOST)
    found = create_dummy_item("Mobile Phone", "Electronics", "Library", "black phone found", date(2026, 9, 11), ReportType.FOUND)

    score = calculate_score(lost, found)
    assert not score.is_valid_match
    assert score.total_score == 0.0
    assert not score.meets_threshold
    assert not score.claim_allowed
    assert "Incompatible Item Type" in score.match_label


def test_incompatible_earphone_and_usb_drive():
    lost = create_dummy_item("Earphone", "Electronics", "Library", "black earphones", date(2026, 9, 11), ReportType.LOST)
    found = create_dummy_item("USB Drive", "Electronics", "Library", "SanDisk flash drive", date(2026, 9, 11), ReportType.FOUND)

    score = calculate_score(lost, found)
    assert not score.is_valid_match
    assert score.total_score == 0.0
    assert not score.meets_threshold
    assert not score.claim_allowed


def test_valid_semantic_synonyms_boat_earphones():
    lost = create_dummy_item("Boat Earphones", "Electronics", "Library", "black wireless earphones with charging case", date(2026, 9, 11), ReportType.LOST)
    found = create_dummy_item("Boat Wireless Earphones", "Electronics", "Library", "black Boat Bluetooth earbuds in charging case", date(2026, 9, 11), ReportType.FOUND)

    score = calculate_score(lost, found)
    assert score.is_valid_match
    assert score.name_score >= 20.0
    assert score.category_score == 20.0
    assert score.location_score == 20.0
    assert score.date_score == 10.0
    assert score.total_score >= 80.0
    assert score.match_label == "Strong Match"
    assert score.claim_allowed


def test_valid_semantic_synonyms_phone():
    lost = create_dummy_item("Mobile Phone", "Electronics", "Library", "Samsung Galaxy phone", date(2026, 9, 11), ReportType.LOST)
    found = create_dummy_item("Smartphone", "Electronics", "Library", "Samsung Android smartphone", date(2026, 9, 11), ReportType.FOUND)

    score = calculate_score(lost, found)
    assert score.is_valid_match
    assert score.total_score >= 80.0
    assert score.match_label == "Strong Match"
    assert score.claim_allowed


def test_valid_semantic_synonyms_storage():
    lost = create_dummy_item("USB Drive", "Electronics", "Library", "SanDisk 64GB drive", date(2026, 9, 11), ReportType.LOST)
    found = create_dummy_item("Pendrive", "Electronics", "Library", "SanDisk metal pen drive 64gb", date(2026, 9, 13), ReportType.FOUND)

    score = calculate_score(lost, found)
    assert score.is_valid_match
    assert score.total_score >= 80.0
    assert score.match_label == "Strong Match"
    assert score.claim_allowed


if __name__ == "__main__":
    test_chronology_rejection_when_found_before_lost()
    test_incompatible_types_hard_rejection()
    test_incompatible_earphone_and_usb_drive()
    test_valid_semantic_synonyms_boat_earphones()
    test_valid_semantic_synonyms_phone()
    test_valid_semantic_synonyms_storage()
    print("[SUCCESS] All Matching Pipeline tests passed successfully!")

