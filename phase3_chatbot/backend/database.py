from sqlmodel import create_engine, Session
from contextlib import contextmanager
from typing import Generator
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database URL - using local SQLite
DATABASE_URL = "sqlite:///./local_vips.db"

# Create engine
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True to see SQL queries in logs
    connect_args={"check_same_thread": False}  # Required for SQLite
)


def create_db_and_tables():
    """Create database tables"""
    from models import User, Task, Conversation, Message
    from sqlmodel import SQLModel

    SQLModel.metadata.create_all(bind=engine)


@contextmanager
def get_session() -> Generator[Session, None, None]:
    """Get database session as a context manager"""
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_session_dependency() -> Session:
    """FastAPI dependency to get database session"""
    with get_session() as session:
        yield session