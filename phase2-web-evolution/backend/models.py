from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
import enum
from sqlmodel import Relationship


# Define enums for status and priority
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
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(
        sa_column=Column(String, unique=True, nullable=False, index=True)
    )
    username: str = Field(
        sa_column=Column(String, unique=True, nullable=False, index=True)
    )
    password_hash: str = Field(sa_column=Column(String, nullable=False))
    full_name: Optional[str] = Field(sa_column=Column(String))
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=datetime.utcnow, nullable=False
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow, nullable=False
    )

    # Relationships - specify foreign keys to disambiguate
    tasks: List["Task"] = Relationship(
        back_populates="creator",
        sa_relationship_kwargs={"foreign_keys": "[Task.created_by]"}
    )


class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(sa_column=Column(String, nullable=False))
    description: Optional[str] = Field(sa_column=Column(Text))
    status: str = Field(
        default=TaskStatus.PENDING.value,
        sa_column=Column(String, nullable=False)
    )
    priority: str = Field(
        default=TaskPriority.MEDIUM.value,
        sa_column=Column(String, nullable=False)
    )
    due_date: Optional[datetime] = Field(sa_column=Column(DateTime))
    created_by: int = Field(default=None, foreign_key="users.id", nullable=False)
    assigned_to: Optional[int] = Field(default=None, foreign_key="users.id")
    created_at: datetime = Field(
        default_factory=datetime.utcnow, nullable=False
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow, nullable=False
    )
    completed_at: Optional[datetime] = Field(sa_column=Column(DateTime))

    # Relationships - specify foreign keys to disambiguate
    creator: User = Relationship(
        back_populates="tasks",
        sa_relationship_kwargs={"foreign_keys": "[Task.created_by]"}
    )
    assigned_user: Optional[User] = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[Task.assigned_to]"}
    )