import cohere
import os
import json
import re
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

def extract_tasks_from_text(text: str):
    """Extracts tasks from text using Cohere with manual date and title handling."""
    today = datetime.now()

    # Check for 'kal' or 'tomorrow' in the original text for manual date handling
    has_kal = bool(re.search(r'\b(kal|tomorrow)\b', text, re.IGNORECASE))
    has_aaj = bool(re.search(r'\b(aaj|today)\b', text, re.IGNORECASE))

    # Check if the text contains task-indicating verbs or phrases (in English, Roman Urdu, Hindi)
    task_indicators = [
        r'jana hai', r'karna hai', r'karni hai', r'karna hy', r'karni hy', r'go to', r'need to', r'have to',
        r'chahiye', r'chahiye', r'krna hy', r'krni hy', r'karwana', r'lena hai', r'lena hy', r'leni hai',
        r'leni hy', r'buy', r'purchase', r'get', r'do ', r'done', r'complete', r'finish', r'start', r'begin'
    ]

    has_task_indicators = any(re.search(indicator, text.lower()) for indicator in task_indicators)

    # First, try to get the API key from environment
    api_key = os.getenv("COHERE_API_KEY")

    # If not in env, use the fallback key
    if not api_key:
        api_key = "AGp07tWH0OMbwM4GQG3uiPhj1T8KMV5Gz5I0S0em"

    # Check if API key is valid before initializing client
    if api_key and api_key != "":
        try:
            co = cohere.Client(api_key)

            # Try to use Cohere API
            try:
                # Enhanced prompt to better detect tasks
                prompt = f"""Extract tasks from this message: '{text}'.

                CRITICAL: If the message contains any action or intention to do something (even if not explicitly said as a task),
                create a task. Look for phrases like 'jana hai', 'karna hai', 'need to', 'have to', etc.

                Return ONLY a JSON list of objects with title, description, category, priority, and deadline.
                For title: Extract the core action verb + object (e.g., 'Go to market', 'Buy groceries').
                For description: Use the full original text as description.
                For category: Guess from context (Shopping, Work, Personal, etc.) or default to 'General'.
                For priority: 'High' if urgent words like 'urgent', 'now', 'jaldi', 'jis', 'jald' are present, else 'Medium'.
                For deadline: Use YYYY-MM-DD format. 'today'='{today.strftime('%Y-%m-%d')}', 'tomorrow'='{(today + timedelta(days=1)).strftime('%Y-%m-%d')}'.

                If no explicit tasks found but action/intention exists, still create a task.
                Return ONLY valid JSON in format: [{{"title": "...", "description": "...", "category": "...", "priority": "...", "deadline": "YYYY-MM-DD"}}].
                If no tasks found at all, return []"""

                response = co.chat(
                    message=prompt,
                    model='command-r-plus',
                    temperature=0.1
                )

                raw_text = response.text.strip()
                # JSON dhoondne ke liye regex
                json_match = re.search(r'\[.*\]', raw_text, re.DOTALL)

                if json_match:
                    extracted_data = json.loads(json_match.group())

                    # Post-process to clean titles and dates
                    for task in extracted_data:
                        # Remove filler words from title ('Bhai', 'Yaar', 'Please', 'Kal')
                        title_words = task.get("title", "").split()
                        clean_title_words = [w for w in title_words if w.lower() not in {'bhai', 'yaar', 'please', 'plz', 'kripya', 'set', 'kar', 'do', 'lo', 'add', 'make', 'create', 'kal'}]
                        if clean_title_words:
                            task["title"] = " ".join(clean_title_words[:3]).capitalize()  # Take first 3 meaningful words
                        else:
                            task["title"] = "Task"

                        # Manually handle 'kal' (tomorrow) using datetime.now() + timedelta(days=1)
                        if has_kal:
                            task["deadline"] = (today + timedelta(days=1)).strftime('%Y-%m-%d')
                        elif has_aaj:
                            task["deadline"] = today.strftime('%Y-%m-%d')
                        else:
                            # Process deadline if provided by AI
                            deadline_val = task.get("deadline", "")
                            if isinstance(deadline_val, str):
                                if 'tomorrow' in deadline_val.lower() or 'kal' in deadline_val.lower():
                                    task["deadline"] = (today + timedelta(days=1)).strftime('%Y-%m-%d')
                                elif 'today' in deadline_val.lower() or 'aaj' in deadline_val.lower():
                                    task["deadline"] = today.strftime('%Y-%m-%d')

                    return extracted_data

                # If no JSON found but text indicates a task, create a default task
                elif has_task_indicators:
                    # Extract the main action from the text
                    title = text.strip()
                    if 'bazar' in text.lower():
                        title = "Go to market"
                    elif 'shop' in text.lower() or 'buy' in text.lower():
                        title = "Shopping"
                    elif 'shopping' in text.lower():
                        title = "Shopping"
                    else:
                        title = "New Task"

                    return [{
                        "title": title,
                        "description": text,
                        "category": "General",
                        "priority": "Medium",
                        "deadline": today.strftime('%Y-%m-%d')
                    }]

            except Exception as e:
                print(f"!!! Cohere API Error (will use fallback): {str(e)}")
                # Continue to fallback logic below
        except Exception as client_error:
            print(f"!!! Cohere Client Initialization Error: {str(client_error)}")
            # Continue to fallback logic below

    # Fallback: Use regex/string parsing to extract tasks when AI fails
    print("!!! Using fallback task extraction due to AI failure")

    # Simple keyword-based task extraction
    text_lower = text.lower().strip()

    # Define common task keywords and their corresponding titles
    task_keywords = {
        'shopping': 'Shopping',
        'buy': 'Shopping',
        'purchase': 'Shopping',
        'grocery': 'Grocery Shopping',
        'market': 'Go to market',
        'work': 'Work Task',
        'meeting': 'Meeting',
        'call': 'Phone Call',
        'email': 'Send Email',
        'clean': 'Clean House',
        'exercise': 'Exercise',
        'read': 'Reading',
        'study': 'Study',
        'homework': 'Homework',
        'assignment': 'Assignment',
        'pay': 'Pay Bills',
        'bill': 'Pay Bills',
        'doctor': 'Doctor Appointment',
        'appointment': 'Appointment',
        'party': 'Party',
        'event': 'Event',
        'travel': 'Travel Plan',
        'trip': 'Trip',
        'visit': 'Visit',
        'cook': 'Cook Meal',
        'eat': 'Eat',
        'sleep': 'Sleep',
        'rest': 'Rest',
        'laundry': 'Laundry',
        'wash': 'Wash Clothes',
        'repair': 'Repair',
        'fix': 'Fix Item',
        'learn': 'Learn',
        'practice': 'Practice'
    }

    # Look for keywords in the text
    for keyword, title in task_keywords.items():
        if keyword in text_lower:
            # Determine priority based on urgency indicators
            high_priority_keywords = ['urgent', 'now', 'asap', 'jaldi', 'jis', 'jald', 'important']
            priority = 'High' if any(urgency in text_lower for urgency in high_priority_keywords) else 'Medium'

            # Determine deadline based on time indicators
            deadline = today.date()  # Return actual date object, not string
            if 'tomorrow' in text_lower or 'kal' in text_lower:
                deadline = (today + timedelta(days=1)).date()
            elif 'day after' in text_lower:
                deadline = (today + timedelta(days=2)).date()
            elif 'yesterday' in text_lower:
                deadline = (today - timedelta(days=1)).date()

            return [{
                "title": title,
                "description": text,
                "category": "General",
                "priority": priority,
                "deadline": deadline
            }]

    # If no specific keywords found but it seems like a task, create a generic task
    if has_task_indicators or len(text.split()) >= 2:
        # Extract potential task from the text
        title = text.strip()

        # If text is too long, try to extract a meaningful title
        if len(text.split()) > 5:
            # Try to find the main action by looking for common verbs
            words = text.split()
            for i, word in enumerate(words):
                if word.lower() in ['need', 'to', 'go', 'buy', 'get', 'do', 'make', 'take', 'have']:
                    if i + 1 < len(words):
                        title = f"{word} {words[i+1]}"
                        break

        return [{
            "title": title,
            "description": text,
            "category": "General",
            "priority": "Medium",
            "deadline": today.date()  # Return actual date object, not string
        }]

    # If nothing looks like a task, return empty list
    return []