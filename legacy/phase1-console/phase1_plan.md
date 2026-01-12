# Implementation Plan: Evolution of Todo - Phase I

This document outlines the phase-by-phase implementation plan for enhancing the Todo application, incorporating intermediate and advanced features as defined in the project specifications.

## Phase A: Data Schema Updates

**Objective**: Extend the core `Task` data model to support new attributes for priority, tags, recurrence, and due dates.

**Reference Specifications**:
- `constitution.md` (Section D: Clean Architecture Principles - Task Entity)
- `02_intermediate_features.md` (Section 2: Data Structure Changes)
- `03_advanced_features.md` (Section 2: Data Structure Additions)

**Tasks**:

1.  **Task A.1: Add `title` field to `Task` model.**
    -   Description: Update the `Task` entity to include a `title` field as a `str`.
    -   Reference: `02_intermediate_features.md` (Section 2: Updated `Task` Model)

2.  **Task A.2: Add `priority` field to `Task` model.**
    -   Description: Incorporate a `priority` field into the `Task` entity, constrained to an `Enum` of 'High', 'Medium', or 'Low'.
    -   Reference: `02_intermediate_features.md` (Section 2: Updated `Task` Model)

3.  **Task A.3: Add `tags` field to `Task` model.**
    -   Description: Add a `tags` field to the `Task` entity, defined as a `List[str]`.
    -   Reference: `02_intermediate_features.md` (Section 2: Updated `Task` Model)

4.  **Task A.4: Add `due_date` field to `Task` model.**
    -   Description: Integrate an optional `due_date` field (`Optional[datetime]`) into the `Task` entity, supporting `YYYY-MM-DD HH:MM` format.
    -   Reference: `03_advanced_features.md` (Section 2: Schema Additions for `Task` Model)

5.  **Task A.5: Add `recurrence` field to `Task` model.**
    -   Description: Add an optional `recurrence` field (`Optional[str]`) to the `Task` entity, restricted to 'Daily' or 'Weekly'.
    -   Reference: `03_advanced_features.md` (Section 2: Schema Additions for `Task` Model)

6.  **Task A.6: Add `parent_task_id` field to `Task` model.**
    -   Description: Include an optional `parent_task_id` (`Optional[int]`) in the `Task` entity for linking respawned recurring tasks.
    -   Reference: `03_advanced_features.md` (Section 2: Schema Additions for `Task` Model)

7.  **Task A.7: Update `tasks.json` structure.**
    -   Description: Ensure the data persistence mechanism (e.g., `tasks.json` handling) can correctly store and retrieve all new `Task` model fields.
    -   Reference: `constitution.md` (Section D: Data Storage), `02_intermediate_features.md` (Section 2: Example `tasks.json`), `03_advanced_features.md` (Section 2: Example `tasks.json`)

## Phase B: Core Logic

**Objective**: Implement the business logic for sorting, searching, filtering, and recurring task behavior.

**Reference Specifications**:
- `constitution.md` (Section D: Clean Architecture Principles)
- `02_intermediate_features.md` (Section 3: UI/UX Behavior - Search and Filter, Sorting)
- `03_advanced_features.md` (Section 3: UI/UX Behavior - Recurring Tasks)

**Tasks**:

1.  **Task B.1: Implement Task Sorting by `created_at` (Default).**
    -   Description: Modify the task retrieval logic to sort tasks by `created_at` in descending order as the default view.
    -   Reference: `02_intermediate_features.md` (Section 3.3: Sorting), `constitution.md` (Section E: Sorting)

2.  **Task B.2: Implement Task Sorting by `priority`.**
    -   Description: Add logic to sort tasks by `priority` in the order High > Medium > Low when specified.
    -   Reference: `02_intermediate_features.md` (Section 3.3: Sorting)

3.  **Task B.3: Implement Case-Insensitive Keyword Search.**
    -   Description: Develop a search function that finds tasks by keyword, case-insensitively, across both `title` and `description` fields.
    -   Reference: `02_intermediate_features.md` (Section 3.2: Search and Filter), `constitution.md` (Section E: Search Behavior)

4.  **Task B.4: Implement Task Filtering by `completed` status.**
    -   Description: Create a filtering mechanism to display tasks based on their `completed` status (completed or pending).
    -   Reference: `02_intermediate_features.md` (Section 3.2: Search and Filter)

5.  **Task B.5: Implement Task Filtering by `priority` level.**
    -   Description: Develop a filtering mechanism to display tasks based on specified `priority` levels (High, Medium, Low).
    -   Reference: `02_intermediate_features.md` (Section 3.2: Search and Filter)

6.  **Task B.6: Implement Recurring Task Respawn Logic.**
    -   Description: Implement the logic to automatically generate a new task with an advanced `due_date` and `parent_task_id` when a recurring task is marked as `completed`.
    -   Reference: `03_advanced_features.md` (Section 3.2: Recurring Tasks)

## Phase C: UI / CLI Updates

**Objective**: Update the command-line interface to expose new features and enhance output formatting.

**Reference Specifications**:
- `constitution.md` (Section D: Clean Architecture Principles)
- `02_intermediate_features.md` (Section 3: UI/UX Behavior - Adding and Updating Tasks, Search and Filter, Sorting)
- `03_advanced_features.md` (Section 3: UI/UX Behavior - Due Dates, Recurring Tasks)

**Tasks**:

1.  **Task C.1: Update `add` command for `title`, `priority` and `tags`.**
    -   Description: Modify the `add` command to prompt the user for task `title`, `priority` (with default), and `tags` (comma-separated).
    -   Reference: `02_intermediate_features.md` (Section 3.1: Adding and Updating Tasks)

2.  **Task C.2: Update `update` command for `title`, `priority` and `tags`.**
    -   Description: Extend the `update` command to allow modification of `title`, `priority`, and `tags` for existing tasks.
    -   Reference: `02_intermediate_features.md` (Section 3.1: Adding and Updating Tasks)

3.  **Task C.3: Implement `search` CLI command.**
    -   Description: Create a new `search` CLI command that takes a keyword and displays matching tasks.
    -   Reference: `02_intermediate_features.md` (Section 3.2: Search and Filter)

4.  **Task C.4: Implement `filter` CLI command.**
    -   Description: Create a new `filter` CLI command with `--status` and `--priority` options.
    -   Reference: `02_intermediate_features.md` (Section 3.2: Search and Filter)

5.  **Task C.5: Enhance `view` command for sorting options.**
    -   Description: Modify the `view` command to accept `--sort priority` and display tasks accordingly.
    -   Reference: `02_intermediate_features.md` (Section 3.3: Sorting)

6.  **Task C.6: Update `add` and `update` commands for `due_date` and `recurrence`.**
    -   Description: Integrate prompts for `due_date` (in `YYYY-MM-DD HH:MM` format) and `recurrence` (Daily/Weekly) into the `add` and `update` commands.
    -   Reference: `03_advanced_features.md` (Section 3.1: Due Dates, Section 3.2: Recurring Tasks)

7.  **Task C.7: Implement Overdue Task Highlighting in `view` output.**
    -   Description: Modify the task list display to visually highlight tasks that are past their `due_date` and are not `completed`.
    -   Reference: `03_advanced_features.md` (Section 3.1: Due Dates), `constitution.md` (Section E: Overdue Highlighting)

## Implementation Task Checklist

### Phase A: Data & Models
- [x] Task 1: Update Task class to support priority, tags, recurrence, and due dates.
- [x] Task 2: Update data storage / JSON handling to persist new fields.

### Phase B: Business Logic
- [x] Task 3: Implement priority-based sorting logic.
- [x] Task 4: Implement tag-based and keyword search/filtering logic.
- [x] Task 5: Implement daily/weekly recurrence respawn behavior.

### Phase C: User Interface
- [x] Task 6: Add an interactive menu loop to src/main.py with Add, View, Complete, Delete, Search, and Filter by Priority options.
- [x] Task 7: Update task listing output to display priorities and tags visually.