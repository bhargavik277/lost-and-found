from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from contextlib import asynccontextmanager
from app.config import settings
from app.database import engine, Base
from app.services.init_db import init_database

# Import all models so SQLAlchemy can create tables
import app.models  # noqa: F401

from app.routes import auth, items, matches, claims, notifications, admin


# Ensure upload directory exists before mounting StaticFiles
upload_path = Path(settings.UPLOAD_DIR)
upload_path.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure upload directory exists
    Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    # Safely initialize database schema & ensure demo users exist
    try:
        init_database()
    except Exception as e:
        print(f"Startup init error: {e}")
    yield


app = FastAPI(
    title="CampusFind API",
    description="Smart College Lost & Found Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR, check_dir=False), name="uploads")

# Register routers
app.include_router(auth.router)
app.include_router(items.router)
app.include_router(matches.router)
app.include_router(claims.router)
app.include_router(notifications.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {
        "service": "CampusFind API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "openapi": "/openapi.json",
        "health": "/health",
    }


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "CampusFind API", "version": "1.0.0"}

