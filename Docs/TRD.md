# AlgoMortem — Technical Requirements Document

**Version:** 1.0  
**Status:** Implementation Ready  

---

## 1. Tech Stack

### Frontend
| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR for problem pages, SEO |
| Language | TypeScript 5.x | Type safety on dry run structures |
| Styling | Tailwind CSS + CSS Variables | Dark premium theme system |
| Animation | Framer Motion | Logic canvas micro-interactions |
| State | Zustand | Dry run step state management |
| Forms | React Hook Form + Zod | Logic plan validation |
| Auth UI | Clerk | Drop-in auth |
| HTTP Client | Axios + React Query (TanStack) | API calls + caching |
| Editor | Custom contenteditable + ProseMirror-lite | Logic plan input |

### Backend
| Layer | Technology | Reason |
|---|---|---|
| Framework | FastAPI (Python 3.11) | Async, fast, Python AI ecosystem |
| Auth | Clerk JWT verification middleware | Stateless auth |
| Task Queue | Celery + Redis | Async anti-hint jobs |
| ORM | SQLAlchemy 2.0 (async) | Type-safe DB queries |
| Migrations | Alembic | Schema version control |
| Vector Store | pgvector (PostgreSQL extension) | RAG on mistake KB |
| Embeddings | text-embedding-3-small (OpenAI) | Cost-efficient, 1536-dim |
| LLM | Claude 3.5 Sonnet (Anthropic) | Anti-hint generation |
| Cache | Redis (Upstash) | Rate limiting + session cache |
| File Storage | Cloudflare R2 | Problem assets if needed |

### Infrastructure
| Layer | Technology |
|---|---|
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |
| Database | Supabase PostgreSQL (with pgvector) |
| Redis | Upstash |
| Monitoring | Sentry (frontend + backend) |
| CI/CD | GitHub Actions |
| Secrets | Railway + Vercel env vars |

---

## 2. RAG Architecture (Core Technical Component)

### 2.1 Mistake Knowledge Base (MKB)
The MKB is a curated vector store of DSA mistake patterns. It is the foundation of the Anti-Hint Engine.

**MKB Document Structure:**
```json
{
  "id": "mkb_001",
  "problem_topic": "two_pointers",
  "mistake_class": "boundary_condition",
  "step_descriptor": "pointer_movement",
  "mistake_description": "User moves both pointers simultaneously without checking convergence condition first",
  "divergence_signal": "When left pointer crosses right pointer in dry run without user catching it",
  "anti_hint_template": "Look at step {N}. What happens to your pointers when the inner condition is false?",
  "severity": "high",
  "tags": ["two_pointers", "convergence", "loop_invariant"],
  "embedding": [0.023, -0.041, ...]  // 1536-dim vector
}
```

**MKB Population:**
- 500+ mistake patterns at launch
- Authored manually by DSA experts + semi-automated from LeetCode discuss sections
- Each pattern reviewed for: is this a logic mistake (not syntax)? Does the anti-hint template avoid solution-giving?

### 2.2 RAG Pipeline
```
User Dry Run (text) 
  → Preprocessing (normalize step descriptions)
  → Embed dry run using text-embedding-3-small
  → Cosine similarity search in pgvector (top-k=10)
  → Re-rank by: topic match, step_descriptor overlap, mistake class priority
  → Top 3 MKB documents passed to Claude as context
  → Claude generates anti-hint constrained by strict system prompt
  → Anti-hint returned to frontend
```

### 2.3 Embedding Strategy
- Each dry run is embedded as a **concatenation of all steps** with step numbers preserved
- Example: `"Step 1: left=0, right=5, sum=arr[0]+arr[5]=7. Step 2: sum<target so left++. left=1..."`
- Topic of the problem is prepended to improve retrieval relevance
- Embedding stored for later analytics (which dry runs triggered which mistake patterns)

### 2.4 Anti-Hint Generation Prompt Architecture
See `AI_INSTRUCTIONS.md` for full prompt specifications.

**Key constraints enforced at prompt level:**
- Output must contain exactly one question mark
- Output must reference "Step [number]" at least once
- Output must not contain code blocks (enforced via output_format instructions)
- Max 3 sentences

---

## 3. Dry Run Data Model

### 3.1 Step Schema
```typescript
interface DryRunStep {
  stepNumber: number;
  variables: Record<string, string | number | boolean | null>;
  userNote?: string;      // optional reasoning
  isLocked: boolean;      // once true, immutable
  timestamp: number;      // when step was committed
}

interface DryRun {
  id: string;
  problemId: string;
  userId: string;
  variableHeaders: string[];   // user-defined columns
  steps: DryRunStep[];
  logicPlan: string;           // markdown-lite text
  antiHintsUsed: number;       // 0-3
  antiHints: AntiHint[];
  status: 'in_progress' | 'abandoned' | 'breakthrough';
  startedAt: Date;
  completedAt?: Date;
}
```

### 3.2 Step Immutability Enforcement
- Frontend: locked steps render in `readonly` mode, no edit events bound
- Backend: PATCH /dry-runs/:id/steps/:stepNumber returns 403 if `isLocked=true`
- Steps are locked when user clicks "Commit Step" button
- No admin override except for support edge cases (soft delete + recreate)

---

## 4. API Design

### 4.1 Base URL
```
https://api.algomortem.dev/v1
```

### 4.2 Endpoints

#### Auth (Clerk-managed, JWT passed via Authorization header)
```
POST   /auth/sync              # Sync Clerk user to our DB on first login
```

#### Problems
```
GET    /problems               # List problems (paginated, filterable)
GET    /problems/:slug         # Get single problem
GET    /problems/topics        # Get all topic tags
```

#### Dry Runs
```
POST   /dry-runs               # Create new dry run attempt
GET    /dry-runs/:id           # Get dry run by ID
PATCH  /dry-runs/:id/steps     # Add/update steps (locked steps return 403)
POST   /dry-runs/:id/lock-step # Lock a specific step
PATCH  /dry-runs/:id/status    # Update status (breakthrough/abandoned)
GET    /users/:userId/dry-runs # Get user's attempt history
```

#### Anti-Hint Engine
```
POST   /anti-hint              # Trigger anti-hint analysis
  Body: { dryRunId: string, problemId: string }
  Returns: { hint: string, stepReference: number, hintNumber: 1|2|3 }
  Rate limit: 3 per dry run, 10 per day (enforced via Redis)
```

#### Analytics
```
GET    /users/:userId/stats    # Attempt stats, breakthrough rate, topic breakdown
GET    /problems/:id/stats     # Crowd step-failure data (anonymized)
```

### 4.3 Error Codes
```
400 - Bad request (missing fields)
401 - Unauthenticated
403 - Forbidden (locked step edit, rate limit exceeded)
404 - Resource not found
429 - Rate limited (anti-hint quota)
503 - Anti-hint engine unavailable (graceful degradation)
```

---

## 5. Security Requirements

| Requirement | Implementation |
|---|---|
| Auth on all /v1 routes except /problems GET | Clerk JWT middleware |
| Step immutability | Backend enforced, not just frontend |
| Anti-hint rate limiting | Redis counter per userId+dryRunId and userId+date |
| No LLM output caching across users | Unique anti-hint per attempt (no shared cache) |
| Prompt injection prevention | Dry run text sanitized before embedding |
| CORS | Whitelist Vercel domain only |
| API key security | All secrets in Railway env, never in code |

---

## 6. Performance Requirements

| Operation | Target P95 Latency |
|---|---|
| Problem list load | <500ms |
| Dry run step commit | <200ms |
| Anti-hint generation | <4000ms |
| User stats load | <800ms |

### Optimization Strategy
- Anti-hint: Celery task with polling (frontend polls every 500ms, max 10s)
- Problem list: Redis cache with 5min TTL
- User stats: Precomputed on attempt completion, stored in `user_stats` table
- pgvector index: HNSW index on embeddings for fast ANN search

---

## 7. Monitoring & Observability

- **Sentry:** Frontend error tracking + FastAPI exception capture
- **Railway Metrics:** CPU, memory, request count per service
- **Custom Events tracked:**
  - anti_hint_triggered (with problem_id, hint_number)
  - step_locked (with step_number)
  - breakthrough_marked
  - attempt_abandoned
  - rate_limit_hit

---

## 8. Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql+asyncpg://...
REDIS_URL=redis://...
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...   # for embeddings only
CLERK_SECRET_KEY=sk_...
CLERK_PUBLISHABLE_KEY=pk_...
ENVIRONMENT=production
SENTRY_DSN=https://...
```

### Frontend (.env.local)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_API_URL=https://api.algomortem.dev/v1
NEXT_PUBLIC_SENTRY_DSN=https://...
```
