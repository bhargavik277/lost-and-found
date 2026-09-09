import logging
from pathlib import Path
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import SessionLocal, engine, Base
import app.models  # noqa: F401 — ensure all models are registered with Base
from app.models.user import User, UserRole
from app.services.auth_service import hash_password

logger = logging.getLogger("campusfind.init_db")

ADMIN_EMAIL = "admin@campusfind.edu"
ADMIN_PASSWORD = "admin123"
ADMIN_NAME = "CampusFind Admin"

STUDENT_EMAIL = "stu001@campus.edu"
STUDENT_ID = "STU001"
STUDENT_PASSWORD = "STU001"
STUDENT_NAME = "Student STU001"


def init_database():
    """
    Safely initialize the database:
    1. Create all missing tables in PostgreSQL / SQLite.
    2. Ensure required demo users (Admin and Student) exist without altering existing records.
    3. Safely seed the dataset items if CSV is available and database is empty.
    """
    logger.info("[*] Initializing database schema...")
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        # 1. Ensure Admin Demo exists
        admin = db.query(User).filter(func.lower(User.email) == ADMIN_EMAIL.lower()).first()
        if not admin:
            admin = User(
                name=ADMIN_NAME,
                email=ADMIN_EMAIL.lower(),
                password_hash=hash_password(ADMIN_PASSWORD),
                role=UserRole.ADMIN,
                student_id=None,
                is_active=True,
            )
            db.add(admin)
            logger.info(f"[+] Demo admin created: {ADMIN_EMAIL}")
        else:
            logger.info(f"[i] Demo admin already exists: {ADMIN_EMAIL}")

        # 2. Ensure Student Demo (STU001) exists
        student = db.query(User).filter(
            (func.lower(User.email) == STUDENT_EMAIL.lower()) | (User.student_id == STUDENT_ID)
        ).first()
        if not student:
            student = User(
                name=STUDENT_NAME,
                student_id=STUDENT_ID,
                email=STUDENT_EMAIL.lower(),
                password_hash=hash_password(STUDENT_PASSWORD),
                role=UserRole.STUDENT,
                is_active=True,
            )
            db.add(student)
            logger.info(f"[+] Demo student created: {STUDENT_EMAIL}")
        else:
            logger.info(f"[i] Demo student already exists: {STUDENT_EMAIL}")

        db.commit()

        # 3. Safely run dataset seeding if seed script exists
        try:
            from seed import seed as run_csv_seed
            run_csv_seed()
        except Exception as seed_err:
            logger.info(f"[i] CSV seeding step: {seed_err}")

    except Exception as e:
        db.rollback()
        logger.error(f"[-] Error during database initialization: {e}")
    finally:
        db.close()
