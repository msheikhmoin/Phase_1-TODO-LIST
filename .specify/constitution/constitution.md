# Phase I – Todo In-Memory Python Console Application Constitution

## A. Project Vision and Goals:
- Build a CLI-based todo application using Python 3.13+
- Fully spec-driven development, no manual coding
- In-memory task storage only
- Implement 5 core features: Add Task, Delete Task, Update Task, View Task List, Mark as Complete

## B. Spec-Driven Development Rules:
- All features must be defined via Markdown specs
- TodoPythonSubAgent implements code strictly according to approved specs
- Iterative review and refinement is mandatory
- No manual coding allowed
- Compliance with specs is required for evaluation

## C. Agent-Based Workflow:
- Primary Agent: TodoArchitect
  - Responsibilities: create Constitution, generate feature specs, review outputs
- Sub-Agent: TodoPythonSubAgent
  - Responsibilities: generate Python code according to specs
  - Follow modular architecture: main.py, models.py, services.py
- Interaction: TodoArchitect approves specs → Sub-Agent implements

## D. Clean Architecture Principles:
- Modular code: separation of CLI, data models, and business logic
- Each task: unique ID, description, completion status
- Auto-increment IDs, in-memory storage only
- Easy to extend for future phases (Phase II-V)

## E. Constraints:
- Only in-memory storage allowed
- No manual typing or copying of code
- Python 3.13+ console application
- Only implement features defined in Phase I specs

## F. Review & Iteration Policy:
- All generated code reviewed by TodoArchitect
- Refinements made via spec updates
- All outputs must comply with Constitution and specs
