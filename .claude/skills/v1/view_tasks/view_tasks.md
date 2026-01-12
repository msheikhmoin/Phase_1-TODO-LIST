# Skill: View Tasks

## Description

This skill allows the user to view all the tasks currently in the in-memory todo list. It corresponds to the `list` CLI command in `todo_core.md`.

## Implementation Guide for TodoPythonSubAgent

### 1. `services.py` - The Todo Service

-   In the `TodoService` class, implement a `get_all_tasks(self) -> list[Task]` method.
-   This method should simply return the `self.tasks` list.

### 2. `main.py` - The CLI

-   In `main.py`, when the command is `list`, call the `todo_service.get_all_tasks()` method.
-   Iterate through the returned list of `Task` objects.
-   For each task, format the output to display its `id`, `description`, and `completed` status.
-   Example format: `[1] Task description [Incomplete]`
-   If there are no tasks, print a message like "No tasks in the list."

## Adherence to Rules

-   **Architecture**: The logic is separated between the service (data retrieval) and the CLI (presentation).
-   **In-Memory**: The tasks are retrieved from the list held by `TodoService`.
-   **Spec-Driven**: This implementation directly follows the `list` command from `todo_core.md`.
