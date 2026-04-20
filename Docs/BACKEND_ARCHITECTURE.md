# Backend Architecture (FastAPI)

## 1. Directory Structure
```
backend/
├── app/
│   ├── api/            # API Routes
│   │   ├── auth.py
│   │   ├── problems.py
│   │   ├── dry_run.py
│   │   └── ai.py
│   ├── core/           # Config, Security, Constants
│   ├── models/         # SQLAlchemy Models
│   ├── schemas/        # Pydantic Schemas
│   ├── services/       # Business Logic & AI Logic
│   │   ├── ai_engine.py
│   │   └── problem_service.py
│   └── main.py         # Entry point
├── tests/
├── alembic/            # Database migrations
└── requirements.txt
```

## 2. AI Engine (Anti-Hint Generation)
The AI Service is the heart of AlgoMortem.

### Prompt Strategy
The system uses a \"Thinking Dissector\" prompt.
- **Input**: User's Logic Plan, Variable History (last 3 steps), Problem Solution.
- **Instruction**: \"Do not tell the user the answer. Identify one specific inconsistency between their dry-run and their logic plan. Phrase it as a question.\"

### Optimization
- Use **Gemini 2.0 Flash** for high speed and low cost for routine step validation.
- Use **Gemini 2.0 Pro** for deep \"Logic Plan\" analysis at the start of a session.

## 3. API Contract Examples

### `POST /dry-run/{id}/step`
- **Request**: `{ \"variables\": {...}, \"note\": \"...\" }`
- **Response**: `{ \"status\": \"accepted\", \"feedback\": null }` OR `{ \"status\": \"hint_triggered\", \"feedback\": { \"text\": \"...\" } }`
