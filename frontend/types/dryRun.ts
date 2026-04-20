export interface DryRunStep {
  stepNumber: number;
  variables: Record<string, string>;
  note: string;
  locked: boolean;
}

export interface DryRun {
  id: string;
  problemId: string;
  userId: string;
  logicPlan: string;
  variableHeaders: string[];
  steps: DryRunStep[];
  antiHintsUsed: number;
  isComplete: boolean;
  breakthroughAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AttemptHistoryItem {
  id: string;
  problemId: string;
  problemTitle: string;
  problemSlug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  antiHintsUsed: number;
  isComplete: boolean;
  breakthroughAt: string | null;
  stepIdentified: number | null;
  createdAt: string;
}
