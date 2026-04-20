'use client';

import { useDryRunStore } from '@/stores/dryRunStore';
import { MAX_ANTI_HINTS_PER_ATTEMPT } from '@/lib/constants';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';

interface AnalyzeButtonProps {
  onAnalyze: () => void;
}

export function AnalyzeButton({ onAnalyze }: AnalyzeButtonProps) {
  const { isAnalyzing, antiHintsUsed, steps, variableHeaders, logicPlan } = useDryRunStore();

  const exhausted = antiHintsUsed >= MAX_ANTI_HINTS_PER_ATTEMPT;
  const hasContent = steps.length > 0 && variableHeaders.length > 0 && logicPlan.trim().length > 0;
  const approaching = antiHintsUsed === MAX_ANTI_HINTS_PER_ATTEMPT - 1;
  const disabled = exhausted || isAnalyzing || !hasContent;

  return (
    <button
      onClick={onAnalyze}
      disabled={disabled}
      aria-label="Analyze my logic"
      className={cn(
        'relative flex items-center justify-center gap-2 h-10 px-6 rounded-md font-mono text-sm font-medium transition-all duration-200 cursor-pointer',
        exhausted
          ? 'bg-transparent border border-[var(--text-muted)] text-[var(--text-muted)] cursor-not-allowed opacity-60'
          : approaching
          ? 'bg-[var(--brand-primary)] text-white border border-[var(--accent-amber)] rate-pulse'
          : 'bg-[var(--brand-primary)] text-white hover:bg-[#a93226] active:scale-[0.98]',
        disabled && !exhausted && 'opacity-40 cursor-not-allowed',
      )}
    >
      {isAnalyzing ? (
        <>
          <Spinner size="sm" />
          Dissecting...
        </>
      ) : exhausted ? (
        'Analysis exhausted. Keep going alone.'
      ) : (
        'Analyze My Logic'
      )}
    </button>
  );
}
