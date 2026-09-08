"""
CampusFind Database Seeder
==========================
Reads the hypothetical Lost & Found dataset CSV and inserts sample records
into PostgreSQL. Idempotent — safe to run multiple times.

Column mapping (CSV → Database):
    Student_ID       → users.student_id
    Item_Name        → items.item_name
    Category         → items.category
    Location         → items.location
    Date_Reported    → items.date_reported
    Time_Reported    → items.time_reported
    Report_Type      → items.report_type
    Recovered        → items.recovered
    Days_To_Recovery → items.days_to_recovery
    Status           → items.status
    Search_Method    → survey_responses.search_method
    Difficulty       → survey_responses.difficulty
    System_Usefulness→ survey_responses.system_usefulness
    Preferred_Feature→ survey_responses.preferred_feature
"""

import sys
import os
import csv
from datetime import datetime, date
from pathlib import Path

# Add backend directory to path so we can import app modules
sys.path.insert(0, str(Path(__file__).parent))

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from app.database import SessionLocal, engine, Base
import app.models  # noqa — ensures all models are registered with Base
from app.models.user import User, UserRole
from app.models.item import Item, ReportType, ItemStatus
from app.models.survey import SurveyResponse
from app.services.auth_service import hash_password

# ── Configuration ─────────────────────────────────────────────────────────────

# Search for dataset file across project directories
candidate_dirs = [
    Path(__file__).resolve().parent.parent.parent / "data",
    Path(__file__).resolve().parent.parent / "data",
    Path(__file__).resolve().parent / "data",
    Path.cwd().parent / "data",
    Path.cwd() / "data",
]

CSV_PATH = None
for cdir in candidate_dirs:
    for filename in [
        "hypothetical_lost_and_found_dataset (1).csv",
        "hypothetical_lost_and_found_dataset.csv",
    ]:
        p = cdir / filename
        if p.exists():
            CSV_PATH = p
            break
    if CSV_PATH:
        break

if not CSV_PATH:
    CSV_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "hypothetical_lost_and_found_dataset.csv"

ADMIN_EMAIL = "admin@campusfind.edu"
ADMIN_PASSWORD = "admin123"
ADMIN_NAME = "CampusFind Admin"

# Status mapping: CSV → ItemStatus enum
STATUS_MAP = {
    "Active": ItemStatus.ACTIVE,
    "Returned": ItemStatus.RETURNED,
    "Matched": ItemStatus.MATCHED,
}

# Valid categories from dataset
VALID_CATEGORIES = {
    "Electronics", "Personal Items", "Study Materials", "Clothing", "Documents"
}


def clean_str(val: str) -> str | None:
    val = val.strip()
    return val if val and val.upper() not in ("N/A", "NA", "") else None


def parse_recovered(val: str) -> bool | None:
    val = val.strip().lower()
    if val == "yes":
        return True
    elif val == "no":
        return False
    return None


def parse_days(val: str) -> int:
    try:
        return int(float(val.strip()))
    except (ValueError, AttributeError):
        return 0


def parse_date(val: str) -> date:
    return datetime.strptime(val.strip(), "%Y-%m-%d").date()


def seed():
    print("[*] CampusFind Database Seeder")
    print("=" * 50)

    # Create all tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # ── Create admin user ────────────────────────────────────────────────
        admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if not admin:
            admin = User(
                name=ADMIN_NAME,
                email=ADMIN_EMAIL,
                password_hash=hash_password(ADMIN_PASSWORD),
                role=UserRole.ADMIN,
                student_id=None,
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            print(f"[+] Admin created: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
        else:
            print(f"[i] Admin already exists: {ADMIN_EMAIL}")

        # ── Read CSV ─────────────────────────────────────────────────────────
        if not CSV_PATH.exists():
            print(f"[-] CSV not found at: {CSV_PATH}")
            print("   Please ensure the dataset file is in the data/ directory.")
            return

        with open(CSV_PATH, newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            rows = list(reader)

        print(f"[+] Found {len(rows)} rows in dataset")

        created_users = 0
        created_items = 0
        skipped = 0

        for row in rows:
            student_id = clean_str(row.get("Student_ID", ""))
            if not student_id:
                skipped += 1
                continue

            # ── Create / get user ────────────────────────────────────────────
            email = f"{student_id.lower()}@campus.edu"
            user = db.query(User).filter(User.student_id == student_id).first()
            if not user:
                user = User(
                    name=f"Student {student_id}",
                    student_id=student_id,
                    email=email,
                    # Default password = student_id (for demo purposes)
                    password_hash=hash_password(student_id),
                    role=UserRole.STUDENT,
                )
                db.add(user)
                db.flush()  # get user.id without full commit
                created_users += 1

            # ── Create item if not already seeded ────────────────────────────
            item_name = clean_str(row.get("Item_Name", "")) or "Unknown Item"
            date_reported_str = clean_str(row.get("Date_Reported", ""))
            if not date_reported_str:
                skipped += 1
                continue

            # Check by student_id + item_name + date to avoid duplicates
            existing_item = db.query(Item).filter(
                Item.reported_by == user.id,
                Item.item_name == item_name,
                Item.date_reported == parse_date(date_reported_str),
            ).first()

            if existing_item:
                skipped += 1
                continue

            category = clean_str(row.get("Category", "")) or "Other"
            if category not in VALID_CATEGORIES:
                category = "Other"

            report_type_str = clean_str(row.get("Report_Type", "")) or "Lost"
            report_type = ReportType.FOUND if report_type_str == "Found" else ReportType.LOST

            status_str = clean_str(row.get("Status", "")) or "Active"
            status = STATUS_MAP.get(status_str, ItemStatus.ACTIVE)

            recovered = parse_recovered(row.get("Recovered", ""))
            days = parse_days(row.get("Days_To_Recovery", "0"))
            time_rep = clean_str(row.get("Time_Reported", ""))

            item = Item(
                reported_by=user.id,
                item_name=item_name,
                category=category,
                description=f"{item_name} reported {report_type_str.lower()} at {clean_str(row.get('Location',''))}",
                location=clean_str(row.get("Location", "")) or "Unknown",
                date_reported=parse_date(date_reported_str),
                time_reported=time_rep,
                report_type=report_type,
                status=status,
                recovered=recovered,
                days_to_recovery=days,
            )
            db.add(item)
            db.flush()

            # ── Create survey response ────────────────────────────────────────
            survey = SurveyResponse(
                item_id=item.id,
                search_method=clean_str(row.get("Search_Method", "")),
                difficulty=clean_str(row.get("Difficulty", "")),
                system_usefulness=clean_str(row.get("System_Usefulness", "")),
                preferred_feature=clean_str(row.get("Preferred_Feature", "")),
            )
            db.add(survey)
            created_items += 1

        db.commit()

        print("\n[+] Seeding complete!")
        print(f"   [-] Users created:  {created_users}")
        print(f"   [-] Items created:  {created_items}")
        print(f"   [-] Rows skipped:   {skipped}")
        print(f"\n[!] Admin login:   {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
        print(f"[!] Student login: stu001@campus.edu / STU001")

    except Exception as e:
        db.rollback()
        print(f"\n[-] Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
