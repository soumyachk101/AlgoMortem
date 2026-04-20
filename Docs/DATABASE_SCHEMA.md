# AlgoMortem Database Schema

## 1. Users
- `id` (UUID, PK)
- `email` (String, Unique)
- `username` (String, Unique)
- `password_hash` (String)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- `streak_count` (Integer)
- `total_problems_solved` (Integer)

## 2. Problems
- `id` (UUID, PK)
- `slug` (String, Unique) - e.g., 'two-sum'
- `title` (String)
- `difficulty` (Enum: EASY, MEDIUM, HARD)
- `topics` (List<Enum>: ARRAYS, STRINGS, etc.)
- `statement` (Text) - Markdown problem description
- `example_input` (Text)
- `example_output` (Text)
- `constraints` (List<String>)
- `common_mistake_patterns` (JSONB) - Hints for AI to look for

## 3. DryRuns (The Core Session)
- `id` (UUID, PK)
- `problem_id` (FK -> Problems.id)
- `user_id` (FK -> Users.id)
- `logic_plan` (Text) - The user's initial description of their approach
- `variable_headers` (List<String>) - Columns defined by the user (e.g., 'i', 'j', 'sum')
- `is_complete` (Boolean)
- `breakthrough_at` (Timestamp, Nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## 4. DryRunSteps
- `id` (UUID, PK)
- `dry_run_id` (FK -> DryRuns.id)
- `step_number` (Integer)
- `variables` (JSONB) - Store values e.g., `{\"i\": 0, \"j\": 5, \"sum\": 10}`
- `user_note` (Text, Nullable)
- `ai_feedback_id` (FK -> AntiHints.id, Nullable)
- `created_at` (Timestamp)

## 5. AntiHints (AI Feedback)
- `id` (UUID, PK)
- `dry_run_id` (FK -> DryRuns.id)
- `hint_number` (Integer)
- `text` (Text)
- `step_reference` (Integer) - Which step triggered this?
- `rating` (Integer, Nullable) - User feedback on hint quality (1-5)
- `created_at` (Timestamp)

## 6. UserProgress
- `user_id` (FK -> Users.id)
- `topic` (Enum)
- `proficiency_score` (Float)
- `last_attempt_at` (Timestamp)
