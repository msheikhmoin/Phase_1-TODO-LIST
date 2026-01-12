from sqlmodel import create_engine, Session, SQLModel
from sqlalchemy import event
from sqlalchemy.engine import Engine
import os
from dotenv import load_dotenv
import time
import logging

# Load environment variables
load_dotenv()

# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the engine with connection settings optimized for Neon
# Removing problematic connect_args that cause the statement_timeout error
engine = create_engine(
    DATABASE_URL,
    # Connection pool settings optimized for Neon DB as specified in schema
    pool_size=2,              # min 2 connections
    max_overflow=8,           # max 10 total connections (pool_size + max_overflow)
    pool_pre_ping=True,       # Verify connections before use (essential for Neon's connection pooling)
    pool_recycle=300,         # Recycle connections every 5 minutes
    pool_timeout=30,          # Connection timeout: 30 seconds (as specified in schema)
    echo=False,               # Set to True for debugging SQL queries
)


def get_session():
    """Dependency to get DB session"""
    with Session(engine) as session:
        yield session


# Helper function to initialize the database
def init_db():
    """Initialize the database tables"""
    from models import User, Task
    from sqlmodel import SQLModel

    # Create all tables
    SQLModel.metadata.create_all(engine)
    logging.info("Database tables created successfully")


# Function to handle automatic updated_at timestamp
def update_updated_at_trigger():
    """Setup trigger to automatically update updated_at field"""

    @event.listens_for(User, 'before_update')
    def set_updated_at_user(mapper, connection, target):
        target.updated_at = datetime.utcnow()

    @event.listens_for(Task, 'before_update')
    def set_updated_at_task(mapper, connection, target):
        target.updated_at = datetime.utcnow()