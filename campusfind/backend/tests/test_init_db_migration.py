import pytest
from unittest.mock import MagicMock, patch
from sqlalchemy import inspect
from app.database import SessionLocal, engine
from app.models.user import User, UserRole
from app.services.auth_service import verify_password
from app.services.init_db import init_database, _migrate_user_roles, _is_postgres, SECURITY_EMAIL, SECURITY_PASSWORD, SECURITY_STUDENT_ID


def test_init_database_creates_and_syncs_security_user():
    """Verify init_database correctly initializes the database and creates/verifies the Security user."""
    init_database()
    
    db = SessionLocal()
    try:
        sec_user = db.query(User).filter(User.email == SECURITY_EMAIL).first()
        assert sec_user is not None, "Security user must exist after init_database"
        assert sec_user.role == UserRole.SECURITY, f"Expected role SECURITY, got {sec_user.role}"
        assert sec_user.student_id == SECURITY_STUDENT_ID, f"Expected student_id {SECURITY_STUDENT_ID}, got {sec_user.student_id}"
        assert sec_user.is_active is True
        assert verify_password(SECURITY_PASSWORD, sec_user.password_hash) is True
    finally:
        db.close()


def test_migrate_user_roles_sqlite_noop():
    """Verify _migrate_user_roles safely no-ops on SQLite without errors."""
    inspector = inspect(engine)
    # On SQLite dialect, _migrate_user_roles returns immediately without altering
    _migrate_user_roles(inspector)


def test_migrate_user_roles_postgres_flow_mocked():
    """Verify _migrate_user_roles executes independent transactions for PostgreSQL migration steps."""
    mock_inspector = MagicMock()
    mock_inspector.get_table_names.return_value = ["users"]

    executed_statements = []

    class MockConnection:
        def __enter__(self):
            return self
        def __exit__(self, exc_type, exc_val, exc_tb):
            pass
        def execute(self, statement, *args, **kwargs):
            stmt_str = str(statement)
            executed_statements.append(stmt_str)
            mock_res = MagicMock()
            mock_res.fetchone.return_value = (7, "character varying", "varchar")
            mock_res.fetchall.return_value = [("users_role_check",)]
            mock_res.scalar.return_value = 1
            return mock_res
        def execution_options(self, **kwargs):
            return self

    mock_conn = MockConnection()

    with patch("app.services.init_db._is_postgres", return_value=True), \
         patch("app.services.init_db.engine.connect", return_value=mock_conn), \
         patch("app.services.init_db.engine.begin", return_value=mock_conn):
        
        _migrate_user_roles(mock_inspector)

    # Check that key DDL steps were called
    joined_stmts = " ".join(executed_statements)
    assert "information_schema.columns" in joined_stmts
    assert "pg_constraint" in joined_stmts
    assert "ALTER TABLE users DROP CONSTRAINT IF EXISTS" in joined_stmts
    assert "ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(50) USING role::text" in joined_stmts
    assert "ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'SECURITY'" in joined_stmts
    assert "ALTER TABLE users ADD CONSTRAINT users_role_check" in joined_stmts
