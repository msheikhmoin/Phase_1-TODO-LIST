from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import DecodeError, ExpiredSignatureError
from datetime import datetime, timedelta
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the secret from environment
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "p2_todo_secret_998877665544332211")
ALGORITHM = "HS256"

security = HTTPBearer()

def verify_token(token: str) -> dict:
    """
    Verify JWT token and return decoded payload
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except DecodeError:
        raise HTTPException(status_code=401, detail="Could not decode token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Get current user from JWT token
    """
    token = credentials.credentials
    payload = verify_token(token)

    # Extract user information from token
    user_id = payload.get("sub")  # Using 'sub' as user identifier (standard JWT claim)
    if not user_id:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    return {
        "user_id": user_id,
        "email": payload.get("email"),
        "username": payload.get("username"),
        "exp": payload.get("exp")  # Include expiration for verification
    }

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create access token with payload data
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        # Default expiration: 24 hours as specified in API spec
        expire = datetime.utcnow() + timedelta(hours=24)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create refresh token with payload data (longer expiration)
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        # Default expiration: 7 days as specified in API spec
        expire = datetime.utcnow() + timedelta(days=7)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_refresh_token(token: str) -> dict:
    """
    Verify refresh token and return decoded payload
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token has expired")
    except DecodeError:
        raise HTTPException(status_code=401, detail="Could not decode refresh token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")