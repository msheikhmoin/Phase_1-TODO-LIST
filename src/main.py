import sys
from services import TodoService

def main():
    """Main function to run the CLI application."""
    service = TodoService()
    args = sys.argv[1:]

    if not args:
        print("Usage: python main.py <command> [options]")
        print("Commands:")
        print("  add <description>      Adds a new task.")
        print("  list                   Lists all tasks.")
        print("  done <id>              Marks a task as complete.")
        print("  update <id> <desc>     Updates a task's description.")
        print("  delete <id>            Deletes a task.")
        return

    command = args[0]

    if command == "add":
        if len(args) < 2:
            print("Error: Task description cannot be empty.")
            return
        description = " ".join(args[1:])
        task = service.add_task(description)
        print(f'Success: Added task "{task.description}".')

    elif command == "list":
        tasks = service.get_all_tasks()
        if not tasks:
            print("No tasks found.")
        else:
            for task in tasks:
                status = "[X]" if task.completed else "[ ]"
                print(f"[{task.id}] {status} {task.description}")

    elif command == "done":
        if len(args) < 2:
            print("Error: Task ID must be provided.")
            return
        try:
            task_id = int(args[1])
            task = service.mark_task_complete(task_id)
            if task:
                print(f"Success: Task {task_id} marked as complete.")
            else:
                print(f"Error: Task with ID {task_id} not found.")
        except ValueError:
            print("Error: Task ID must be a valid integer.")

    elif command == "update":
        if len(args) < 3:
            print("Error: Task ID and new description must be provided.")
            return
        try:
            task_id = int(args[1])
            new_description = " ".join(args[2:])
            task = service.update_task(task_id, new_description)
            if task:
                print(f"Success: Task {task_id} updated.")
            else:
                print(f"Error: Task with ID {task_id} not found.")
        except ValueError:
            print("Error: Task ID must be a valid integer.")
            
    elif command == "delete":
        if len(args) < 2:
            print("Error: Task ID must be provided.")
            return
        try:
            task_id = int(args[1])
            if service.delete_task(task_id):
                print(f"Success: Task {task_id} deleted.")
            else:
                print(f"Error: Task with ID {task_id} not found.")
        except ValueError:
            print("Error: Task ID must be a valid integer.")

    else:
        print(f"Error: Unknown command '{command}'")

if __name__ == "__main__":
    main()