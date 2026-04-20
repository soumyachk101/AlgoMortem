import { create } from 'zustand';
import type { DryRunStep } from '@/types/dryRun';
import type { AntiHint } from '@/types/antiHint';
import { MAX_VARIABLES, MAX_STEPS } from '@/lib/constants';

interface DryRunState {
  dryRunId: string | null;
  problemId: string | null;
  logicPlan: string;
  variableHeaders: string[];
  steps: DryRunStep[];
  antiHintsUsed: number;
  antiHints: AntiHint[];
  pendingHintTaskId: string | null;
  isAnalyzing: boolean;
  isComplete: boolean;
  isReadOnly: boolean;

  setDryRunId: (id: string) => void;
  setProblemId: (id: string) => void;
  setLogicPlan: (text: string) => void;
  addVariableHeader: (name: string) => void;
  removeVariableHeader: (name: string) => void;
  addStep: () => void;
  updateStepVariable: (stepNumber: number, varName: string, value: string) => void;
  updateStepNote: (stepNumber: number, note: string) => void;
  lockStep: (stepNumber: number) => void;
  addAntiHint: (hint: AntiHint) => void;
  setPendingHintTaskId: (id: string | null) => void;
  setAnalyzing: (state: boolean) => void;
  markBreakthrough: () => void;
  setReadOnly: (val: boolean) => void;
  hydrate: (data: Partial<DryRunState>) => void;
  reset: () => void;
}

const initialState = {
  dryRunId: null,
  problemId: null,
  logicPlan: '',
  variableHeaders: [],
  steps: [],
  antiHintsUsed: 0,
  antiHints: [],
  pendingHintTaskId: null,
  isAnalyzing: false,
  isComplete: false,
  isReadOnly: false,
};

export const useDryRunStore = create<DryRunState>((set) => ({
  ...initialState,

  setDryRunId: (id) => set({ dryRunId: id }),
  setProblemId: (id) => set({ problemId: id }),
  setLogicPlan: (text) => set({ logicPlan: text }),

  addVariableHeader: (name) =>
    set((s) => {
      if (s.variableHeaders.length >= MAX_VARIABLES) return s;
      if (s.variableHeaders.includes(name)) return s;
      return { variableHeaders: [...s.variableHeaders, name] };
    }),

  removeVariableHeader: (name) =>
    set((s) => ({
      variableHeaders: s.variableHeaders.filter((h) => h !== name),
      steps: s.steps.map((step) => {
        const vars = { ...step.variables };
        delete vars[name];
        return { ...step, variables: vars };
      }),
    })),

  addStep: () =>
    set((s) => {
      if (s.steps.length >= MAX_STEPS) return s;
      const newStep: DryRunStep = {
        stepNumber: s.steps.length + 1,
        variables: Object.fromEntries(s.variableHeaders.map((h) => [h, ''])),
        note: '',
        locked: false,
      };
      return { steps: [...s.steps, newStep] };
    }),

  updateStepVariable: (stepNumber, varName, value) =>
    set((s) => ({
      steps: s.steps.map((step) =>
        step.stepNumber === stepNumber && !step.locked
          ? { ...step, variables: { ...step.variables, [varName]: value } }
          : step
      ),
    })),

  updateStepNote: (stepNumber, note) =>
    set((s) => ({
      steps: s.steps.map((step) =>
        step.stepNumber === stepNumber && !step.locked
          ? { ...step, note }
          : step
      ),
    })),

  lockStep: (stepNumber) =>
    set((s) => ({
      steps: s.steps.map((step) =>
        step.stepNumber === stepNumber ? { ...step, locked: true } : step
      ),
    })),

  addAntiHint: (hint) =>
    set((s) => ({
      antiHints: [...s.antiHints, hint],
      antiHintsUsed: s.antiHintsUsed + 1,
    })),

  setPendingHintTaskId: (id) => set({ pendingHintTaskId: id }),
  setAnalyzing: (state) => set({ isAnalyzing: state }),
  markBreakthrough: () => set({ isComplete: true }),
  setReadOnly: (val) => set({ isReadOnly: val }),

  hydrate: (data) => set((s) => ({ ...s, ...data })),
  reset: () => set(initialState),
}));
