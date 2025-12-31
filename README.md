# Phase I: Todo In-Memory Python Console Application

## Project Overview

This project is the first phase in the "Evolution of Todo" series. It is a command-line interface (CLI) application for managing a simple todo list, built entirely through a spec-driven, agent-based workflow. The application is written in Python 3.13+ and uses in-memory storage, meaning the todo list is not persisted between sessions.

The primary goal of this phase was to establish a clean architecture and a robust, automated development process, with the `TodoArchitect` agent defining specifications and the `TodoPythonSubAgent` handling the implementation.

## Core Features (Phase I)

*   **Persistence**: Tasks are automatically saved and loaded between application sessions.
*   **Add Task**: Add a new task to the list.
*   **List Tasks**: View all tasks with their completion status.
*   **Mark Task as Complete**: Mark a task as done.
*   **Update Task**: Edit the description of an existing task.
*   **Delete Task**: Remove a task from the list.

## Technology & Architecture

*   **Language**: Python 3.13+
*   **Storage**: Persistent JSON-based storage using src/tasks.json.
*   **Architecture**: A clean, modular architecture is used to separate concerns:
    *   `src/models.py`: Defines the `Task` data structure.
    *   `src/services.py`: Contains the core business logic for task management.
    *   `src/main.py`: Handles all CLI input, command parsing, and user-facing output.
*   **Specification-Driven**: All development is guided by formal specifications located in the `.specify/` directory.

## How to Run

The application is run from the command line using `uv run src/main.py`.

### Commands

*   **List all tasks:**
    ```sh
    uv run src/main.py list
    ```

*   **Add a new task:**
    ```sh
    uv run src/main.py add "Buy groceries"
    ```

*   **Mark a task as complete:**
    ```sh
    uv run src/main.py done 1
    ```
    
*   **Update a task's description:**
    ```sh
    uv run src/main.py update 1 "Buy organic milk"
    ```

*   **Delete a task:**
    ```sh
    uv run src/main.py delete 1
    ```

## Project Structure

```
.
├── .specify/            # All project specifications and agent instructions
│   ├── constitution/    # Project constitution and principles
│   └── features/        # Feature specifications (todo_core.md)
├── src/                 # Python source code
│   ├── main.py          # CLI entry point and user interaction
│   ├── models.py        # Data models (e.g., Task class)
│   ├── services.py      # Business logic
│   └── tasks.json       # Stores task data between sessions
└── README.md            # This file
```

## Agent-Based Workflow

This project was built using a two-agent system:

1.  **TodoArchitect**: The primary agent responsible for defining the project's constitution, architecture, and feature specifications.
2.  **TodoPythonSubAgent**: The implementation agent that writes Python code strictly based on the specifications provided by the Architect.
