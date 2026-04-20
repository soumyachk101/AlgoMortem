'use client';

import { Plus } from 'lucide-react';
import { useDryRunStore } from '@/stores/dryRunStore';
import { DryRunRow } from './DryRunRow';
import { VariableHeaderManager } from './VariableHeaderManager';
import { MAX_STEPS } from '@/lib/constants';

interface DryRunTableProps {
  readOnly?: boolean;
  onCommitStep?: (stepNumber: number) => void;
}

export function DryRunTable({ readOnly, onCommitStep }: DryRunTableProps) {
  const { steps, variableHeaders, addStep, lockStep } = useDryRunStore();
  const lastUnlocked = steps.findLast((s) => !s.locked);
  const canAddStep = steps.length < MAX_STEPS && !readOnly;

  const handleCommit = (stepNumber: number) => {
    lockStep(stepNumber);
    onCommitStep?.(stepNumber);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {!readOnly && <VariableHeaderManager />}

      {/* Table header */}
      <div
        role="rowgroup"
        className="flex items-center border-b border-[var(--border-default)] bg-[var(--bg-elevated)] sticky top-0 z-10"
      >
        <div className="w-12 shrink-0 px-2 py-2 text-[0.6rem] font-mono uppercase tracking-widest text-[var(--text-muted)] select-none">#</div>
        {variableHeaders.map((h) => (
          <div key={h} className="flex-1 min-w-[80px] px-2 py-2 text-[0.6rem] font-mono uppercase tracking-widest text-[var(--accent-steel)] border-l border-[var(--border-subtle)] truncate">
            {h}
          </div>
        ))}
        {variableHeaders.length > 0 && (
          <>
            <div className="flex-[1.5] min-w-[120px] px-2 py-2 text-[0.6rem] font-mono uppercase tracking-widest text-[var(--text-muted)] border-l border-[var(--border-subtle)]">
              Note
            </div>
            <div className="w-10 shrink-0 border-l border-[var(--border-subtle)]" />
          </>
        )}
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto overflow-x-auto" role="rowgroup">
        {variableHeaders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-[var(--text-muted)] font-mono text-sm text-center px-4">
            <span className="text-2xl mb-2 opacity-30">◈</span>
            Add variables above, then add steps.
          </div>
        ) : steps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-[var(--text-muted)] font-mono text-sm text-center px-4">
            <span className="text-2xl mb-2 opacity-30">◈</span>
            No steps yet. Add your first step.
          </div>
        ) : (
          steps.map((step) => (
            <DryRunRow
              key={step.stepNumber}
              step={step}
              headers={variableHeaders}
              onCommit={() => handleCommit(step.stepNumber)}
              isActive={!readOnly && step === lastUnlocked}
              readOnly={readOnly}
            />
          ))
        )}
      </div>

      {/* Add step */}
      {canAddStep && variableHeaders.length > 0 && (
        <button
          onClick={addStep}
          className="flex items-center gap-2 w-full px-4 py-2.5 border-t border-[var(--border-default)] text-[var(--text-muted)] text-xs font-mono hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Step
        </button>
      )}
    </div>
  );
}
