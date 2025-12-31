import json
import os
from typing import List, Optional
from models import Task

class TodoService:
    """Manages the business logic for the to-do list with JSON persistence."""
    def __init__(self, storage_file: str = 'src/tasks.json'):
        self._storage_file = storage_file
        self._tasks: List[Task] = self._load_tasks()
        if self._tasks:
            self._next_id = max(task.id for task in self._tasks) + 1
        else:
            self._next_id = 1

    def _load_tasks(self) -> List[Task]:
        """Loads tasks from the JSON storage file."""
        if not os.path.exists(self._storage_file):
            return []
        try:
            with open(self._storage_file, 'r') as f:
                # Handle empty file case
                content = f.read()
                if not content:
                    return []
                tasks_data = json.loads(content)
            return [Task(**data) for data in tasks_data]
        except (json.JSONDecodeError, FileNotFoundError):
            return []

    def _save_tasks(self):
        """Saves the current list of tasks to the JSON storage file."""
        with open(self._storage_file, 'w') as f:
            tasks_data = [task.__dict__ for task in self._tasks]
            json.dump(tasks_data, f, indent=4)

    def add_task(self, description: str) -> Task:
        """Adds a new task to the list and saves."""
        task = Task(id=self._next_id, description=description)
        self._tasks.append(task)
        self._next_id += 1
        self._save_tasks()
        return task

    def get_all_tasks(self) -> List[Task]:
        """Returns all tasks."""
        return self._tasks

    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        """Gets a single task by its ID."""
        for task in self._tasks:
            if task.id == task_id:
                return task
        return None

    def mark_task_complete(self, task_id: int) -> Optional[Task]:
        """Marks a task as complete and saves."""
        task = self.get_task_by_id(task_id)
        if task:
            task.completed = True
            self._save_tasks()
            return task
        return None
        
    def update_task(self, task_id: int, new_description: str) -> Optional[Task]:
        """Updates a task's description and saves."""
        task = self.get_task_by_id(task_id)
        if task:
            task.description = new_description
            self._save_tasks()
            return task
        return None

    def delete_task(self, task_id: int) -> bool:
        """Deletes a task and saves."""
        task = self.get_task_by_id(task_id)
        if task:
            self._tasks.remove(task)
            self._save_tasks()
            return True
        return False