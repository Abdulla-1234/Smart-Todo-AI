# ai_module.py
import os
from datetime import datetime, timedelta
from typing import Dict, Any, List
import google.generativeai as genai

# Load API key from environment variable
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("Missing GOOGLE_API_KEY in environment variables.")

genai.configure(api_key=GEMINI_API_KEY)

def suggest_for_task(task: Dict[str, Any], existing_count: int = 0, context_entries: List[Dict[str, Any]] | None = None):
    """
    Generate AI-based task suggestions using Gemini 2.5 Flash.
    """
    context_entries = context_entries or []
    context_text = "\n".join([e.get("content", "") for e in context_entries])

    prompt = f"""
    You are an AI assistant for a smart to-do app.
    Given this task and context, provide:
    1. priority_score (0-100)
    2. deadline (ISO format, UTC timezone)
    3. category (one short label)
    4. enhanced_description (clear and helpful)

    Task:
    Title: {task.get("title")}
    Description: {task.get("description", "")}

    Context:
    {context_text}

    Respond in JSON with keys: priority_score, deadline, category, enhanced_description.
    """

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)

        # The model's text output should be JSON
        import json
        data = json.loads(response.text.strip())

        # Fallback: ensure required fields exist
        return {
            "priority_score": data.get("priority_score", 50),
            "deadline": data.get("deadline", (datetime.utcnow() + timedelta(days=3)).isoformat() + "Z"),
            "category": data.get("category", None),
            "enhanced_description": data.get("enhanced_description", task.get("description", "")),
        }

    except Exception as e:
        # Fallback to safe defaults if AI call fails
        return {
            "priority_score": 50,
            "deadline": (datetime.utcnow() + timedelta(days=3)).isoformat() + "Z",
            "category": None,
            "enhanced_description": task.get("description", ""),
        }
