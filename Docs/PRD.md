# AlgoMortem — Product Requirements Document

**Version:** 1.0  
**Product Name:** AlgoMortem  
**Tagline:** *"We don't fix your code. We dissect your thinking."*  
**Target Release:** MVP in 6 weeks  

---

## 1. Product Vision

AlgoMortem is a DSA learning platform with a single, radical constraint: **it never gives you the answer.** Instead, it watches you dry-run a problem step-by-step, uses RAG over a curated mistake knowledge base, and tells you *exactly which step* your logic broke — then asks you a pointed Socratic question to force self-correction.

The product is built for the person who is tired of LeetCode editorial copy-paste culture. They want to actually think.

---

## 2. Problem Statement

Every DSA learner faces this: you're stuck on a problem, you ask an AI, and the AI either gives you the full solution or a vague "think about edge cases." Neither is useful. The first robs you of the learning. The second is noise.

What's missing is a **logic debugger** — something that can read your dry run trace, identify where your mental model diverged from correct algorithm behavior, and confront you with the specific contradiction. Not the solution. The contradiction.

---

## 3. Target Users

### Primary: The Grinding Developer
- 2nd/3rd year CS student or working dev preparing for FAANG/product interviews
- Has done 50–150 LeetCode problems, hits a ceiling, can't figure out *why* they fail
- Frustrated with editorial-first culture
- Values understanding over completion

### Secondary: The DSA Instructor
- College professors or bootcamp instructors
- Want to assign problems where AI assistance is controlled
- Need insight into where students' logic actually breaks

---

## 4. Core Feature: Anti-Hint System

### 4.1 What It Is
The Anti-Hint System is the entire product. When a user attempts a problem:

1. User reads the problem statement
2. User writes their **logic plan** (not code) — natural language or pseudocode
3. User performs a **dry run** on a test case — step by step, writing what variables hold at each step
4. AlgoMortem's AI analyzes the dry run using RAG over a mistake knowledge base
5. AI outputs: **"Your logic breaks at Step N because [Socratic observation]"**
6. AI never writes corrected pseudocode, never suggests the algorithm, never gives hints that collapse the solution space

### 4.2 What It Is NOT
- Not a code editor
- Not a code reviewer
- Not a hint system that walks you toward the answer
- Not a solution generator

### 4.3 Anti-Hint Quality Bar
Every anti-hint must:
- Reference a specific step number from the user's dry run
- Contain a question, not a statement
- Not use the words: solve, answer, correct, try, algorithm, pattern
- Leave at least 3 possible interpretations of what the user might need to fix

---

## 5. Feature Set

### MVP Features (Phase 1)

#### F1 — Problem Library
- 200+ handpicked problems across Easy/Medium/Hard
- Each problem tagged with: topic (array, tree, graph, DP, etc.), common mistake patterns, canonical dry run structure
- Problems sourced from LeetCode-style format but hosted internally
- No hints or editorials visible ever

#### F2 — Logic Canvas
- Freeform text area for logic plan (supports markdown-lite formatting)
- Structured dry run table: columns are user-defined variables, rows are steps
- User fills in variable values at each step manually
- Step counter visible on left gutter
- "Lock step" functionality — once a step is submitted, it cannot be edited (enforces honesty)

#### F3 — Anti-Hint Engine
- Triggered when user clicks "Analyze My Logic"
- Runs RAG over AlgoMortem Mistake KB using user's dry run as query
- Returns a single anti-hint: step reference + Socratic question
- User can request a maximum of 3 anti-hints per problem attempt
- Each subsequent anti-hint must zoom in (more specific), not out

#### F4 — Attempt History
- Every attempt is stored: logic plan, dry run, anti-hints received, time taken
- User can compare across attempts to see progression
- No score — only attempt count and "breakthrough" flag when user self-reports understanding

#### F5 — Problem Tags + Filters
- Filter by topic, difficulty, "most failed at step 3" (crowd data)
- Tag-based discovery

#### F6 — Auth + Profiles
- Clerk auth (email + Google)
- Profile shows attempt heatmap, topic breakdown, breakthrough rate

### Phase 2 Features
- **Collaborative Mode:** Two users dry-run the same problem; AI compares their logic plans
- **Instructor Dashboard:** Assign problems, see class-wide step-failure heatmaps
- **Voice Dry Run:** User talks through their logic; AI transcribes and analyzes
- **Mistake Pattern Report:** Weekly PDF of your recurring logical errors

---

## 6. Anti-Features (Explicit Non-Goals)

These will never be in the product:
- Code execution / sandbox
- Solution reveal button
- "I give up" button
- Step-by-step guided hints
- Any LLM output that contains a code snippet
- Leaderboards or competitive elements

---

## 7. User Flows

### Flow 1: First Problem Attempt
```
Landing → Sign Up → Onboarding (2 screens) → Problem Library 
→ Select Problem → Read Problem → Write Logic Plan 
→ Set Up Dry Run Variables → Fill Dry Run Steps 
→ "Analyze My Logic" → View Anti-Hint 
→ Continue Dry Run / Revise Logic → Repeat (max 3 anti-hints)
→ Mark as "Got It" (self-report) or Abandon
```

### Flow 2: Returning to a Problem
```
Dashboard → Attempt History → Select Previous Attempt 
→ View Frozen Dry Run → Start New Attempt (fresh canvas)
```

---

## 8. Success Metrics

| Metric | MVP Target | 6-Month Target |
|---|---|---|
| Breakthrough Rate (self-reported) | >40% of attempts | >55% |
| Anti-hint relevance (user rating) | >70% "helped" | >80% |
| Problems attempted per session | 1.5 | 2.5 |
| D7 retention | 25% | 40% |
| Average anti-hints used per attempt | <2 (shows engagement) | <2.5 |

---

## 9. Constraints

- **No code generation:** Under any circumstance. This is a legal+product constraint.
- **Anti-hint latency:** Must be <4 seconds. Users are in flow state.
- **Dry run immutability:** Locked steps cannot be changed. Backend must enforce this.
- **Rate limiting on AI:** 3 anti-hints per problem attempt, 10 per day on free tier.

---

## 10. Monetization

| Tier | Price | Limits |
|---|---|---|
| Free | $0 | 5 problems/week, 2 anti-hints/attempt |
| Pro | $12/month | Unlimited problems, 3 anti-hints/attempt, attempt history |
| Team (Instructor) | $49/month per cohort | Instructor dashboard, class analytics |
