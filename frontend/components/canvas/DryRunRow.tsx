'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { VariableCell } from './VariableCell';
import { StepCommitButton } from './StepCommitButton';
import { useDryRunStore } from '@/stores/dryRunStore';
import type { DryRunStep } from '@/types/dryRun';

interface DryRunRowProps {
  step: DryRunStep;
  headers: string[];
  onCommit: () => void;
  isActive?: boolean;
  readOnly?: boolean;
}

export function DryRunRow({ step, headers, onCommit, isActive, readOnly }: DryRunRowProps) {
  const { updateStepVariable, updateStepNote } = useDryRunStore();
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && rowRef.current) {
      rowRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isActive]);

  const isLocked = step.locked || readOnly;

  const handleCellKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, varIdx: number) => {
    if (e.key === 'Enter' && !isLocked) {
      e.preventDefault();
      if (varIdx === headers.length - 1) {
        onCommit();
      } else {
        const nextInput = rowRef.current?.querySelectorAll('input')[varIdx + 1] as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  return (
    <div
      ref={rowRef}
      role="row"
      aria-label={`Step ${step.stepNumber}${step.locked ? ' — locked' : ''}`}
      className={cn(
        'flex items-stretch border-b border-[var(--border-subtle)] transition-all duration-200',
        isLocked
          ? 'border-l-2 border-l-[var(--accent-steel)] bg-[rgba(78,158,191,0.04)]'
          : isActive
          ? 'border-l-2 border-l-[var(--brand-primary)] bg-[var(--brand-glow)]'
          : 'border-l-2 border-l-transparent hover:bg-[var(--border-subtle)]'
      )}
    >
      {/* Step number */}
      <div className="flex items-center justify-center w-12 shrink-0 font-mono text-xs tabular-nums select-none"
        style={{ color: step.locked ? 'var(--accent-amber)' : isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}>
        {step.stepNumber}
      </div>

      {/* Variable cells */}
      {headers.map((h, idx) => (
        <div
          key={h}
          role="cell"
          className="flex-1 min-w-[80px] border-l border-[var(--border-subtle)]"
        >
          <VariableCell
            value={step.variables[h] ?? ''}
            locked={isLocked ?? false}
            stepNumber={step.stepNumber}
            varName={h}
            onChange={(val) => updateStepVariable(step.stepNumber, h, val)}
            onKeyDown={(e) => handleCellKeyDown(e, idx)}
          />
        </div>
      ))}

      {/* Note */}
      <div className="flex-[1.5] min-w-[120px] border-l border-[var(--border-subtle)]">
        <input
          value={step.note}
          onChange={(e) => updateStepNote(step.stepNumber, e.target.value)}
          disabled={isLocked ?? false}
          placeholder={isLocked ? '' : 'optional note...'}
          className="w-full h-full px-2 py-1.5 bg-transparent text-sm text-[var(--text-secondary)] font-[var(--font-ui)] placeholder:text-[var(--text-muted)] focus:outline-none disabled:cursor-default"
        />
      </div>

      {/* Commit/lock button */}
      <div className="flex items-center justify-center w-10 shrink-0 border-l border-[var(--border-subtle)]">
        {!readOnly && (
          <StepCommitButton
            locked={step.locked}
            stepNumber={step.stepNumber}
            onCommit={onCommit}
          />
        )}
      </div>
    </div>
  );
}
