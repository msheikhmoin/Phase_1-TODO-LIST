import argparse
import sys
from datetime import datetime
from typing import List, Optional

from services import TodoService
from models import Task # Import Task model for type hinting and access to its fields

from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich import print as rich_print # Alias rich.print to avoid conflict with built-in print

console = Console() # Initialize Rich console globally

def _display_tasks(service, args_for_display=None):
    """Helper function to display tasks based on given args."""
    all_tasks = service.get_all_tasks()
    
    keyword = args_for_display.keyword if args_for_display and hasattr(args_for_display, 'keyword') else None
    if keyword:
        all_tasks = service.search_tasks(all_tasks, keyword)

    filter_status = None
    if args_for_display and hasattr(args_for_display, 'status'):
        if args_for_display.status == "completed":
            filter_status = True
        elif args_for_display.status == "pending":
            filter_status = False
    
    priority_filter = args_for_display.priority if args_for_display and hasattr(args_for_display, 'priority') else None
    all_tasks = service.filter_tasks(all_tasks, status=filter_status, priority=priority_filter)

    sort_by = args_for_display.sort if args_for_display and hasattr(args_for_display, 'sort') else "created_at"
    sorted_tasks = service.sort_tasks(all_tasks, sort_by=sort_by)

    if not sorted_tasks:
        console.print("[bold red]No tasks found matching criteria.[/bold red]")
    else:
        table = Table(title="Your To-Do List", style="bold magenta", title_style="bold green")
        table.add_column("ID", style="bold cyan", justify="center")
        table.add_column("Status", style="bold cyan", justify="center")
        table.add_column("Priority", style="bold cyan", justify="center")
        table.add_column("Tags", style="bold cyan")
        table.add_column("Due Date", style="bold cyan")
        table.add_column("Created At", style="bold cyan")
        table.add_column("Description", style="bold cyan")

        total_tasks = len(sorted_tasks)
        completed_tasks = 0
        pending_tasks = 0

        for task in sorted_tasks:
            if task.completed:
                status_str = "[bold green][X][/bold green]"
                completed_tasks += 1
            else:
                status_str = "[yellow][ ][/yellow]"
                pending_tasks += 1

            priority_color = "white"
            if task.priority == "High":
                priority_color = "bold red"
            elif task.priority == "Medium":
                priority_color = "yellow" 
            elif task.priority == "Low":
                priority_color = "blue"
            priority_str = f"[{priority_color}]{task.priority}[/{priority_color}]"

            # Fix for Date Strings
            due_date_str = "N/A"
            if task.due_date:
                if isinstance(task.due_date, datetime):
                    due_date_str = task.due_date.strftime("%Y-%m-%d %H:%M")
                else:
                    due_date_str = str(task.due_date)

            created_at_str = "N/A"
            if task.created_at:
                if isinstance(task.created_at, datetime):
                    created_at_str = task.created_at.strftime("%Y-%m-%d %H:%M")
                else:
                    created_at_str = str(task.created_at)
            
            # --- FIX: Defining tags_str before using it ---
            tags_str = ", ".join(task.tags) if task.tags else "N/A"
            
            overdue_prefix = ""
            if isinstance(task.due_date, datetime) and not task.completed and task.due_date < datetime.now():
                overdue_prefix = "[bold yellow on red]OVERDUE![/bold yellow on red] "
            
            table.add_row(
                str(task.id),
                status_str,
                priority_str,
                tags_str,
                due_date_str,
                created_at_str,
                f"{overdue_prefix}{task.description}"
            )
        
        console.print(table)
        console.print(f"[bold white]Summary: Total Tasks: {total_tasks} | Completed: {completed_tasks} | Pending: {pending_tasks}[/bold white]")


def handle_command_line_args(service, args):
    """Handles commands passed via command-line arguments."""
    if args.command == "add":
        description = " ".join(args.description)
        tags_list = [tag.strip() for tag in args.tags.split(',')] if args.tags else []
        due_date_obj = None
        if args.due_date:
            try:
                due_date_obj = datetime.strptime(args.due_date, "%Y-%m-%d %H:%M")
            except ValueError:
                console.print("[bold red]Error: Invalid due date format. Please use YYYY-MM-DD HH:MM.[/bold red]")
                return
        
        task = service.add_task(
            description=description,
            priority=args.priority,
            tags=tags_list,
            due_date=due_date_obj,
            is_recurring=args.recurring,
            recurrence_interval=args.interval
        )
        console.print(f'[green]Success: Added task "{task.description}".[/green]')

    elif args.command == "view":
        _display_tasks(service, args)

    elif args.command == "done":
        task_id = args.id
        task = service.mark_task_complete(task_id)
        if task:
            console.print(f"[green]Success: Task {task_id} marked as complete.[/green]")
            if task.is_recurring:
                console.print(f"[yellow]Note: Recurring task '{task.description}' completed. A new instance will be created.[/yellow]")
        else:
            console.print(f"[bold red]Error: Task with ID {task_id} not found.[/bold red]")

    elif args.command == "update":
        task_id = args.id
        updated_description = " ".join(args.description) if args.description else None
        updated_tags_list = [tag.strip() for tag in args.tags.split(',')] if args.tags else None
        updated_due_date_obj = None
        if args.due_date:
            try:
                updated_due_date_obj = datetime.strptime(args.due_date, "%Y-%m-%d %H:%M")
            except ValueError:
                console.print("[bold red]Error: Invalid due date format. Please use YYYY-MM-DD HH:MM.[/bold red]")
                return

        updated_task = service.update_task(
            task_id=task_id,
            description=updated_description,
            priority=args.priority,
            tags=updated_tags_list,
            due_date=updated_due_date_obj,
            is_recurring=args.recurring,
            recurrence_interval=args.interval
        )
        if updated_task:
            console.print(f"[green]Success: Task {task_id} updated.[/green]")
        else:
            console.print(f"[bold red]Error: Task with ID {task_id} not found.[/bold red]")
            
    elif args.command == "delete":
        task_id = args.id
        if service.delete_task(task_id):
            console.print(f"[green]Success: Task {task_id} deleted.[/green]")
        else:
            console.print(f"[bold red]Error: Task with ID {task_id} not found.[/bold red]")
            
    elif args.command == "search":
        _display_tasks(service, args)
                
    elif args.command == "filter":
        _display_tasks(service, args)

def main():
    """Main function to run the CLI application, supporting both interactive and command-line modes."""
    service = TodoService()

    parser = argparse.ArgumentParser(description="CLI To-Do Application")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    add_parser = subparsers.add_parser("add", help="Adds a new task.")
    add_parser.add_argument("description", type=str, nargs="+", help="Description of the task")
    add_parser.add_argument("--priority", type=str, default="Medium",
                            choices=["High", "Medium", "Low"], help="Priority of the task")
    add_parser.add_argument("--tags", type=str, help="Comma-separated tags for the task (e.g., work,home)")
    add_parser.add_argument("--due-date", type=str, help="Due date for the task (YYYY-MM-DD HH:MM)")
    add_parser.add_argument("--recurring", action="store_true", help="Set task as recurring")
    add_parser.add_argument("--interval", type=str, choices=["Daily", "Weekly"],
                            help="Recurrence interval (Daily, Weekly) if recurring")

    view_parser = subparsers.add_parser("view", help="Lists all tasks.")
    view_parser.add_argument("--sort", type=str, default="created_at",
                             choices=["created_at", "priority"], help="Sort tasks by 'created_at' or 'priority'")
    view_parser.add_argument("--status", type=str, choices=["completed", "pending"],
                             help="Filter tasks by status")
    view_parser.add_argument("--priority", type=str, choices=["High", "Medium", "Low"],
                             help="Filter tasks by priority")
    view_parser.add_argument("--keyword", type=str, help="Search tasks by keyword in description or title")

    done_parser = subparsers.add_parser("done", help="Marks a task as complete.")
    done_parser.add_argument("id", type=int, help="ID of the task to mark as complete")

    update_parser = subparsers.add_parser("update", help="Updates a task.")
    update_parser.add_argument("id", type=int, help="ID of the task to update")
    update_parser.add_argument("--description", type=str, nargs="+", help="New description for the task")
    update_parser.add_argument("--priority", type=str, choices=["High", "Medium", "Low"],
                                help="New priority for the task")
    update_parser.add_argument("--tags", type=str, help="New comma-separated tags for the task")
    update_parser.add_argument("--due-date", type=str, help="New due date for the task (YYYY-MM-DD HH:MM)")
    update_parser.add_argument("--recurring", type=bool, help="Set task as recurring (True/False)")
    update_parser.add_argument("--interval", type=str, choices=["Daily", "Weekly"],
                                help="New recurrence interval (Daily, Weekly)")

    delete_parser = subparsers.add_parser("delete", help="Deletes a task.")
    delete_parser.add_argument("id", type=int, help="ID of the task to delete")
    
    search_parser = subparsers.add_parser("search", help="Searches tasks by keyword.")
    search_parser.add_argument("keyword", type=str, help="Keyword to search for in task descriptions or titles")

    filter_parser = subparsers.add_parser("filter", help="Filters tasks by various criteria.")
    filter_parser.add_argument("--status", type=str, choices=["completed", "pending"],
                                help="Filter tasks by status (completed, pending)")
    filter_parser.add_argument("--priority", type=str, choices=["High", "Medium", "Low"],
                                help="Filter tasks by priority (High, Medium, Low)")

    if len(sys.argv) > 1:
        args = parser.parse_args()
        handle_command_line_args(service, args)
    else:
        while True:
            menu_text = """
1. Add Task
2. View Tasks
3. Complete Task
4. Delete Task
5. Search Task
6. Filter by Priority
7. Exit
"""
            menu_panel = Panel(menu_text, title="[bold cyan]Todo Master Menu[/bold cyan]", border_style="green")
            console.print(menu_panel)

            choice = input("Enter your choice: ")

            if choice == '1':
                description = input("Enter task description: ")
                priority = input("Enter priority (High, Medium, Low - default Medium): ") or "Medium"
                tags_str_input = input("Enter tags (comma-separated, e.g., work,home): ")
                tags_list = [tag.strip() for tag in tags_str_input.split(',')] if tags_str_input else []
                due_date_str_input = input("Enter due date (YYYY-MM-DD HH:MM, optional): ")
                due_date_obj = None
                if due_date_str_input:
                    try:
                        due_date_obj = datetime.strptime(due_date_str_input, "%Y-%m-%d %H:%M")
                    except ValueError:
                        console.print("[bold red]Error: Invalid due date format. Please use YYYY-MM-DD HH:MM.[/bold red]")
                        continue
                recurring_input = input("Is this a recurring task? (yes/no): ").lower()
                is_recurring = recurring_input == 'yes'
                recurrence_interval = None
                if is_recurring:
                    recurrence_interval = input("Enter recurrence interval (Daily, Weekly): ")

                task = service.add_task(
                    description=description,
                    priority=priority,
                    tags=tags_list,
                    due_date=due_date_obj,
                    is_recurring=is_recurring,
                    recurrence_interval=recurrence_interval
                )
                console.print(f'[green]Success: Added task "{task.description}".[/green]')

            elif choice == '2':
                class InteractiveArgs:
                    def __init__(self):
                        self.sort = "created_at"
                        self.status = None
                        self.priority = None
                        self.keyword = None
                
                interactive_args = InteractiveArgs()
                _display_tasks(service, interactive_args)

            elif choice == '3':
                try:
                    task_id_input = input("Enter the ID of the task to complete: ")
                    task_id = int(task_id_input)
                    task = service.mark_task_complete(task_id)
                    if task:
                        console.print(f"[green]Success: Task {task_id} marked as complete.[/green]")
                        if task.is_recurring:
                            console.print(f"[yellow]Note: Recurring task '{task.description}' completed. A new instance will be created.[/yellow]")
                    else:
                        console.print("[bold red]Error: Please enter a valid Task ID.[/bold red]")
                except ValueError:
                    console.print("[bold red]Error: Please enter a valid Task ID.[/bold red]")

            elif choice == '4':
                try:
                    task_id_input = input("Enter the ID of the task to delete: ")
                    task_id = int(task_id_input)
                    if service.delete_task(task_id):
                        console.print(f"[green]Success: Task {task_id} deleted.[/green]")
                    else:
                        console.print("[bold red]Error: Please enter a valid Task ID.[/bold red]")
                except ValueError:
                    console.print("[bold red]Error: Please enter a valid Task ID.[/bold red]")

            elif choice == '5': 
                keyword = input("Enter keyword to search: ")
                class InteractiveArgs:
                    def __init__(self):
                        self.sort = "created_at"
                        self.status = None
                        self.priority = None
                        self.keyword = keyword
                interactive_args = InteractiveArgs()
                _display_tasks(service, interactive_args)

            elif choice == '6':
                priority_filter = input("Filter by priority (High, Medium, Low): ").capitalize()
                if priority_filter not in ["High", "Medium", "Low"]:
                    console.print("[bold red]Error: Invalid priority. Please enter 'High', 'Medium', or 'Low'.[/bold red]")
                    continue
                class InteractiveArgs:
                    def __init__(self):
                        self.sort = "created_at"
                        self.status = None
                        self.priority = priority_filter
                        self.keyword = None
                interactive_args = InteractiveArgs()
                _display_tasks(service, interactive_args)

            elif choice == '7':
                console.print("[yellow]Exiting To-Do Application. Goodbye![/yellow]")
                break
            else:
                console.print("[bold red]Invalid choice. Please try again.[/bold red]")

if __name__ == "__main__":
    main()