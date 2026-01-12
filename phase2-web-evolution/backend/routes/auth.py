from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Optional
from auth_utils import create_access_token, create_refresh_token, verify_refresh_token
from models import User, TaskStatus, TaskPriority
from sqlmodel import Session, select
from db import get_session
from datetime import timedelta
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])

# Request models
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    username: str
    password: str
    full_name: Optional[str] = None

class RefreshRequest(BaseModel):
    refresh_token: str

# Response models
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str]
    is_active: bool
    is_verified: bool

class LoginResponse(BaseModel):
    user: UserResponse
    tokens: TokenResponse

@router.post("/login", response_model=LoginResponse)
async def login(login_request: LoginRequest, session: Session = Depends(get_session)):
    # In a real implementation, you would verify the password hash
    # For now, we'll simulate finding a user
    statement = select(User).where(User.email == login_request.email)
    user = session.exec(statement).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # In a real implementation, you would verify the password here
    # For simulation purposes, we'll assume the password is correct

    # Create tokens
    access_token_expires = timedelta(hours=24)  # 24 hours as per spec
    refresh_token_expires = timedelta(days=7)   # 7 days as per spec

    access_token_data = {
        "sub": str(user.id),
        "email": user.email,
        "username": user.username
    }

    refresh_token_data = {
        "sub": str(user.id),
        "jti": str(uuid.uuid4()),  # JWT ID to track the token
        "type": "refresh"
    }

    access_token = create_access_token(
        data=access_token_data,
        expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(
        data=refresh_token_data,
        expires_delta=refresh_token_expires
    )

    return LoginResponse(
        user=UserResponse(
            id=user.id,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            is_active=user.is_active,
            is_verified=user.is_verified
        ),
        tokens=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=86400  # 24 hours in seconds
        )
    )

@router.post("/register", response_model=LoginResponse)
async def register(register_request: RegisterRequest, session: Session = Depends(get_session)):
    # Check if user already exists
    statement = select(User).where(
        (User.email == register_request.email) | (User.username == register_request.username)
    )
    existing_user = session.exec(statement).first()

    if existing_user:
        raise HTTPException(status_code=409, detail="Email or username already exists")

    # Create new user (in a real implementation, you would hash the password)
    from datetime import datetime
    new_user = User(
        email=register_request.email,
        username=register_request.username,
        password_hash=f"hashed_{register_request.password}",  # In real app, use proper hashing
        full_name=register_request.full_name,
        is_active=True,
        is_verified=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # Create tokens for the new user
    access_token_expires = timedelta(hours=24)  # 24 hours as per spec
    refresh_token_expires = timedelta(days=7)   # 7 days as per spec

    access_token_data = {
        "sub": str(new_user.id),
        "email": new_user.email,
        "username": new_user.username
    }

    refresh_token_data = {
        "sub": str(new_user.id),
        "jti": str(uuid.uuid4()),  # JWT ID to track the token
        "type": "refresh"
    }

    access_token = create_access_token(
        data=access_token_data,
        expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(
        data=refresh_token_data,
        expires_delta=refresh_token_expires
    )

    return LoginResponse(
        user=UserResponse(
            id=new_user.id,
            email=new_user.email,
            username=new_user.username,
            full_name=new_user.full_name,
            is_active=new_user.is_active,
            is_verified=new_user.is_verified
        ),
        tokens=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=86400  # 24 hours in seconds
        )
    )

@router.post("/refresh", response_model=TokenResponse)
async def refresh(refresh_request: RefreshRequest):
    # Verify the refresh token
    payload = verify_refresh_token(refresh_request.refresh_token)

    # Check if this is indeed a refresh token (by checking the type)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=400, detail="Invalid token type")

    # Create new access token using the user info from the refresh token
    # In a real implementation, you might want to check if the user still exists
    # and is active in the database

    # Create new access token
    access_token_expires = timedelta(hours=24)  # 24 hours as per spec
    access_token_data = {
        "sub": payload.get("sub"),  # User ID from refresh token
    }

    new_access_token = create_access_token(
        data=access_token_data,
        expires_delta=access_token_expires
    )

    # Create a new refresh token as well (rolling refresh tokens)
    refresh_token_expires = timedelta(days=7)  # 7 days as per spec
    new_refresh_token_data = {
        "sub": payload.get("sub"),
        "jti": str(uuid.uuid4()),  # New JWT ID
        "type": "refresh"
    }

    new_refresh_token = create_refresh_token(
        data=new_refresh_token_data,
        expires_delta=refresh_token_expires
    )

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        expires_in=86400  # 24 hours in seconds
    )