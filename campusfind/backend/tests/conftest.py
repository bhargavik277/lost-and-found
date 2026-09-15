import pytest
import app.models  # noqa: F401 — ensure all models are registered with SQLAlchemy Base metadata
from app.database import Base, engine
from app.services.init_db import init_database


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Ensure all database tables and required demo data exist before running tests."""
    init_database()
