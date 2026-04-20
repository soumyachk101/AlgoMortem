# AlgoMortem — Database Schema

**Version:** 1.0  
**Database:** PostgreSQL 15 via Supabase  
**Extensions Required:** `pgvector`, `uuid-ossp`  

---

## 1. Setup

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
```

---

## 2. Tables

### 2.1 users
```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id        VARCHAR(255) UNIQUE NOT NULL,
    email           VARCHAR(255) NOT NULL,
    username        VARCHAR(100),
    tier            VARCHAR(20) NOT NULL DEFAULT 'free',   -- 'free' | 'pro' | 'team'
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_clerk_id ON users(clerk_id);
```

---

### 2.2 problems
```sql
CREATE TABLE problems (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug                    VARCHAR(255) UNIQUE NOT NULL,
    title                   VARCHAR(500) NOT NULL,
    difficulty              VARCHAR(10) NOT NULL,   -- 'easy' | 'medium' | 'hard'
    topic                   VARCHAR(100) NOT NULL,  -- 'arrays' | 'trees' | 'graphs' | 'dp' | ...
    statement               TEXT NOT NULL,
    examples                JSONB NOT NULL DEFAULT '[]',
    constraints_text        TEXT,
    common_mistake_tags     TEXT[] NOT NULL DEFAULT '{}',
    canonical_var_headers   TEXT[] NOT NULL DEFAULT '{}',
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_problems_topic ON problems(topic);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_slug ON problems(slug);
```

---

### 2.3 dry_runs
```sql
CREATE TABLE dry_runs (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id          UUID NOT NULL REFERENCES problems(id),
    logic_plan          TEXT,                           -- freeform logic plan text
    variable_headers    TEXT[] NOT NULL DEFAULT '{}',  -- user-defined column names
    anti_hints_used     SMALLINT NOT NULL DEFAULT 0,   -- 0-3
    status              VARCHAR(20) NOT NULL DEFAULT 'in_progress',
                        -- 'in_progress' | 'abandoned' | 'breakthrough'
    started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at        TIMESTAMPTZ,
    embedding           VECTOR(1536),                  -- embedding of full dry run text for analytics
    CONSTRAINT chk_anti_hints CHECK (anti_hints_used <= 3)
);

CREATE INDEX idx_dry_runs_user_id ON dry_runs(user_id);
CREATE INDEX idx_dry_runs_problem_id ON dry_runs(problem_id);
CREATE INDEX idx_dry_runs_status ON dry_runs(status);
```

---

### 2.4 dry_run_steps
```sql
CREATE TABLE dry_run_steps (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dry_run_id      UUID NOT NULL REFERENCES dry_runs(id) ON DELETE CASCADE,
    step_number     SMALLINT NOT NULL,
    variables       JSONB NOT NULL DEFAULT '{}',   -- { "left": 0, "right": 5, "sum": 7 }
    user_note       TEXT,
    is_locked       BOOLEAN NOT NULL DEFAULT FALSE,
    committed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(dry_run_id, step_number)
);

CREATE INDEX idx_dry_run_steps_dry_run_id ON dry_run_steps(dry_run_id);
```

---

### 2.5 anti_hints
```sql
CREATE TABLE anti_hints (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dry_run_id          UUID NOT NULL REFERENCES dry_runs(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id),
    problem_id          UUID NOT NULL REFERENCES problems(id),
    hint_number         SMALLINT NOT NULL,          -- 1, 2, or 3
    hint_text           TEXT NOT NULL,              -- the actual anti-hint
    step_reference      SMALLINT NOT NULL,          -- which step it refers to
    mkb_doc_ids         TEXT[] NOT NULL DEFAULT '{}',  -- which MKB docs were retrieved
    similarity_scores   FLOAT[] NOT NULL DEFAULT '{}', -- for analytics
    latency_ms          INTEGER,                    -- how long generation took
    user_rating         SMALLINT,                   -- 1 (not helpful) to 5 (very helpful), nullable
    generated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(dry_run_id, hint_number)
);

CREATE INDEX idx_anti_hints_dry_run_id ON anti_hints(dry_run_id);
CREATE INDEX idx_anti_hints_user_id ON anti_hints(user_id);
```

---

### 2.6 mistake_kb (Vector Store)
```sql
CREATE TABLE mistake_kb (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_topic           VARCHAR(100) NOT NULL,
    mistake_class           VARCHAR(100) NOT NULL,
    -- Classes: 'boundary_condition' | 'loop_invariant' | 'pointer_movement'
    --          | 'base_case' | 'recurrence_relation' | 'index_calculation'
    --          | 'termination_condition' | 'state_initialization'
    step_descriptor         VARCHAR(100) NOT NULL,
    mistake_description     TEXT NOT NULL,
    divergence_signal       TEXT NOT NULL,          -- what to look for in dry run
    anti_hint_template      TEXT NOT NULL,          -- template with {N} placeholder
    severity                VARCHAR(10) NOT NULL DEFAULT 'medium',
    tags                    TEXT[] NOT NULL DEFAULT '{}',
    embedding               VECTOR(1536) NOT NULL,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HNSW index for fast approximate nearest neighbor search
CREATE INDEX idx_mkb_embedding_hnsw 
    ON mistake_kb 
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_mkb_topic ON mistake_kb(problem_topic);
CREATE INDEX idx_mkb_mistake_class ON mistake_kb(mistake_class);
```

---

### 2.7 user_stats (Denormalized for Performance)
```sql
CREATE TABLE user_stats (
    user_id                 UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_attempts          INTEGER NOT NULL DEFAULT 0,
    breakthrough_count      INTEGER NOT NULL DEFAULT 0,
    abandoned_count         INTEGER NOT NULL DEFAULT 0,
    total_anti_hints_used   INTEGER NOT NULL DEFAULT 0,
    topic_breakdown         JSONB NOT NULL DEFAULT '{}',
    -- { "arrays": { "attempts": 10, "breakthroughs": 4 }, ... }
    avg_steps_per_attempt   FLOAT,
    streak_days             INTEGER NOT NULL DEFAULT 0,
    last_active             TIMESTAMPTZ,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 2.8 problem_stats (Crowd Analytics)
```sql
CREATE TABLE problem_stats (
    problem_id              UUID PRIMARY KEY REFERENCES problems(id) ON DELETE CASCADE,
    total_attempts          INTEGER NOT NULL DEFAULT 0,
    breakthrough_rate       FLOAT,
    avg_anti_hints_needed   FLOAT,
    step_failure_heatmap    JSONB NOT NULL DEFAULT '{}',
    -- { "1": 12, "2": 45, "3": 78 } — how many users got anti-hint referencing this step
    most_common_mistake     VARCHAR(100),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. Key Relationships

```
users
  └── dry_runs (1:many)
       ├── dry_run_steps (1:many)
       └── anti_hints (1:many, max 3)

problems
  ├── dry_runs (1:many)
  ├── anti_hints (1:many)
  └── problem_stats (1:1)

users
  └── user_stats (1:1)

mistake_kb (standalone, queried via vector similarity)
  └── referenced in anti_hints.mkb_doc_ids
```

---

## 4. Step Immutability Trigger

```sql
-- Prevent updates to locked steps at DB level
CREATE OR REPLACE FUNCTION prevent_locked_step_update()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.is_locked = TRUE THEN
        RAISE EXCEPTION 'Cannot modify a locked dry run step';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_locked_step_update
    BEFORE UPDATE ON dry_run_steps
    FOR EACH ROW
    EXECUTE FUNCTION prevent_locked_step_update();
```

---

## 5. Useful Queries

### Get full dry run with steps
```sql
SELECT 
    dr.*,
    json_agg(
        drs ORDER BY drs.step_number
    ) as steps,
    json_agg(ah ORDER BY ah.hint_number) as anti_hints
FROM dry_runs dr
LEFT JOIN dry_run_steps drs ON drs.dry_run_id = dr.id
LEFT JOIN anti_hints ah ON ah.dry_run_id = dr.id
WHERE dr.id = $1
GROUP BY dr.id;
```

### Vector similarity search (RAG)
```sql
SELECT 
    id, problem_topic, mistake_class, step_descriptor,
    mistake_description, divergence_signal, anti_hint_template, tags,
    1 - (embedding <=> $1::vector) AS similarity
FROM mistake_kb
WHERE is_active = TRUE
  AND problem_topic = $2
ORDER BY embedding <=> $1::vector
LIMIT 10;
```

### Step failure heatmap across all users
```sql
SELECT 
    ah.step_reference,
    COUNT(*) as failure_count
FROM anti_hints ah
WHERE ah.problem_id = $1
GROUP BY ah.step_reference
ORDER BY failure_count DESC;
```

---

## 6. Migrations

Run via Alembic:
```bash
alembic upgrade head        # apply all migrations
alembic revision --autogenerate -m "description"  # create new migration
alembic downgrade -1        # rollback one step
```
