'use client';

import { LogicPlanEditor } from './LogicPlanEditor';
import { DryRunTable } from './DryRunTable';
import { AnalyzeButton } from './AnalyzeButton';
import { HintCounter } from '@/components/anti-hint/HintCounter';
import { useDryRunStore } from '@/stores/dryRunStore';

interface LogicCanvasProps {
  readOnly?: boolean;
  onAnalyze?: () => void;
  onCommitStep?: (stepNumber: number) => void;
  onLogicPlanChange?: (value: string) => void;
}

export function LogicCanvas({ readOnly, onAnalyze, onCommitStep, onLogicPlanChange }: LogicCanvasProps) {
  const { antiHintsUsed } = useDryRunStore();

  return (
    <div className="flex flex-col h-full">
      {/* Rate limit badge */}
      {!readOnly && antiHintsUsed > 0 && (
        <div className="flex items-center justify-center py-1.5 border-b border-[var(--border-default)]">
          <HintCounter used={antiHintsUsed} />
        </div>
      )}

      {/* Split panel */}
      <div className="flex flex-1 overflow-hidden min-h-0 flex-col md:flex-row">
        {/* Logic plan — 40% */}
        <div className="flex flex-col md:w-[40%] md:border-r border-b md:border-b-0 border-[var(--border-default)] min-h-[200px] md:min-h-0">
          <LogicPlanEditor readOnly={readOnly} onChange={onLogicPlanChange} />
        </div>

        {/* Dry run table — 60% */}
        <div className="flex flex-col flex-1 overflow-hidden min-h-[280px] md:min-h-0">
          <DryRunTable readOnly={readOnly} onCommitStep={onCommitStep} />
        </div>
      </div>

      {/* Bottom bar */}
      {!readOnly && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-default)] bg-[var(--bg-surface)]">
          <p className="text-[var(--text-muted)] text-xs font-mono">
            {antiHintsUsed === 0
              ? 'Fill in your logic plan and dry run, then analyze.'
              : `${antiHintsUsed}/3 analyses used on this attempt.`}
          </p>
          {onAnalyze && <AnalyzeButton onAnalyze={onAnalyze} />}
        </div>
      )}
    </div>
  );
}
