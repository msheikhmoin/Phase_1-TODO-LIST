[Phase I – Todo In-Memory Python Console Application Constitution
A. Project Vision and Goals:
Build a CLI-based todo application using Python 3.13+
Fully spec-driven development, no manual coding
In-memory task storage with persistence to tasks.json
Basic Level (Initial)
Implement 5 core features: Add Task, Delete Task, Update Task, View Task List, Mark as Complete
Intermediate Level
Priorities: Assign High, Medium, or Low priority to tasks.
Tags/Categories: Add descriptive labels (e.g., 'Work', 'Home').
Search & Filter: Find tasks by keyword, status, or priority.
Sort: Reorder tasks by creation date or priority level.
Advanced Level
Due Dates: Assign deadlines and highlight overdue tasks.
Recurring Tasks: Create tasks that repeat on a daily or weekly schedule.
B. Spec-Driven Developechnical Constraints:
Language: Python 3.13+
Platform: Console application
Data Persistence: All task data must be saved to a JSON file named tasks.json.
Schema Enforcement: The Task data schema defined in this constitution is absolute and must be followed precisely.
Search Behavior: All text-based searches (e.g., by keyword) must be case-insensitive and apply to both title and description fields.
Sorting: The default view for task lists must be sorted by created_at in descending order (newest first).
Date Format: All date and time information (due_date) must be handled in YYYY-MM-DD HH:MM format.
Overdue Highlighting: Incomplete tasks past their due_date must be visually highlighted in the UI.
F. Review & Iteration Policy:
All generated code must be reviewed by you.
Refinements are made by updating the specs.
All outputs must comply with this Constitution and the approved specs.]