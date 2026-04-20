# Code Structure (Frontend)

## 1. Design System
- **Theme**: Dark Mode (Industrial/Sleek).
- **Colors**: 
  - Primary: `#00F5FF` (Neon Cyan)
  - Background: `#0A0A0B` (Deep Black)
  - Accent: `#FF2E63` (Warning Pink)
- **Icons**: Lucide React.
- **Components**: Radix UI + Tailwind.

## 2. Component Breakdown
- `LogicCanvas`: The main grid engine. Handles cell focus, variable synchronization, and row addition.
- `AntiHintZone`: A side panel that displays the stream of AI feedback. Uses a \"terminal console\" aesthetic.
- `LogicPlanEditor`: A markdown-capable editor for the user to commit their algorithm plan.
- `ProblemStatement`: Collapsible panel showing the problem.

## 3. State Management (Zustand)
```typescript
interface DryRunStore {
  steps: Step[];
  variables: string[];
  addStep: (step: Step) => void;
  updateVariable: (name: string, value: any) => void;
  // ...
}
```
Why Zustand? Simple, fast, and great for the highly interactive variable grid where many components need to react to a single cell change.
