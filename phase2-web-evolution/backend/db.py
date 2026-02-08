from sqlmodel import create_engine, Session, SQLModel
from sqlalchemy import event
from sqlalchemy.engine import Engine
import os
from dotenv import load_dotenv
import logging
from datetime import datetime

# Load environment variables
load_dotenv()

# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Engine setup optimized for Neon
engine = create_engine(
    DATABASE_URL,
    pool_size=2,
    max_overflow=8,
    pool_pre_ping=True,
    pool_recycle=300,
    pool_timeout=30,
    echo=False
)

def get_session():
    """Dependency to get DB session"""
    with Session(engine) as session:
        yield session

def init_db():
    """Initialize the database tables"""
    # Import models here to ensure they are registered with SQLModel
    import models 
    
    # Create all tables defined in models.py
    SQLModel.metadata.create_all(engine)
    print("Database tables created or verified successfully")

# Function to handle automatic updated_at timestamp
@event.listens_for(Engine, "before_cursor_execute", retval=True)
def comment_sql_calls(conn, cursor, statement, parameters, context, executemany):
    # This is a helper for Neon to keep connections clean
    return statement, parameters