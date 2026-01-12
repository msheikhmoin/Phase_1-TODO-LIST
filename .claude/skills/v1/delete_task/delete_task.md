# Skill: Delete Task

## Description

This skill allows a user to delete an existing task from the todo list using its ID. It corresponds to the `delete <task_id>` CLI command in `todo_core.md`.

## Implementation Guide for TodoPythonSubAgent

### 1. `services.py` - The Todo Service

-   In the `TodoService` class, implement a `delete_task(self, task_id: int) -> bool` method.
-   This method should find the task with the matching `task_id` in the `self.tasks` list.
-   If a task is found:
    -   Remove it from the `self.tasks` list.
    -   Return `True` to indicate success.
-   If no task is found, return `False`.

### 2. `main.py` - The CLI

-   In `main.py`, when the command is `delete`, extract the `<task_id>`.
-   Convert the `task_id` to an integer.
-   Call the `todo_service.delete_task(task_id)` method.
-   If the method returns `True`, print a success message, e.g., `Task [ID] deleted.`.
-   If it returns `False`, print an error message, e.g., `Error: Task with ID [ID] not found.`.

## Adherence to Rules

-   **Architecture**: `services.py` contains the core logic for deleting data, and `main.py` handles the user-facing part.
-   **In-Memory**: The deletion is performed on the in-memory `self.tasks` list.
-   **Spec-Driven**: This implementation directly follows the `delete` command from `todo_core.md`.
