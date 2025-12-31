from dataclasses import dataclass

@dataclass
class Task:
    """Represents a single task in the to-do list."""
    id: int
    description: str
    completed: bool = False