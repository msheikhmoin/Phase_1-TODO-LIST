from sqlmodel import create_engine, Session
from typing import Generator
import os
from dotenv import load_dotenv

load_dotenv()

# Neon URL uthayega jo .env mein hai
DATABASE_URL = os.getenv("DATABASE_URL")

# Create engine for Neon (PostgreSQL)
engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True  # Connection drop nahi hone dega
)

def create_db_and_tables():
    """Register Phase 3 models"""
    from models import User, ChatHistory
    # Tables manually Neon mein ban chuke hain, ye sirf SQLModel ko batata hai
    print("Phase 3 Neon Database Connected!")

def get_session_dependency() -> Generator[Session, None, None]:
    """FastAPI dependency for sessions"""
    with Session(engine) as session:
        yield session