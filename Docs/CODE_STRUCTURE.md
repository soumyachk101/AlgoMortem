# AlgoMortem — Code Structure

**Version:** 1.0  
**Framework:** Next.js 14 (App Router) + FastAPI  

---

## 1. Frontend Structure

```
frontend/
├── app/
│   ├── layout.tsx                    # Root layout: fonts, ClerkProvider, Sentry
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # CSS variables, base styles, animations
│   │
│   ├── (auth)/
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   │
│   ├── problems/
│   │   ├── page.tsx                  # Problem library grid
│   │   └── [slug]/
│   │       └── page.tsx              # Problem workspace
│   │
│   ├── dashboard/
│   │   └── page.tsx                  # User stats + attempt history
│   │
│   └── attempt/
│       └── [dryRunId]/
│           └── page.tsx              # View previous attempt (frozen)
│
├── components/
│   ├── ui/                           # Base primitives
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Spinner.tsx
│   │   └── Tooltip.tsx
│   │
│   ├── canvas/                       # Logic Canvas components
│   │   ├── LogicCanvas.tsx           # Main split-panel wrapper
│   │   ├── LogicPlanEditor.tsx       # Freeform text editor
│   │   ├── DryRunTable.tsx           # Spreadsheet-like step table
│   │   ├── DryRunRow.tsx             # Single step row
│   │   ├── VariableCell.tsx          # Individual variable input
│   │   ├── StepCommitButton.tsx      # Lock step button
│   │   ├── VariableHeaderManager.tsx # Add/remove variable columns
│   │   └── AnalyzeButton.tsx         # Trigger anti-hint, handles rate limits
│   │
│   ├── anti-hint/
│   │   ├── AntiHintCard.tsx          # The revelation card
│   │   ├── AntiHintZone.tsx          # Container, handles polling
│   │   ├── HintCounter.tsx           # 1/3, 2/3, 3/3 indicator
│   │   └── HintRating.tsx            # 1-5 star rating widget
│   │
│   ├── problems/
│   │   ├── ProblemCard.tsx           # Library grid card
│   │   ├── ProblemGrid.tsx           # Grid with filters
│   │   ├── ProblemFilters.tsx        # Topic chips + difficulty tabs
│   │   ├── ProblemStatement.tsx      # Statement panel (collapsible)
│   │   └── DifficultyBadge.tsx
│   │
│   ├── dashboard/
│   │   ├── AttemptHistory.tsx
│   │   ├── AttemptRow.tsx
│   │   ├── TopicBreakdown.tsx        # Radar chart via recharts
│   │   ├── ActivityHeatmap.tsx       # GitHub-style heatmap
│   │   └── StatsCards.tsx
│   │
│   └── layout/
│       ├── Navbar.tsx
│       ├── WorkspaceHeader.tsx       # Minimal problem workspace header
│       └── Footer.tsx
│
├── hooks/
│   ├── useDryRun.ts                  # All dry run state management
│   ├── useAntiHint.ts                # Anti-hint trigger + polling logic
│   ├── useRateLimit.ts               # Local rate limit state
│   ├── useProblems.ts                # Problem list fetching
│   └── useUserStats.ts              
│
├── stores/
│   └── dryRunStore.ts                # Zustand store for canvas state
│
├── lib/
│   ├── api.ts                        # Axios instance + interceptors
│   ├── queries.ts                    # TanStack Query query functions
│   ├── utils.ts                      # cn(), formatDate(), etc.
│   └── constants.ts                  # Topics list, difficulty labels, etc.
│
├── types/
│   ├── problem.ts
│   ├── dryRun.ts
│   └── antiHint.ts
│
└── public/
    └── fonts/                        # Self-hosted fonts if needed
```

---

## 2. Zustand Store: Dry Run

```typescript
// stores/dryRunStore.ts
interface DryRunState {
  // Identity
  dryRunId: string | null;
  problemId: string | null;
  
  // Canvas state
  logicPlan: string;
  variableHeaders: string[];
  steps: DryRunStep[];
  
  // Anti-hint state
  antiHintsUsed: number;
  antiHints: AntiHint[];
  pendingHintTaskId: string | null;
  
  // UI state
  isAnalyzing: boolean;
  isComplete: boolean;
  
  // Actions
  setLogicPlan: (text: string) => void;
  addVariableHeader: (name: string) => void;
  removeVariableHeader: (name: string) => void;
  addStep: () => void;
  updateStepVariable: (stepNumber: number, varName: string, value: string) => void;
  updateStepNote: (stepNumber: number, note: string) => void;
  lockStep: (stepNumber: number) => void;
  addAntiHint: (hint: AntiHint) => void;
  setAnalyzing: (state: boolean) => void;
  markBreakthrough: () => void;
  reset: () => void;
}
```

---

## 3. Key Hooks

### useDryRun
```typescript
// hooks/useDryRun.ts
export function useDryRun(problemId: string) {
  const store = useDryRunStore();
  
  // Initialize or resume a dry run
  const { data: existingDryRun } = useQuery({...});
  
  // Step management
  const commitStep = async (stepNumber: number) => {
    store.lockStep(stepNumber);
    await api.post(`/dry-runs/${store.dryRunId}/lock-step`, { stepNumber });
  };
  
  // Persist logic plan (debounced 1s)
  const debouncedSave = useDebouncedCallback(
    (plan: string) => api.patch(`/dry-runs/${store.dryRunId}`, { logicPlan: plan }),
    1000
  );
  
  return { commitStep, debouncedSave, ...store };
}
```

### useAntiHint
```typescript
// hooks/useAntiHint.ts
export function useAntiHint(dryRunId: string) {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  
  const trigger = async () => {
    const { data } = await api.post('/anti-hint', { dryRunId });
    setTaskId(data.taskId);
    setIsPolling(true);
  };
  
  // Poll every 500ms for result
  useInterval(async () => {
    if (!taskId || !isPolling) return;
    const { data } = await api.get(`/anti-hint/status/${taskId}`);
    if (data.status === 'done') {
      setIsPolling(false);
      store.addAntiHint(data.result);
    }
  }, isPolling ? 500 : null);
  
  return { trigger, isLoading: isPolling };
}
```

---

## 4. DryRunTable Component

```typescript
// components/canvas/DryRunTable.tsx
export function DryRunTable() {
  const { steps, variableHeaders, lockStep } = useDryRunStore();
  
  return (
    <div className="dry-run-table">
      {/* Header row */}
      <div className="table-header">
        <span className="step-col">STEP</span>
        {variableHeaders.map(h => (
          <span key={h} className="var-col">{h.toUpperCase()}</span>
        ))}
        <span className="note-col">NOTE</span>
        <span className="action-col"></span>
      </div>
      
      {/* Step rows */}
      {steps.map(step => (
        <DryRunRow
          key={step.stepNumber}
          step={step}
          headers={variableHeaders}
          onCommit={() => lockStep(step.stepNumber)}
        />
      ))}
      
      {/* Add step */}
      <AddStepRow />
    </div>
  );
}
```

---

## 5. AntiHintCard Animation

```typescript
// components/anti-hint/AntiHintCard.tsx
import { motion } from 'framer-motion';

export function AntiHintCard({ hint }: { hint: AntiHint }) {
  const [displayedText, setDisplayedText] = useState('');
  
  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < hint.text.length) {
        setDisplayedText(hint.text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 28); // 28ms per character
    return () => clearInterval(interval);
  }, [hint.text]);
  
  return (
    <motion.div
      className="anti-hint-card"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="hint-header">
        <span className="fracture-label">◈ LOGIC FRACTURE</span>
        <span className="hint-number">HINT {hint.hintNumber}/3</span>
      </div>
      
      <p className="hint-text">{displayedText}</p>
      
      <div className="hint-footer">
        <StepReferenceBadge step={hint.stepReference} />
        <HintRating hintId={hint.id} />
      </div>
      
      {/* Animated left border */}
      <motion.div
        className="left-border"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        style={{ transformOrigin: 'top' }}
      />
    </motion.div>
  );
}
```

---

## 6. API Client

```typescript
// lib/api.ts
import axios from 'axios';
import { auth } from '@clerk/nextjs';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth header on every request
api.interceptors.request.use(async (config) => {
  const { getToken } = auth();
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 429 rate limit
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 429) {
      // Surface rate limit in UI via Zustand
      useGlobalStore.getState().setRateLimitError(err.response.data.detail);
    }
    return Promise.reject(err);
  }
);
```

---

## 7. Environment Config

```typescript
// lib/constants.ts
export const TOPICS = [
  'arrays', 'strings', 'linked-lists', 'trees', 
  'graphs', 'dynamic-programming', 'backtracking', 'two-pointers',
  'sliding-window', 'binary-search', 'heaps', 'tries'
] as const;

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

export const MAX_ANTI_HINTS_PER_ATTEMPT = 3;
export const MAX_STEPS = 30;
export const MAX_VARIABLES = 10;

export const ANTI_HINT_POLL_INTERVAL_MS = 500;
export const ANTI_HINT_POLL_TIMEOUT_MS = 10000;
```

---

## 8. Route Protection

All routes except landing and problem library are protected via Clerk middleware:

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/problems',
  '/problems/(.*)',  // problems are publicly viewable but canvas requires auth
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();
});
```

The problem workspace (`/problems/[slug]`) is technically public but the Logic Canvas checks auth before allowing dry run creation.
