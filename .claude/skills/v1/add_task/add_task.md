# Skill: Add Task

## Description

This skill enables the user to add a new task to the in-memory todo list. It corresponds to the `add <description>` CLI command specified in `todo_core.md`.

## Implementation Guide for TodoPythonSubAgent

### 1. `models.py` - The Task Model

-   Define a `Task` class (or a `dataclass`) in `models.py`.
-   The `Task` class should have the following attributes:
    -   `id`: `int` (unique, auto-incrementing)
    -   `description`: `str`
    -   `completed`: `bool` (defaults to `False`)

### 2. `services.py` - The Todo Service

-   Create a `TodoService` class in `services.py`.
-   This service will manage the in-memory list of tasks and the auto-incrementing ID.
-   Initialize an in-memory list to store tasks, e.g., `self.tasks = []`.
-   Initialize a counter for the auto-incrementing ID, e.g., `self.next_id = 1`.
-   Implement an `add_task(self, description: str) -> Task` method:
    -   It should create a new `Task` instance.
    -   Assign the `self.next_id` to the new task's `id`.
    -   Set the task's `description`.
    -   Add the new task to the `self.tasks` list.
    -   Increment `self.next_id`.
    -   Return the newly created task.

### 3. `main.py` - The CLI

-   In `main.py`, instantiate the `TodoService`.
-   Implement the logic to parse the command-line arguments.
-   When the command is `add`, extract the `<description>`.
-   Call the `todo_service.add_task(description)` method.
-   Print a confirmation message to the user, e.g., `Task added: "[description]"`.

## Adherence to Rules

-   **Architecture**: Strictly follow the `main.py`, `models.py`, `services.py` separation.
-   **In-Memory**: The `tasks` list in `TodoService` serves as the in-memory database.
-   **Auto-increment ID**: The `next_id` counter in `TodoService` fulfills this requirement.
-   **Spec-Driven**: This implementation directly follows the `add` command from `todo_core.md`.
