# AlgoMortem — System Design

**Version:** 1.0  
**Architecture Style:** Async Monolith + Background Workers  

---

## 1. High-Level Architecture

```
                          ┌──────────────┐
                          │   Vercel     │
                          │  Next.js 14  │
                          │  (Frontend)  │
                          └──────┬───────┘
                                 │ HTTPS
                                 ▼
                    ┌────────────────────────┐
                    │       Railway          │
                    │                        │
                    │   ┌────────────────┐   │
                    │   │   FastAPI      │   │
                    │   │  (uvicorn x2)  │   │
                    │   └───────┬────────┘   │
                    │           │            │
                    │   ┌───────▼────────┐   │
                    │   │ Celery Worker  │   │
                    │   │ (anti-hint AI) │   │
                    │   └────────────────┘   │
                    └──────┬─────────────────┘
                           │
           ┌───────────────┼───────────────────┐
           │               │                   │
    ┌──────▼──────┐  ┌─────▼──────┐  ┌────────▼──────┐
    │  Supabase   │  │  Upstash   │  │  Anthropic    │
    │ PostgreSQL  │  │   Redis    │  │  Claude API   │
    │  pgvector   │  │            │  │               │
    └─────────────┘  └────────────┘  └───────────────┘
                                             │
                                    ┌────────▼──────┐
                                    │  OpenAI API   │
                                    │  (embeddings) │
                                    └───────────────┘
```

---

## 2. Anti-Hint Request Flow (Critical Path)

This is the most important system flow. Must complete in <4 seconds.

```
Frontend                    FastAPI             Redis            Celery          Claude API
   │                           │                  │                │                │
   │─── POST /anti-hint ───────▶│                  │                │                │
   │                           │─── rate check ───▶│                │                │
   │                           │◀── OK ────────────│                │                │
   │                           │─── queue task ──────────────────────▶│               │
   │                           │◀── task_id ─────────────────────────│               │
   │◀── 202 { task_id } ───────│                  │                │                │
   │                           │                  │                │                │
   │ (500ms later)             │                  │                │                │
   │─── GET /anti-hint/status/{task_id} ──────────▶│                │                │
   │◀── { status: "pending" } ─────────────────────│                │                │
   │                           │                  │                │                │
   │                           │                  │    embed dry run               │
   │                           │                  │    vector search               │
   │                           │                  │    ──────────────────────────▶ │
   │                           │                  │    ◀─── anti-hint text ─────── │
   │                           │                  │    store result in Redis        │
   │                           │                  │                │                │
   │ (next 500ms poll)         │                  │                │                │
   │─── GET /anti-hint/status/{task_id} ──────────▶│                │                │
   │◀── { status: "done", hint: "..." } ────────────│                │                │
```

### Why Celery (not just async FastAPI)?
The embedding + vector search + Claude API call chain can take 2-4 seconds. If handled in the request thread, it ties up a uvicorn worker. With Celery, FastAPI responds in <50ms with a task ID. The client polls. This keeps the API responsive even under load.

---

## 3. RAG Pipeline Detail

```
User Dry Run Text (serialized)
          │
          ▼
┌─────────────────────────────┐
│  Preprocessing              │
│  - Normalize step format    │
│  - Prepend problem topic    │
│  - Strip user PII if any    │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│  text-embedding-3-small     │
│  (OpenAI API)               │
│  Output: 1536-dim vector    │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│  pgvector Cosine Search     │
│  WHERE topic = problem.topic│
│  ORDER BY embedding <=>     │
│  LIMIT 10                   │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│  Re-ranking                 │
│  - Hint 1: highest cosine   │
│  - Hint 2: different class  │
│  - Hint 3: granular class   │
│  Take top 3                 │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│  Claude 3.5 Sonnet          │
│  - System prompt            │
│  - User prompt with         │
│    dry run + MKB context    │
│  - max_tokens: 300          │
│  - temperature: 0.3         │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│  Output Validation          │
│  - Has step reference?      │
│  - Has question mark?       │
│  - No banned words?         │
│  - No code blocks?          │
│  If fail: retry (max 2x)    │
└─────────────┬───────────────┘
              │
              ▼
       Anti-Hint Text ✓
```

---

## 4. Data Flow: Dry Run Lifecycle

```
CREATE dry_run (status: in_progress)
      │
      ├── User writes logic plan
      │      └── PATCH /dry-runs/:id  (debounced, saved to DB)
      │
      ├── User adds variable headers
      │      └── PATCH /dry-runs/:id  (headers array updated)
      │
      ├── User fills Step 1 variables
      │      └── PATCH /dry-runs/:id/steps  (upsert step 1)
      │
      ├── User commits Step 1
      │      └── POST /dry-runs/:id/lock-step { stepNumber: 1 }
      │              └── DB trigger fires, step is immutable
      │
      ├── [Repeat for steps 2..N]
      │
      ├── User clicks "Analyze My Logic"
      │      └── POST /anti-hint → task queued → polling → AntiHintCard
      │
      ├── User reads anti-hint, continues steps
      │
      └── User marks breakthrough / abandons
             └── PATCH /dry-runs/:id/status
                     └── Celery task: recompute user_stats + problem_stats
```

---

## 5. Rate Limiting Architecture

Two layers:

```
Layer 1: Per dry-run limit (3 anti-hints per attempt)
  Key: rate:antihint:attempt:{dry_run_id}
  TTL: 24 hours
  Max: 3

Layer 2: Per-day limit per user
  Key: rate:antihint:daily:{user_id}:{YYYY-MM-DD}
  TTL: 24 hours (auto-expire at midnight + buffer)
  Max: 10 (free) | unlimited (pro)
```

Both layers checked in `check_anti_hint_quota()` before Celery task is queued. If either fails, return 429 immediately.

---

## 6. Deployment Architecture

### Railway Services
```
algomortem/
├── web         # FastAPI (uvicorn, 2 workers)
├── worker      # Celery (concurrency=4)
└── beat        # Celery Beat (scheduled analytics jobs)
```

All three share the same Docker image but different `CMD`. Railway's `railway.toml`:
```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[[services]]
name = "web"
startCommand = "uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2"

[[services]]
name = "worker"
startCommand = "celery -A app.tasks.celery_app worker --loglevel=info --concurrency=4"

[[services]]
name = "beat"
startCommand = "celery -A app.tasks.celery_app beat --loglevel=info"
```

### Vercel Configuration
- Next.js App Router, auto-detected
- Edge runtime for Clerk middleware
- API routes at `/api/*` are Next.js route handlers (thin proxy to Railway backend)

---

## 7. Scalability Considerations

### Current (MVP) Bottlenecks
1. **Claude API latency:** ~2-3s per call. Mitigated by Celery async + polling UX.
2. **pgvector search at scale:** HNSW index handles ~1M rows efficiently. Beyond that, partition by topic.
3. **Celery worker count:** 4 concurrent workers = 4 simultaneous anti-hint generations. Sufficient for early growth.

### Scale-Out Path
| Scale trigger | Action |
|---|---|
| >100 concurrent users | Increase Celery concurrency to 16, add second worker dyno |
| >500k MKB docs | Partition mistake_kb by topic, separate pgvector indexes |
| >10k users | Move user_stats computation to dedicated analytics service |
| Latency >4s | Introduce pre-embedding of common dry run patterns |

---

## 8. Failure Modes + Fallbacks

| Failure | Detection | Fallback |
|---|---|---|
| Claude API timeout | Celery task timeout (30s) | Retry 2x, then return "Analysis temporarily unavailable" |
| OpenAI embeddings API down | HTTP 503 from OpenAI | Retry 3x, then fallback to keyword-based MKB search |
| Redis unavailable | Connection error | Disable rate limiting temporarily, log incident |
| pgvector search slow | Latency >1s | Fall back to full-text search on mistake_kb.tags |
| Celery worker crash | Beat heartbeat check | Railway auto-restart, task re-queued from Redis |

---

## 9. Security Architecture

```
Internet
    │
    ▼
Vercel Edge (HTTPS termination, DDoS mitigation)
    │
    ▼
Clerk (JWT issued, <15min expiry, refreshed via Clerk SDK)
    │
    ▼
FastAPI middleware (verify_clerk_token on every request)
    │
    ▼
Rate limiter (Redis, per-user quota)
    │
    ▼
Business logic (step immutability enforced at DB level via trigger)
    │
    ▼
Supabase (RLS disabled — FastAPI is the only DB client, handles own auth)
```

---

## 10. Monitoring Stack

| What | Tool | Alert condition |
|---|---|---|
| Frontend errors | Sentry | Error rate >1% |
| API errors | Sentry (FastAPI integration) | 5xx rate >0.5% |
| Anti-hint latency | Custom metric → Railway | P95 >4s |
| Celery queue depth | Redis queue length | >50 tasks pending |
| API key quota | Anthropic dashboard | >80% monthly quota |
| DB connections | Supabase metrics | >80% pool usage |
