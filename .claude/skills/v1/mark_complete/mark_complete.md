# Skill: Mark Task as Complete

## Description

This skill allows a user to mark an existing task as complete using its ID. It corresponds to the `done <task_id>` CLI command in `todo_core.md`.

## Implementation Guide for TodoPythonSubAgent

### 1. `services.py` - The Todo Service

-   In the `TodoService` class, implement a `mark_task_complete(self, task_id: int) -> Task | None` method.
-   This method should search the `self.tasks` list for a task with the matching `task_id`.
-   If a task is found:
    -   Set its `completed` attribute to `True`.
    -   Return the updated task object.
-   If no task is found with that ID, return `None`.

### 2. `main.py` - The CLI

-   In `main.py`, when the command is `done`, extract the `<task_id>`.
-   Convert the `task_id` from a string to an integer.
-   Call the `todo_service.mark_task_complete(task_id)` method.
-   If the method returns a `Task` object, print a success message, e.g., `Task [ID] marked as complete.`.
-   If the method returns `None`, print an error message, e.g., `Error: Task with ID [ID] not found.`.

## Adherence to Rules

-   **Architecture**: `services.py` handles the business logic of updating the task, while `main.py` handles user interaction.
-   **In-Memory**: The update happens on the `Task` object within the `self.tasks` list.
-   **Spec-Driven**: This implementation directly follows the `done` command from `todo_core.md`.
