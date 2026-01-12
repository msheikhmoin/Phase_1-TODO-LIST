# Spec: Advanced Features - Phase I

## 1. Feature Overview
This specification outlines advanced features, including recurring tasks and due dates, designed to enhance task scheduling and tracking capabilities.

## 2. Data Structure Additions
The `Task` model will be extended to support recurrence and deadlines.

### Schema Additions for `Task` Model
- **due_date**: `Optional[datetime]` - An optional deadline for the task, stored in `YYYY-MM-DD HH:MM` format. Default is `null`.
- **recurrence**: `Optional[str]` - An optional recurrence interval, must be one of 'Daily' or 'Weekly'. Default is `null`.
- **parent_task_id**: `Optional[int]` - For recurring tasks, this links a respawned task back to the original parent task.

### Example `tasks.json` Structure
```json
[
  {
    "id": 3,
    "title": "Weekly Team Sync",
    "description": "Attend the weekly team synchronization meeting.",
    "completed": false,
    "created_at": "2024-11-04T09:00:00Z",
    "priority": "Medium",
    "tags": ["work", "meeting"],
    "due_date": "2024-11-04T10:00:00Z",
    "recurrence": "Weekly",
    "parent_task_id": null
  },
  {
    "id": 4,
    "title": "Submit Daily Report",
    "description": "Compile and submit the end-of-day report.",
    "completed": true,
    "created_at": "2024-11-03T17:00:00Z",
    "priority": "High",
    "tags": ["work", "reporting"],
    "due_date": "2024-11-03T17:30:00Z",
    "recurrence": "Daily",
    "parent_task_id": null
  }
]
```

## 3. UI/UX Behavior

### 3.1. Due Dates
- When adding or updating a task, the user can provide a due date in `YYYY-MM-DD HH:MM` format.
  - **Prompt**: "Set due date (YYYY-MM-DD HH:MM, optional):"
- When viewing the task list, tasks that are past their `due_date` and not `completed` must be **highlighted**.
  - The highlighting mechanism is implementation-agnostic but should be visually distinct (e.g., color change, icon/emoji prefix).
  - Example prefix: `[OVERDUE] 🚨`

### 3.2. Recurring Tasks
- **Defining Recurrence**:
  - When adding or updating a task, the user can set a recurrence interval.
  - **Prompt**: "Set recurrence (Daily, Weekly, optional):"
- **Respawn Behavior**:
  - When a recurring task is marked as `completed`, the system must automatically generate a **new task** with the following properties:
    - The `title`, `description`, `priority`, `tags`, and `recurrence` are copied from the completed parent task.
    - The `completed` status is set to `false`.
    - The new `due_date` is advanced by the specified interval (1 day for 'Daily', 7 days for 'Weekly').
    - The `parent_task_id` is set to the ID of the completed task.
  - The original task remains in the system with its `completed` status set to `true`.

## 4. Acceptance Criteria
- The `Task` model is updated to include `due_date`, `recurrence`, and `parent_task_id`.
- Due date input is validated to match the `YYYY-MM-DD HH:MM` format.
- Overdue, uncompleted tasks are clearly highlighted in the task list display.
- Completing a recurring task correctly generates a new task with an advanced due date.
- The link between a recurring task and its parent is maintained via `parent_task_id`.
- The system gracefully handles tasks with no due date or recurrence.
