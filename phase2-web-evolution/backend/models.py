from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
import enum

# Define enums
class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class TaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class User(SQLModel, table=True):
    # Tablename change to separate Phase 2
    __tablename__ = "p2_users" 

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(sa_column=Column(String, unique=True, nullable=False, index=True))
    username: str = Field(sa_column=Column(String, unique=True, nullable=False, index=True))
    password_hash: str = Field(sa_column=Column(String, nullable=False))
    full_name: Optional[str] = Field(sa_column=Column(String))
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    tasks: List["Task"] = Relationship(
        back_populates="creator",
        sa_relationship_kwargs={"foreign_keys": "[Task.created_by]"}
    )

class Task(SQLModel, table=True):
    # Tablename change to separate Phase 2
    __tablename__ = "p2_tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(sa_column=Column(String, nullable=False))
    description: Optional[str] = Field(sa_column=Column(Text))
    status: str = Field(default=TaskStatus.PENDING.value, sa_column=Column(String, nullable=False))
    priority: str = Field(default=TaskPriority.MEDIUM.value, sa_column=Column(String, nullable=False))
    due_date: Optional[datetime] = Field(sa_column=Column(DateTime))
    
    # Foreign key updated to point to p2_users
    created_by: int = Field(foreign_key="p2_users.id", nullable=False)
    assigned_to: Optional[int] = Field(default=None, foreign_key="p2_users.id")
    
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    completed_at: Optional[datetime] = Field(sa_column=Column(DateTime))

    creator: User = Relationship(
        back_populates="tasks",
        sa_relationship_kwargs={"foreign_keys": "[Task.created_by]"}
    )
    assigned_user: Optional[User] = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[Task.assigned_to]"}
    )