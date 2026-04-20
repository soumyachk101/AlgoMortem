'use client';

import { use, useCallback } from 'react';
import { AuthGate } from '@/components/auth/AuthGate';
import { notFound } from 'next/navigation';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { LogicCanvas } from '@/components/canvas/LogicCanvas';
import { ProblemStatement } from '@/components/problems/ProblemStatement';
import { AntiHintZone } from '@/components/anti-hint/AntiHintZone';
import { useDryRunStore } from '@/stores/dryRunStore';
import { MOCK_PROBLEMS } from '@/lib/mockData';
import { useDebounce } from 'use-debounce';
import type { AntiHint } from '@/types/antiHint';

interface Props {
  params: Promise<{ slug: string }>;
}

function WorkspaceInner({ params }: Props) {
  const { slug } = use(params);
  const problem = MOCK_PROBLEMS.find((p) => p.slug === slug);
  const { addAntiHint, setAnalyzing, antiHintsUsed, logicPlan, setLogicPlan } = useDryRunStore();
  useDebounce(logicPlan, 1000); // debounced save placeholder

  if (!problem) notFound();

  const handleAnalyze = useCallback(async () => {
    if (antiHintsUsed >= 3) return;
    setAnalyzing(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 2000));
    const mockHint: AntiHint = {
      id: crypto.randomUUID(),
      dryRunId: 'mock-dry-run',
      hintNumber: antiHintsUsed + 1,
      text: `At Step ${Math.max(1, useDryRunStore.getState().steps.length)}, your pointer values diverge from the loop invariant you established in Step 1. What does your loop condition guarantee about the relationship between your current step and the final answer?`,
      stepReference: Math.max(1, useDryRunStore.getState().steps.length),
      rating: null,
      createdAt: new Date().toISOString(),
    };
    addAntiHint(mockHint);
    setAnalyzing(false);
  }, [antiHintsUsed, setAnalyzing, addAntiHint]);

  const handleCommitStep = useCallback(async (stepNumber: number) => {
    // In production: POST /dry-runs/:id/lock-step
    console.log('Commit step', stepNumber);
  }, []);

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <WorkspaceHeader problem={problem} />

      <div className="flex flex-1 overflow-hidden min-h-0 flex-col lg:flex-row">
        {/* Sidebar — problem statement */}
        <aside className="lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r border-[var(--border-default)] overflow-y-auto shrink-0">
          <ProblemStatement problem={problem} />
        </aside>

        {/* Main canvas area */}
        <div className="flex flex-col flex-1 overflow-hidden min-h-0">
          <div className="flex-1 overflow-hidden min-h-0">
            <LogicCanvas
              onAnalyze={handleAnalyze}
              onCommitStep={handleCommitStep}
              onLogicPlanChange={setLogicPlan}
            />
          </div>
          <div className="overflow-y-auto max-h-[40vh] border-t border-[var(--border-default)]">
            <AntiHintZone />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProblemWorkspacePage({ params }: Props) {
  return <AuthGate><WorkspaceInner params={params} /></AuthGate>;
}
