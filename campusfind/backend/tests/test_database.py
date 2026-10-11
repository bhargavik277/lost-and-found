import pytest
from sqlalchemy import create_engine
from app.database import normalize_database_url


def test_normalize_database_url_postgres_prefix():
    raw_url = "postgres://campus_user:s3cret_p@ss@render-pg.host.com:5432/campusfind_db"
    expected = "postgresql+psycopg://campus_user:s3cret_p@ss@render-pg.host.com:5432/campusfind_db"
    assert normalize_database_url(raw_url) == expected


def test_normalize_database_url_postgresql_prefix():
    raw_url = "postgresql://campus_user:s3cret_p@ss@render-pg.host.com:5432/campusfind_db"
    expected = "postgresql+psycopg://campus_user:s3cret_p@ss@render-pg.host.com:5432/campusfind_db"
    assert normalize_database_url(raw_url) == expected


def test_normalize_database_url_psycopg2_prefix():
    raw_url = "postgresql+psycopg2://campus_user:s3cret_p@ss@render-pg.host.com:5432/campusfind_db"
    expected = "postgresql+psycopg://campus_user:s3cret_p@ss@render-pg.host.com:5432/campusfind_db"
    assert normalize_database_url(raw_url) == expected


def test_normalize_database_url_already_psycopg():
    raw_url = "postgresql+psycopg://campus_user:s3cret_p@ss@render-pg.host.com:5432/campusfind_db"
    assert normalize_database_url(raw_url) == raw_url


def test_normalize_database_url_sqlite():
    raw_url = "sqlite:///./campusfind.db"
    assert normalize_database_url(raw_url) == raw_url


def test_psycopg_driver_compatibility():
    """Verify SQLAlchemy initializes the postgresql+psycopg dialect without MissingModuleError."""
    engine = create_engine(
        "postgresql+psycopg://test_user:test_pass@localhost:5432/test_db",
        strategy="plain" if hasattr(create_engine, "strategy") else None,
    ) if False else create_engine("postgresql+psycopg://test_user:test_pass@localhost:5432/test_db")

    assert engine.dialect.name == "postgresql"
    assert engine.dialect.driver == "psycopg"
