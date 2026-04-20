# Technical Requirements Document (TRD)

## 1. Performance
- **TBT (Total Blocking Time)**: < 100ms for cell updates.
- **AI Response Latency**: < 1.5s for step feedback.

## 2. Scalability
- Concurrent sessions handled by FastAPI's async workers.
- Stateless AI processing.

## 3. Security
- JWT-based authentication.
- Rate limiting on AI endpoints (prevent token abuse).
- Database row-level security to ensure users only see their own dry-runs.

## 4. Accessibility
- Full keyboard navigation for the `LogicCanvas` grid (Tabs, Arrows).
- Screen reader support for Anti-Hints.
