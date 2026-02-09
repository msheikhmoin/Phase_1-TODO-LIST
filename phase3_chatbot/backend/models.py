from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

# 1. User Model
class User(SQLModel, table=True):
    __tablename__ = "p3_users"
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    messages: List["ChatHistory"] = Relationship(back_populates="user")
    tasks: List["Task"] = Relationship(back_populates="user")

# 2. Chat History Model
class ChatHistory(SQLModel, table=True):
    __tablename__ = "p3_chat_history"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="p3_users.id", ondelete="CASCADE")
    prompt: str 
    response: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    user: User = Relationship(back_populates="messages")

# 3. Task Model (Iske baghair dashboard khali rahega)
class Task(SQLModel, table=True):
    __tablename__ = "p3_tasks"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="p3_users.id", ondelete="CASCADE")
    title: str
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    user: User = Relationship(back_populates="tasks")