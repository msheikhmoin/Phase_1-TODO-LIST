import json
import os
from typing import List, Optional, Dict, Any
from models import Task
from datetime import datetime, timedelta

class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)

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
                content = f.read()
                if not content:
                    return []
                tasks_data = json.loads(content)
            
            loaded_tasks = []
            for data in tasks_data:
                # Convert 'created_at' string back to datetime object
                if 'created_at' in data and isinstance(data['created_at'], str):
                    data['created_at'] = datetime.fromisoformat(data['created_at'])
                # If 'due_date' is present and a string, convert it to datetime
                if 'due_date' in data and isinstance(data['due_date'], str):
                    try:
                        data['due_date'] = datetime.fromisoformat(data['due_date'])
                    except ValueError:
                        data['due_date'] = None # Handle invalid date string
                
                # Handle default values for new fields if they are missing in old data
                if 'priority' not in data:
                    data['priority'] = 'Medium'
                if 'tags' not in data:
                    data['tags'] = []
                if 'is_recurring' not in data:
                    data['is_recurring'] = False
                if 'recurrence_interval' not in data:
                    data['recurrence_interval'] = None
                if 'title' not in data: # Ensure title is present, defaulting to description if not
                    data['title'] = data.get('description', '')

                loaded_tasks.append(Task(**data))
            return loaded_tasks
        except (json.JSONDecodeError, FileNotFoundError) as e:
            # For robustness, log the error or handle corrupted file gracefully
            print(f"Error loading tasks: {e}")
            return []

    def _save_tasks(self):
        """Saves the current list of tasks to the JSON storage file."""
        with open(self._storage_file, 'w') as f:
            tasks_data = [task.__dict__ for task in self._tasks]
            # Convert datetime objects in task.__dict__ to isoformat strings for JSON serialization
            for task_data in tasks_data:
                if isinstance(task_data.get('created_at'), datetime):
                    task_data['created_at'] = task_data['created_at'].isoformat()
                if isinstance(task_data.get('due_date'), datetime):
                    task_data['due_date'] = task_data['due_date'].isoformat()
                # Ensure tags are always a list, even if an old task might have had None or non-list
                if not isinstance(task_data.get('tags'), list):
                    task_data['tags'] = []
            json.dump(tasks_data, f, indent=4, cls=CustomEncoder)

    def add_task(self, description: str, priority: str = 'Medium', tags: Optional[List[str]] = None,
                 due_date: Optional[datetime] = None, is_recurring: bool = False,
                 recurrence_interval: Optional[str] = None) -> Task:
        """Adds a new task to the list and saves."""
        if tags is None:
            tags = []
        # For simplicity, if title is not provided, use description as title
        task = Task(id=self._next_id, description=description, priority=priority, tags=tags,
                    due_date=due_date, is_recurring=is_recurring, recurrence_interval=recurrence_interval,
                    created_at=datetime.now(), title=description) # Assuming description as title if not specified
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
        """Marks a task as complete and saves. If recurring, creates a new instance."""
        task = self.get_task_by_id(task_id)
        if task:
            task.completed = True
            if task.is_recurring and task.recurrence_interval:
                new_due_date = None
                if task.due_date:
                    if task.recurrence_interval == 'Daily':
                        new_due_date = task.due_date + timedelta(days=1)
                    elif task.recurrence_interval == 'Weekly':
                        new_due_date = task.due_date + timedelta(weeks=1)
                
                # Create a new recurring task
                self.add_task(
                    description=task.description,
                    priority=task.priority,
                    tags=list(task.tags), # Create a copy of the list
                    due_date=new_due_date,
                    is_recurring=True,
                    recurrence_interval=task.recurrence_interval
                )
            self._save_tasks()
            return task
        return None
        
    def update_task(self, task_id: int, description: Optional[str] = None,
                    priority: Optional[str] = None, tags: Optional[List[str]] = None,
                    due_date: Optional[datetime] = None, is_recurring: Optional[bool] = None,
                    recurrence_interval: Optional[str] = None) -> Optional[Task]:
        """Updates a task's description and saves."""
        task = self.get_task_by_id(task_id)
        if task:
            if description is not None:
                task.description = description
            if priority is not None:
                task.priority = priority
            if tags is not None:
                task.tags = tags
            if due_date is not None:
                task.due_date = due_date
            if is_recurring is not None:
                task.is_recurring = is_recurring
            if recurrence_interval is not None:
                task.recurrence_interval = recurrence_interval
            
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
    
    def sort_tasks(self, tasks: List[Task], sort_by: str = 'created_at') -> List[Task]:
        """Sorts tasks based on specified criteria."""
        if sort_by == 'priority':
            priority_map = {'High': 3, 'Medium': 2, 'Low': 1}
            return sorted(tasks, key=lambda t: priority_map.get(t.priority, 0), reverse=True)
        elif sort_by == 'created_at':
            return sorted(tasks, key=lambda t: t.created_at, reverse=True)
        return tasks # Default to no specific sort if criteria not recognized
    
    def filter_tasks(self, tasks: List[Task], status: Optional[bool] = None, priority: Optional[str] = None) -> List[Task]:
        """Filters tasks based on status and/or priority."""
        filtered_tasks = tasks
        if status is not None:
            filtered_tasks = [task for task in filtered_tasks if task.completed == status]
        if priority is not None:
            filtered_tasks = [task for task in filtered_tasks if task.priority == priority]
        return filtered_tasks

    def search_tasks(self, tasks: List[Task], keyword: str) -> List[Task]:
        """Searches tasks by keyword in title or description (case-insensitive)."""
        keyword_lower = keyword.lower()
        return [task for task in tasks if keyword_lower in task.description.lower() or keyword_lower in task.title.lower()]