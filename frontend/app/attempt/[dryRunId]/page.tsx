'use client';

import { use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { LogicCanvas } from '@/components/canvas/LogicCanvas';
import { AntiHintZone } from '@/components/anti-hint/AntiHintZone';
import { useDryRunStore } from '@/stores/dryRunStore';
import { MOCK_PROBLEMS, MOCK_ATTEMPTS } from '@/lib/mockData';

interface Props {
  params: Promise<{ dryRunId: string }>;
}

export default function AttemptViewPage({ params }: Props) {
  const { dryRunId } = use(params);
  const { hydrate, setReadOnly } = useDryRunStore();

  const attempt = MOCK_ATTEMPTS.find((a) => a.id === dryRunId);
  const problem = attempt ? MOCK_PROBLEMS.find((p) => p.id === attempt.problemId) : null;

  useEffect(() => {
    if (attempt) {
      hydrate({ logicPlan: '(Saved logic plan from this attempt)' });
      setReadOnly(true);
    }
  }, [attempt, hydrate, setReadOnly]);

  if (!attempt || !problem) notFound();

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <WorkspaceHeader problem={problem} />

      <div className="px-4 py-2 border-b border-[var(--border-default)] bg-[var(--bg-elevated)]">
        <span className="font-mono text-xs text-[var(--accent-amber)] uppercase tracking-widest">
          Read Only — Viewing past attempt
        </span>
      </div>

      <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
        <div className="flex-1 overflow-hidden min-h-0">
          <LogicCanvas readOnly />
        </div>
        <div className="overflow-y-auto max-h-[40vh] border-t border-[var(--border-default)]">
          <AntiHintZone />
        </div>
      </div>
    </div>
  );
}
