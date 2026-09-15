import logging
from pathlib import Path
from sqlalchemy.orm import Session
from sqlalchemy import func, inspect, text
from app.database import SessionLocal, engine, Base
import app.models  # noqa: F401 — ensure all models are registered with Base
from app.models.user import User, UserRole
from app.services.auth_service import hash_password, verify_password

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
    2. Ensure required schema columns exist.
    3. Ensure required demo users (Admin and Student) exist and have correct active credentials.
    4. Safely seed the dataset items if CSV is available and database is empty.
    """
    logger.info("[*] Initializing database schema...")
    Base.metadata.create_all(bind=engine)

    # Ensure schema migrations for matches and claims
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        if "matches" in tables:
            columns = [c["name"] for c in inspector.get_columns("matches")]
            if "name_score" not in columns:
                with engine.begin() as conn:
                    conn.execute(text("ALTER TABLE matches ADD COLUMN name_score FLOAT DEFAULT 0.0"))
                logger.info("[+] Added name_score column to matches table")

        if "claims" in tables:
            claim_cols = [c["name"] for c in inspector.get_columns("claims")]
            with engine.begin() as conn:
                if "proof_image_url" not in claim_cols:
                    conn.execute(text("ALTER TABLE claims ADD COLUMN proof_image_url VARCHAR(500)"))
                    logger.info("[+] Added proof_image_url column to claims table")
                if "otp_hash" not in claim_cols:
                    conn.execute(text("ALTER TABLE claims ADD COLUMN otp_hash VARCHAR(255)"))
                    logger.info("[+] Added otp_hash column to claims table")
                if "otp_plain" not in claim_cols:
                    conn.execute(text("ALTER TABLE claims ADD COLUMN otp_plain VARCHAR(10)"))
                    logger.info("[+] Added otp_plain column to claims table")
                if "otp_expires_at" not in claim_cols:
                    conn.execute(text("ALTER TABLE claims ADD COLUMN otp_expires_at DATETIME"))
                    logger.info("[+] Added otp_expires_at column to claims table")
                if "is_otp_used" not in claim_cols:
                    conn.execute(text("ALTER TABLE claims ADD COLUMN is_otp_used BOOLEAN DEFAULT 0"))
                    logger.info("[+] Added is_otp_used column to claims table")
    except Exception as e:
        logger.info(f"[i] Schema check: {e}")


    db: Session = SessionLocal()
    try:
        # 1. Ensure Admin Demo exists and has valid credentials
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
            if not verify_password(ADMIN_PASSWORD, admin.password_hash):
                admin.password_hash = hash_password(ADMIN_PASSWORD)
            admin.role = UserRole.ADMIN
            admin.is_active = True
            logger.info(f"[i] Demo admin verified: {ADMIN_EMAIL}")

        # 2. Ensure Student Demo (STU001) exists and has valid credentials
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
            if not verify_password(STUDENT_PASSWORD, student.password_hash):
                student.password_hash = hash_password(STUDENT_PASSWORD)
            student.email = STUDENT_EMAIL.lower()
            student.student_id = STUDENT_ID
            student.role = UserRole.STUDENT
            student.is_active = True
            logger.info(f"[i] Demo student verified: {STUDENT_EMAIL}")

        db.commit()

        # 3. Safely run dataset seeding if seed script exists and items table is empty
        try:
            from app.models.item import Item
            if db.query(Item).count() == 0:
                try:
                    from seed import seed as run_csv_seed
                except ImportError:
                    from campusfind.backend.seed import seed as run_csv_seed
                run_csv_seed()
        except Exception as seed_err:
            logger.info(f"[i] CSV seeding step: {seed_err}")

    except Exception as e:
        db.rollback()
        logger.error(f"[-] Error during database initialization: {e}")
    finally:
        db.close()
