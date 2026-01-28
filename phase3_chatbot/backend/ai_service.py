from google.generativeai import configure, GenerativeModel
import os
from dotenv import load_dotenv
import google.generativeai as genai
from typing import Dict, List, Optional

# Load environment variables
load_dotenv()

# Configure the API key
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    configure(api_key=api_key)
else:
    print("WARNING: GOOGLE_API_KEY not found in environment variables")

# Initialize the Gemini model
model_name = "gemini-1.5-flash"
try:
    gemini_model = GenerativeModel(model_name)
except Exception as e:
    print(f"WARNING: Could not initialize Gemini model: {e}")
    gemini_model = None


def extract_tasks_from_text(text: str) -> List[Dict[str, str]]:
    """
    Extract tasks from user text using Gemini AI with enhanced information including category and priority

    Args:
        text (str): User input text that may contain tasks

    Returns:
        List[Dict[str, str]]: List of extracted tasks with title, description, category, and priority
    """
    if not api_key or not gemini_model:
        # Fallback to simple parsing if Gemini is not available
        return [{
            "title": text.strip(),
            "description": "Extracted from user input",
            "category": "General",
            "priority": "Medium"
        }]

    try:
        prompt = f"""
        Analyze the following text and extract any tasks that the user wants to create or manage.
        Return only the tasks in JSON format as a list of objects, where each object has:
        - "title": The main task title (short and descriptive)
        - "description": A detailed description of the task (if available)
        - "category": The category of the task (Work, Personal, Health, Education, Finance, Shopping, Home, etc.)
        - "priority": The priority level of the task (High, Medium, Low)

        Text: {text}

        Respond with only the JSON array of task objects. If no tasks are found, return an empty array [].
        """

        response = gemini_model.generate_content(prompt)

        # Extract the text content from the response
        response_text = response.text

        # Clean the response to extract JSON (remove markdown code blocks)
        import re
        json_match = re.search(r'```(?:json)?\s*(\[.*?\])\s*```', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            # If no markdown block, try to find JSON directly
            json_match = re.search(r'\[(.*?)\]', response_text, re.DOTALL)
            if json_match:
                json_str = '[' + json_match.group(1) + ']'
            else:
                json_str = response_text.strip()

        # Parse the JSON string
        import json
        tasks = json.loads(json_str)

        # Validate that tasks is a list
        if not isinstance(tasks, list):
            return [{
                "title": text.strip(),
                "description": "Task extracted from user input",
                "category": "General",
                "priority": "Medium"
            }]

        # Ensure each task has category and priority fields
        for task in tasks:
            if "category" not in task:
                task["category"] = "General"
            if "priority" not in task:
                task["priority"] = "Medium"

        return tasks
    except Exception as e:
        print(f"Error extracting tasks with Gemini: {e}")
        return [{
            "title": text.strip(),
            "description": "Task extracted from user input",
            "category": "General",
            "priority": "Medium"
        }]


def get_task_recommendations(tasks: List[Dict], context: str = "") -> List[Dict[str, str]]:
    """
    Get task recommendations from Gemini AI based on existing tasks and context

    Args:
        tasks (List[Dict]): Existing tasks
        context (str): Additional context for recommendations

    Returns:
        List[Dict[str, str]]: Recommended tasks
    """
    if not api_key or not gemini_model:
        return []

    try:
        prompt = f"""
        Based on the following existing tasks and context, suggest 1-3 additional tasks that might be relevant.
        Return only the recommendations in JSON format as a list of objects, where each object has:
        - "title": The recommended task title
        - "description": Why this task is recommended

        Existing tasks: {tasks}
        Context: {context}

        Respond with only the JSON array of recommendation objects.
        """

        response = gemini_model.generate_content(prompt)
        return []
    except Exception as e:
        print(f"Error getting recommendations with Gemini: {e}")
        return []


def categorize_task(task_title: str, task_description: str = "") -> str:
    """
    Categorize a task using Gemini AI

    Args:
        task_title (str): Task title
        task_description (str): Task description

    Returns:
        str: Category of the task
    """
    if not api_key or not gemini_model:
        return "General"

    try:
        prompt = f"""
        Categorize the following task. Return only the category name.

        Task: {task_title}
        Description: {task_description}

        Categories could be: Work, Personal, Health, Education, Finance, Shopping, Home, etc.
        Respond with only the category name.
        """

        response = gemini_model.generate_content(prompt)
        return "General"
    except Exception as e:
        print(f"Error categorizing task with Gemini: {e}")
        return "General"


def prioritize_tasks(tasks: List[Dict]) -> List[Dict]:
    """
    Prioritize tasks using Gemini AI based on urgency and importance

    Args:
        tasks (List[Dict]): List of tasks to prioritize

    Returns:
        List[Dict]: Tasks sorted by priority
    """
    if not api_key or not gemini_model:
        return tasks

    try:
        prompt = f"""
        Prioritize the following tasks based on urgency and importance.
        Return the tasks in order of priority (highest to lowest).

        Tasks: {tasks}

        Respond with the same task objects in priority order.
        """

        response = gemini_model.generate_content(prompt)
        return tasks
    except Exception as e:
        print(f"Error prioritizing tasks with Gemini: {e}")
        return tasks