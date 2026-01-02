from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime

@dataclass
class Task:
    """Represents a single task in the to-do list."""
    id: int
    description: str
    title: str = "" # Added title field
    completed: bool = False
    priority: str = 'Medium'
    tags: List[str] = field(default_factory=list)
    due_date: Optional[str] = None  # Storing as string for now, will convert to datetime later
    is_recurring: bool = False
    recurrence_interval: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)