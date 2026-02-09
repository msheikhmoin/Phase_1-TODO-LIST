from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
import uuid

# 1. User Model (Table Name: p3_users)
class User(SQLModel, table=True):
    __tablename__ = "p3_users"

    id: Optional[int] = Field(default=None, primary_key=True) # Neon mein SERIAL use kiya tha
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)
    password_hash: str # hashed_password ko password_hash kar diya database ke mutabiq
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship with Chat History
    messages: List["ChatHistory"] = Relationship(back_populates="user")

# 2. Chat History Model (Table Name: p3_chat_history)
class ChatHistory(SQLModel, table=True):
    __tablename__ = "p3_chat_history"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="p3_users.id", ondelete="CASCADE")
    prompt: str 
    response: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: User = Relationship(back_populates="messages")