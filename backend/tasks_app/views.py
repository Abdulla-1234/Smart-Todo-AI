from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .ai_module import suggest_for_task
from .models import Task, ContextEntry
import os
import google.generativeai as genai

@api_view(["POST"])
def ai_suggestions(request):
    try:
        data = request.data
        if not data.get("title"):
            return Response({"error": "Task title is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Load API key
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            return Response({"error": "Missing GOOGLE_API_KEY in .env"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        genai.configure(api_key=api_key)

        # Prepare prompt for Gemini
        prompt = f"""
        You are a smart task manager AI.
        Analyze the task and suggest:
        - Priority score (0-100)
        - Suggested deadline (YYYY-MM-DD)
        - Task category
        - Improved task description

        Task Title: {data['title']}
        Task Description: {data.get('description', '')}
        """

        model = genai.GenerativeModel("gemini-2.5-flash")
        gemini_response = model.generate_content(prompt)

        ai_text = getattr(gemini_response, "text", "").strip() or "No AI suggestion available."

        # Get context and workload data
        context_entries = list(ContextEntry.objects.values("content", "source_type"))
        existing_count = Task.objects.count()

        # Use local scoring logic
        suggestion = suggest_for_task(data, existing_count, context_entries)
        suggestion["enhanced_description"] = (
            f"{suggestion.get('enhanced_description', '')}\n\nAI Suggestion:\n{ai_text}"
        ).strip()

        return Response(suggestion)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
