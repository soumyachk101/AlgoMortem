# AlgoMortem — Backend Architecture

**Version:** 1.0  
**Runtime:** Python 3.11 | FastAPI | Railway  

---

## 1. Service Architecture

AlgoMortem backend is a **monolith with async internals** — not microservices. Single FastAPI app with Celery workers for heavy async tasks (anti-hint generation).

```
┌─────────────────────────────────────────────────────────────┐
│                         Railway                             │
│                                                             │
│  ┌──────────────┐     ┌──────────────┐    ┌─────────────┐  │
│  │  FastAPI App │     │Celery Worker │    │  Beat (cron)│  │
│  │  (uvicorn)   │────▶│ (anti-hint)  │    │  (analytics)│  │
│  └──────┬───────┘     └──────┬───────┘    └─────────────┘  │
│         │                   │                               │
└─────────┼───────────────────┼───────────────────────────────┘
          │                   │
    ┌─────▼─────┐       ┌─────▼──────┐    ┌──────────────┐
    │ Supabase  │       │   Upstash  │    │  Anthropic   │
    │PostgreSQL │       │   Redis    │    │  Claude API  │
    │ pgvector  │       │            │    │              │
    └───────────┘       └────────────┘    └──────────────┘
```

---

## 2. Directory Structure

```
backend/
├── app/
│   ├── main.py                    # FastAPI app init, middleware, routers
│   ├── config.py                  # Settings via pydantic-settings
│   ├── deps.py                    # Shared FastAPI dependencies (db session, auth)
│   │
│   ├── api/
│   │   ├── v1/
│   │   │   ├── router.py          # Aggregate all v1 routers
│   │   │   ├── problems.py        # Problem CRUD endpoints
│   │   │   ├── dry_runs.py        # Dry run lifecycle endpoints
│   │   │   ├── anti_hint.py       # Anti-hint trigger endpoint
│   │   │   ├── auth.py            # Clerk user sync
│   │   │   └── analytics.py       # User + problem stats
│   │
│   ├── core/
│   │   ├── security.py            # Clerk JWT verification
│   │   ├── rate_limiter.py        # Redis-backed rate limiting
│   │   └── exceptions.py          # Custom exception classes + handlers
│   │
│   ├── models/
│   │   ├── base.py                # SQLAlchemy declarative base
│   │   ├── user.py                # User model
│   │   ├── problem.py             # Problem model
│   │   ├── dry_run.py             # DryRun + DryRunStep models
│   │   ├── anti_hint.py           # AntiHint record model
│   │   └── mistake_kb.py          # MistakeKB vector document model
│   │
│   ├── schemas/
│   │   ├── problem.py             # Pydantic schemas for problems
│   │   ├── dry_run.py             # Pydantic schemas for dry runs
│   │   └── anti_hint.py           # Pydantic schemas for anti-hints
│   │
│   ├── services/
│   │   ├── anti_hint_engine.py    # Core RAG + Claude orchestration
│   │   ├── embedding_service.py   # OpenAI text-embedding-3-small wrapper
│   │   ├── vector_search.py       # pgvector cosine similarity search
│   │   ├── dry_run_service.py     # Dry run business logic
│   │   ├── problem_service.py     # Problem retrieval + caching
│   │   └── analytics_service.py   # Stats computation
│   │
│   ├── tasks/
│   │   ├── celery_app.py          # Celery app init
│   │   ├── anti_hint_task.py      # Async anti-hint generation task
│   │   └── analytics_task.py      # Background stats recomputation
│   │
│   └── db/
│       ├── session.py             # Async SQLAlchemy session factory
│       └── redis.py               # Redis client init
│
├── alembic/                       # DB migrations
│   ├── env.py
│   └── versions/
│       └── 001_initial_schema.py
│
├── scripts/
│   ├── seed_problems.py           # Load problems from JSON seed files
│   └── seed_mistake_kb.py         # Embed and load MKB documents
│
├── tests/
│   ├── test_anti_hint_engine.py
│   ├── test_dry_runs.py
│   └── test_rate_limiter.py
│
├── pyproject.toml
├── Dockerfile
└── railway.toml
```

---

## 3. Core Service: Anti-Hint Engine

This is the heart of the product. Located at `app/services/anti_hint_engine.py`.

### 3.1 Flow
```python
async def generate_anti_hint(
    dry_run: DryRun,
    problem: Problem,
    hint_number: int  # 1, 2, or 3
) -> AntiHintResult:
    
    # 1. Serialize dry run to structured text
    dry_run_text = serialize_dry_run(dry_run)
    
    # 2. Embed the dry run text
    embedding = await embedding_service.embed(
        f"{problem.topic} {problem.title}: {dry_run_text}"
    )
    
    # 3. Vector search in MKB
    similar_mistakes = await vector_search.search(
        embedding=embedding,
        top_k=10,
        filters={"problem_topic": problem.topic}
    )
    
    # 4. Re-rank by relevance
    top_mistakes = rerank_mistakes(similar_mistakes, dry_run, hint_number)[:3]
    
    # 5. Generate anti-hint via Claude
    anti_hint = await claude_client.generate(
        system=build_system_prompt(hint_number),
        user=build_user_prompt(dry_run, problem, top_mistakes, hint_number)
    )
    
    # 6. Validate output (no code, has question, has step reference)
    validated = validate_anti_hint(anti_hint)
    
    # 7. Store anti-hint record
    await store_anti_hint(dry_run.id, validated, hint_number)
    
    return validated
```

### 3.2 Re-ranking Logic
When hint_number = 1: Return highest cosine similarity match
When hint_number = 2: Exclude mistake class of hint 1, return next highest
When hint_number = 3: Force "zoomed in" — only return step_descriptor = "boundary_condition" or "loop_termination" (most granular)

### 3.3 Validation
Anti-hint is rejected and regenerated (max 2 retries) if:
- No question mark found
- Contains words: "solution", "answer", "correct approach", "you should", "try using"
- Contains backtick characters (code blocks)
- No "Step" followed by a number
- Length > 300 characters

---

## 4. Rate Limiting

Located at `app/core/rate_limiter.py`. Redis-backed.

```python
class RateLimiter:
    async def check_anti_hint_per_attempt(
        self, user_id: str, dry_run_id: str
    ) -> bool:
        key = f"rate:antihint:attempt:{dry_run_id}"
        count = await redis.incr(key)
        if count == 1:
            await redis.expire(key, 86400)  # 24h TTL
        return count <= 3  # max 3 per attempt
    
    async def check_anti_hint_per_day(
        self, user_id: str, tier: str
    ) -> bool:
        key = f"rate:antihint:daily:{user_id}:{today()}"
        limit = 10 if tier == "free" else 999
        count = await redis.incr(key)
        if count == 1:
            await redis.expire(key, 86400)
        return count <= limit
```

---

## 5. Clerk JWT Middleware

```python
# app/core/security.py
from clerk_backend_api import Clerk

async def verify_clerk_token(token: str) -> ClerkUser:
    clerk = Clerk(bearer_auth=settings.CLERK_SECRET_KEY)
    try:
        payload = clerk.verify_token(token)
        return ClerkUser(
            id=payload["sub"],
            email=payload.get("email"),
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# FastAPI dependency
async def get_current_user(
    authorization: str = Header(...),
    db: AsyncSession = Depends(get_db)
) -> User:
    token = authorization.replace("Bearer ", "")
    clerk_user = await verify_clerk_token(token)
    
    user = await db.execute(
        select(User).where(User.clerk_id == clerk_user.id)
    )
    user = user.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not synced")
    return user
```

---

## 6. Celery Configuration

```python
# app/tasks/celery_app.py
from celery import Celery

celery_app = Celery(
    "algomortem",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks.anti_hint_task", "app.tasks.analytics_task"]
)

celery_app.conf.update(
    task_serializer="json",
    result_expires=3600,        # Anti-hint results expire after 1hr
    task_soft_time_limit=30,    # 30s timeout on anti-hint task
    task_time_limit=45,
    worker_max_tasks_per_child=100,
)
```

### Anti-Hint Task
```python
# app/tasks/anti_hint_task.py
@celery_app.task(bind=True, max_retries=2)
def generate_anti_hint_task(self, dry_run_id: str, hint_number: int):
    try:
        result = asyncio.run(
            anti_hint_engine.generate_anti_hint(dry_run_id, hint_number)
        )
        return {"status": "done", "hint": result.text, "step": result.step_reference}
    except Exception as exc:
        raise self.retry(exc=exc, countdown=2)
```

### Frontend Polling
Frontend POSTs to `/anti-hint` → gets task_id back → polls `/anti-hint/status/:task_id` every 500ms → gets result when done or "pending".

---

## 7. Problem Seeding Pipeline

Problems are stored as JSON files in `scripts/seed_data/problems/`. Each has:
```json
{
  "slug": "two-sum",
  "title": "Two Sum",
  "difficulty": "easy",
  "topic": "arrays",
  "statement": "...",
  "examples": [...],
  "constraints": [...],
  "common_mistake_tags": ["off_by_one", "hash_collision_misconception"],
  "canonical_variable_headers": ["i", "j", "complement", "hashmap"]
}
```

`seed_problems.py` reads these and bulk-inserts via SQLAlchemy. `seed_mistake_kb.py` reads MKB JSON files, calls OpenAI embeddings API, and bulk-inserts with embeddings into `mistake_kb` table.

---

## 8. Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml .
RUN pip install --no-cache-dir .

COPY . .

# FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

`railway.toml` defines two services from same repo: `web` (uvicorn) and `worker` (celery worker).

---

## 9. Key Dependencies (pyproject.toml)

```toml
[project]
dependencies = [
    "fastapi>=0.111",
    "uvicorn[standard]>=0.29",
    "sqlalchemy[asyncio]>=2.0",
    "asyncpg>=0.29",
    "alembic>=1.13",
    "pydantic-settings>=2.2",
    "celery[redis]>=5.3",
    "anthropic>=0.28",
    "openai>=1.30",
    "pgvector>=0.3",
    "redis[hiredis]>=5.0",
    "clerk-backend-api>=1.0",
    "sentry-sdk[fastapi]>=2.0",
    "httpx>=0.27",
]
```
