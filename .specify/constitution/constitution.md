# Phase I – Todo In-Memory Python Console Application Constitution

## A. Project Vision and Goals:
- Build a CLI-based todo application using Python 3.13+
- Fully spec-driven development, no manual coding
- In-memory task storage with persistence to `tasks.json`

### Basic Level (Initial)
- Implement 5 core features: Add Task, Delete Task, Update Task, View Task List, Mark as Complete

### Intermediate Level
- **Priorities**: Assign High, Medium, or Low priority to tasks.
- **Tags/Categories**: Add descriptive labels (e.g., 'Work', 'Home').
- **Search & Filter**: Find tasks by keyword, status, or priority.
- **Sort**: Reorder tasks by creation date or priority level.

### Advanced Level
- **Due Dates**: Assign deadlines and highlight overdue tasks.
- **Recurring Tasks**: Create tasks that repeat on a daily or weekly schedule.

## B. Spec-Driven Development Rules:
- All features must be defined via Markdown specs.
- The agent implements code strictly according to approved specs.
- Iterative review and refinement is mandatory.
- No manual coding allowed.
- Compliance with specs is required for evaluation.

## C. Agent-Based Workflow:
- **Primary Agent**: You, the user.
  - **Responsibilities**: Create the Constitution, generate feature specs, and review outputs.
- **Sub-Agent**: Gemini.
  - **Responsibilities**: Generate Python code according to specs.
  - **Architecture**: Follow a modular architecture (`main.py`, `models.py`, `services.py`).
- **Interaction**: You approve specs, and Gemini implements them.

## D. Clean Architecture Principles:
- **Modularity**: Strict separation of concerns between the CLI, data models (entities), and business logic (services).
- **Task Entity**: Each task is an object with the following attributes:
    - `id`: `int` (Unique, auto-incrementing)
    - `title`: `str`
    - `description`: `str`
    - `completed`: `bool`
    - `created_at`: `datetime`
    - `priority`: `Enum` ('High', 'Medium', 'Low')
    - `tags`: `List[str]`
    - `due_date`: `Optional[datetime]`
    - `recurrence`: `Optional[str]` ('Daily', 'Weekly')
    - `parent_task_id`: `Optional[int]`
- **Data Storage**: IDs are auto-incrementing. All data is held in-memory and persisted to `tasks.json`.

## E. Non-Negotiable Technical Constraints:
- **Language**: Python 3.13+
- **Platform**: Console application
- **Data Persistence**: All task data must be saved to a JSON file named `tasks.json`.
- **Schema Enforcement**: The `Task` data schema defined in this constitution is absolute and must be followed precisely.
- **Search Behavior**: All text-based searches (e.g., by keyword) must be case-insensitive and apply to both `title` and `description` fields.
- **Sorting**: The default view for task lists must be sorted by `created_at` in descending order (newest first).
- **Date Format**: All date and time information (`due_date`) must be handled in `YYYY-MM-DD HH:MM` format.
- **Overdue Highlighting**: Incomplete tasks past their `due_date` must be visually highlighted in the UI.

## F. Review & Iteration Policy:
- All generated code must be reviewed by you.
- Refinements are made by updating the specs.
- All outputs must comply with this Constitution and the approved specs.
