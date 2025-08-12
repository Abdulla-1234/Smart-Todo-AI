from django.test import TestCase
from .ai_module import analyze_context, suggest_for_task

class AIModuleTests(TestCase):
    def test_analyze_context_basic(self):
        insights = analyze_context([{"content": "urgent email follow up", "source_type": "email"}])
        self.assertIn("urgency", insights)
        self.assertIn(insights["urgency"], ["low", "medium", "high"])

    def test_suggest_for_task(self):
        s = suggest_for_task({"title": "Write report", "description": "urgent!!"}, existing_count=2, context_entries=[])
        self.assertIn("priority_score", s)
        self.assertIn("deadline", s)
