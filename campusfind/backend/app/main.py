from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.config import settings
from app.database import engine, Base

# Import all models so SQLAlchemy can create tables
import app.models  # noqa: F401

from app.routes import auth, items, matches, claims, notifications, admin

# Create all tables on startup
Base.metadata.create_all(bind=engine)

# Ensure upload directory exists
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="CampusFind API",
    description="Smart College Lost & Found Management System",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
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
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Register routers
app.include_router(auth.router)
app.include_router(items.router)
app.include_router(matches.router)
app.include_router(claims.router)
app.include_router(notifications.router)
app.include_router(admin.router)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "CampusFind API", "version": "1.0.0"}
