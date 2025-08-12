# Smart Todo AI – Django REST Backend

This is a standalone Django 5 + DRF backend serving the Smart Todo AI APIs, designed to work with a Vite + React + TypeScript frontend at http://localhost:5173.

## Features
- PostgreSQL models: Tasks, Categories, Context Entries
- REST endpoints for tasks, categories, context
- AI suggestions endpoint implementing lightweight heuristics (no external keys required)
- CORS enabled for Vite dev server

## Requirements
- Python 3.11+
- PostgreSQL 14+

## Setup
1. Clone or copy the `backend/` folder somewhere on your machine.
2. Create and activate a virtual environment:
   - macOS/Linux: `python3 -m venv .venv && source .venv/bin/activate`
   - Windows (PowerShell): `py -3 -m venv .venv; .venv\Scripts\Activate.ps1`
3. Install dependencies:
   `pip install -r requirements.txt`
4. Configure PostgreSQL (env vars):
   - POSTGRES_DB (default: smarttodo)
   - POSTGRES_USER (default: postgres)
   - POSTGRES_PASSWORD (default: postgres)
   - POSTGRES_HOST (default: 127.0.0.1)
   - POSTGRES_PORT (default: 5432)
5. Run migrations:
   `python manage.py migrate`
6. Start server:
   `python manage.py runserver 0.0.0.0:8000`

The API will be available at http://localhost:8000

## API Endpoints
- GET /tasks/
- POST /tasks/
- GET /categories/
- GET /context/
- POST /context/
- POST /ai/suggestions/

### Payload examples
POST /tasks/
```
{
  "title": "Reply to email",
  "description": "Follow up with client",
  "category": "Communication",
  "priority_score": 70,
  "deadline": "2025-01-01T12:00:00Z",
  "status": "pending"
}
```

POST /context/
```
{ "content": "urgent email from team", "source_type": "email" }
```

POST /ai/suggestions/
```
{ "title": "Write proposal", "description": "architecture draft" }
```

### Notes
- Task `category` is sent/returned as a string name; the backend resolves it to a Category FK internally.
- Date-times are ISO 8601 in UTC.
- CORS is already enabled for http://localhost:5173

## Optional: External LLMs
`tasks_app/ai_module.py` uses heuristic logic by default. You can integrate OpenAI/Claude/Gemini by reading an API key from env and replacing the suggest/analyze functions.
