from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, UserOut, TokenResponse
from app.services.auth_service import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserRegister, db: Session = Depends(get_db)):
    """Register a new student account."""
    email_clean = data.email.strip().lower()
    if db.query(User).filter(func.lower(User.email) == email_clean).first():
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    student_id_clean = data.student_id.strip() if data.student_id else None
    if student_id_clean and db.query(User).filter(User.student_id == student_id_clean).first():
        raise HTTPException(status_code=400, detail="This Student ID is already registered.")

    user = User(
        name=data.name.strip(),
        student_id=student_id_clean,
        email=email_clean,
        password_hash=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(str(user.id), user.role.value)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Login with email and password."""
    email_clean = data.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == email_clean).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Your account has been deactivated.")

    token = create_access_token(str(user.id), user.role.value)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """Get the currently authenticated user's profile."""
    return current_user
