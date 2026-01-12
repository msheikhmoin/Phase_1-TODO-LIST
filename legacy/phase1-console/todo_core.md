# Phase I Feature Specification: Todo In-Memory Python Console Application

## 1. Project Overview
This document specifies the requirements for Phase I of the "Todo In-Memory Python Console Application". The project is a command-line interface (CLI) application built with Python 3.13+ for managing a simple todo list. All tasks are stored in-memory and will not be persisted between application sessions. Development must strictly follow this specification and the project's Constitution.

## 2. User Stories
- **As a user,** I want to add a new task with a description so I can keep track of what I need to do.
- **As a user,** I want to view a list of all my tasks so I can see everything I need to do.
- **As a user,** I want to mark a task as complete so I can track my progress.
- **As a user,** I want to delete a task so I can remove items that are no longer needed.

## 3. Functional Requirements
- The application must be a console-based CLI application.
- All task data must be stored in-memory. No database or file-based persistence is allowed in Phase I.
- The application must not require any external libraries for its core functionality.
- Task IDs must be unique integers and should be auto-incremented, starting from 1.

## 4. Task Data Model
A task shall be represented by a simple data structure with the following attributes:
- `id`: (Integer) A unique identifier for the task.
- `description`: (String) The text content of the task.
- `completed`: (Boolean) The completion status of the task. Defaults to `false` upon creation.

## 5. CLI Command Specification

### 5.1. Add Task
- **Command**: `add <description>`
- **Description**: Adds a new, incomplete task to the list. The description should be a string of one or more words.
- **Success Behavior**:
  - A new task is created with the next available auto-incremented ID, the provided description, and a `completed` status of `false`.
  - The application will print a confirmation message to the console, e.g., `Success: Added task "[description]".`
- **Error Behavior**:
  - If no description is provided, the application will print an error, e.g., `Error: Task description cannot be empty.`

### 5.2. View Task List
- **Command**: `list`
- **Description**: Displays all tasks currently in the list.
- **Success Behavior**:
  - Tasks are listed one per line, formatted as `[ID] [Status] Description`. The status should be `[X]` for completed tasks and `[ ]` for incomplete tasks.
  - Example output:
    ```
    [1] [ ] Buy milk
    [2] [X] Finish hackathon project
    ```
  - If no tasks exist, the application will print a message, e.g., `No tasks found.`

### 5.3. Mark Task as Complete
- **Command**: `done <task_id>`
- **Description**: Marks an existing task as complete.
- **Success Behavior**:
  - The task with the specified `<task_id>` has its `completed` status set to `true`.
  - The application will print a confirmation message, e.g., `Success: Task 1 marked as complete.`
- **Error Behavior**:
  - If a task with the given `<task_id>` does not exist, the application will print an error, e.g., `Error: Task with ID 1 not found.`
  - If the `<task_id>` is not a valid integer, the application will print an error, e.g., `Error: Task ID must be a valid integer.`

### 5.4. Delete Task
- **Command**: `delete <task_id>`
- **Description**: Permanently removes a task from the list.
- **Success Behavior**:
  - The task with the specified `<task_id>` is removed from the in-memory list.
  - The application will print a confirmation message, e.g., `Success: Task 1 deleted.`
- **Error Behavior**:
  - If a task with the given `<task_id>` does not exist, the application will print an error, e.g., `Error: Task with ID 1 not found.`
  - If the `<task_id>` is not a valid integer, the application will print an error, e.g., `Error: Task ID must be a valid integer.`

## 6. Agent Workflow Contract
This specification is the single source of truth for the `TodoPythonSubAgent`. The SubAgent must implement the features exactly as described herein. No assumptions or deviations are permitted.