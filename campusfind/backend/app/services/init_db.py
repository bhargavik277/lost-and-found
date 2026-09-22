import logging
import sys
from pathlib import Path
from sqlalchemy.orm import Session
from sqlalchemy import func, inspect, text
from app.database import SessionLocal, engine, Base
import app.models.timeline  # ensure ItemTimeline is registered
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

SECURITY_EMAIL = "security@campusfind.edu"
SECURITY_PASSWORD = "security123"
SECURITY_NAME = "Main Security Desk"
SECURITY_STUDENT_ID = "SECURITY-DESK"


def _is_postgres() -> bool:
    """Returns True if the connected database dialect is PostgreSQL."""
    return engine.dialect.name == "postgresql"


def _migrate_item_timelines(inspector):
    """
    Safely migrate item_timelines UUID columns.
    In PostgreSQL: if id/item_id/actor_id are VARCHAR instead of UUID, convert them.
    In SQLite: no-op (SQLite has no native UUID type; SQLAlchemy stores as VARCHAR).
    Data is preserved; no rows are deleted.
    """
    if "item_timelines" not in inspector.get_table_names():
        logger.info("[i] item_timelines table not yet created; will be created by create_all()")
        return

    if not _is_postgres():
        logger.info("[i] Non-PostgreSQL database; skipping item_timelines UUID migration")
        return

    cols = {c["name"]: c for c in inspector.get_columns("item_timelines")}
    uuid_cols = ["id", "item_id", "actor_id"]
    needs_migration = []

    for col_name in uuid_cols:
        if col_name not in cols:
            continue
        col_type = str(cols[col_name]["type"]).upper()
        if "UUID" not in col_type:
            needs_migration.append(col_name)

    if not needs_migration:
        logger.info("[i] item_timelines UUID columns are already correct")
        return

    logger.info(f"[*] Migrating item_timelines columns to UUID type: {needs_migration}")
    try:
        with engine.begin() as conn:
            for col_name in needs_migration:
                if col_name == "id":
                    # id is PK — alter type using USING cast
                    conn.execute(text(
                        "ALTER TABLE item_timelines "
                        "ALTER COLUMN id TYPE UUID USING id::UUID"
                    ))
                    logger.info("[+] item_timelines.id converted to UUID")
                elif col_name == "item_id":
                    conn.execute(text(
                        "ALTER TABLE item_timelines "
                        "ALTER COLUMN item_id TYPE UUID USING item_id::UUID"
                    ))
                    logger.info("[+] item_timelines.item_id converted to UUID")
                elif col_name == "actor_id":
                    conn.execute(text(
                        "ALTER TABLE item_timelines "
                        "ALTER COLUMN actor_id TYPE UUID USING actor_id::UUID"
                    ))
                    logger.info("[+] item_timelines.actor_id converted to UUID")
    except Exception as e:
        logger.error(
            f"[-] item_timelines UUID migration failed. "
            f"If the table has incompatible data, manual migration may be required. "
            f"Error: {e}"
        )


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

    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()

        # -- users: update role check constraint for PostgreSQL if needed
        if "users" in tables and _is_postgres():
            try:
                with engine.begin() as conn:
                    conn.execute(text("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check"))
                    conn.execute(text("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('STUDENT', 'ADMIN', 'SECURITY'))"))
                logger.info("[+] users_role_check constraint updated for SECURITY role")
            except Exception as e:
                logger.warning(f"[!] users_role_check constraint update notice: {e}")

        # -- item_timelines UUID type migration (PostgreSQL only)
        _migrate_item_timelines(inspector)

        # -- matches: add name_score column if missing
        if "matches" in tables:
            columns = [c["name"] for c in inspector.get_columns("matches")]
            if "name_score" not in columns:
                with engine.begin() as conn:
                    conn.execute(text("ALTER TABLE matches ADD COLUMN name_score FLOAT DEFAULT 0.0"))
                logger.info("[+] Added name_score column to matches table")

        # -- claims: add OTP and proof_image columns if missing
        # Each column is migrated in its own transaction so a single failure
        # does not roll back the other columns.
        if "claims" in tables:
            claim_cols = [c["name"] for c in inspector.get_columns("claims")]
            logger.info(f"[i] claims columns found: {claim_cols}")

            # Define each migration: (column_name, ADD COLUMN DDL for postgres, ADD COLUMN DDL for sqlite)
            ts_type = "TIMESTAMP" if _is_postgres() else "DATETIME"
            claim_migrations = [
                (
                    "proof_image_url",
                    "ALTER TABLE claims ADD COLUMN IF NOT EXISTS proof_image_url VARCHAR(500)",
                    "ALTER TABLE claims ADD COLUMN proof_image_url VARCHAR(500)",
                ),
                (
                    "otp_hash",
                    "ALTER TABLE claims ADD COLUMN IF NOT EXISTS otp_hash VARCHAR(255)",
                    "ALTER TABLE claims ADD COLUMN otp_hash VARCHAR(255)",
                ),
                (
                    "otp_plain",
                    "ALTER TABLE claims ADD COLUMN IF NOT EXISTS otp_plain VARCHAR(10)",
                    "ALTER TABLE claims ADD COLUMN otp_plain VARCHAR(10)",
                ),
                (
                    "otp_expires_at",
                    f"ALTER TABLE claims ADD COLUMN IF NOT EXISTS otp_expires_at {ts_type}",
                    f"ALTER TABLE claims ADD COLUMN otp_expires_at {ts_type}",
                ),
                (
                    "is_otp_used",
                    "ALTER TABLE claims ADD COLUMN IF NOT EXISTS is_otp_used BOOLEAN NOT NULL DEFAULT FALSE",
                    "ALTER TABLE claims ADD COLUMN is_otp_used BOOLEAN NOT NULL DEFAULT 0",
                ),
            ]

            for col_name, pg_sql, sqlite_sql in claim_migrations:
                if col_name in claim_cols:
                    logger.info(f"[i] claims.{col_name} — already exists, skipping")
                    continue
                ddl = pg_sql if _is_postgres() else sqlite_sql
                try:
                    with engine.begin() as conn:
                        conn.execute(text(ddl))
                    logger.info(f"[+] claims.{col_name} — added successfully")
                except Exception as col_err:
                    logger.error(f"[-] claims.{col_name} — migration failed: {col_err}")
    except Exception as e:
        logger.warning(f"[!] Schema migration step encountered an issue: {e}")

    # Synchronize demo users (Admin, Student STU001, Main Security Desk)
    # Each user is synchronized independently so an issue with one does not affect others.
    def _sync_user(email: str, password: str, name: str, role: UserRole, student_id: str | None = None):
        db: Session = SessionLocal()
        try:
            user = db.query(User).filter(
                (func.lower(User.email) == email.lower()) | 
                ((User.student_id == student_id) if student_id else False)
            ).first()

            if not user:
                user = User(
                    name=name,
                    student_id=student_id,
                    email=email.lower(),
                    password_hash=hash_password(password),
                    role=role,
                    is_active=True,
                )
                db.add(user)
                db.commit()
                logger.info(f"[+] Demo user created: {email} (role: {role.value})")
            else:
                user.name = name
                user.email = email.lower()
                user.role = role
                user.is_active = True
                if student_id:
                    user.student_id = student_id
                if not verify_password(password, user.password_hash):
                    user.password_hash = hash_password(password)
                db.commit()
                logger.info(f"[i] Demo user verified: {email} (role: {role.value})")
        except Exception as err:
            db.rollback()
            logger.error(f"[-] Failed to sync demo user {email}: {err}")
        finally:
            db.close()

    _sync_user(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, UserRole.ADMIN, student_id=None)
    _sync_user(STUDENT_EMAIL, STUDENT_PASSWORD, STUDENT_NAME, UserRole.STUDENT, student_id=STUDENT_ID)
    _sync_user(SECURITY_EMAIL, SECURITY_PASSWORD, SECURITY_NAME, UserRole.SECURITY, student_id=SECURITY_STUDENT_ID)

    # Safely run dataset seeding if seed script exists and items table is empty
    db: Session = SessionLocal()
    try:
        from app.models.item import Item
        if db.query(Item).count() == 0:
            logger.info("[*] Items table is empty — attempting CSV dataset seed...")
            try:
                backend_dir = str(Path(__file__).resolve().parent.parent.parent)
                if backend_dir not in sys.path:
                    sys.path.insert(0, backend_dir)
                from seed import seed as run_csv_seed  # noqa: PLC0415
                run_csv_seed()
                logger.info("[+] CSV dataset seed completed successfully")
            except ImportError as e:
                logger.error(
                    f"[-] CSV seed module not found: {e}. "
                    "Ensure seed.py is present in the backend directory on Render."
                )
            except FileNotFoundError as e:
                logger.error(
                    f"[-] CSV dataset file not found during seeding: {e}. "
                    "Ensure the data/ directory and CSV file are deployed alongside the backend."
                )
            except Exception as e:
                logger.error(f"[-] CSV seeding failed with unexpected error: {e}")
        else:
            logger.info("[i] Items table already populated — skipping CSV seed")
    except Exception as e:
        logger.error(f"[-] Error checking items table: {e}")
    finally:
        db.close()


