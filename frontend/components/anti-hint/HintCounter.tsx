'use client';

import { MAX_ANTI_HINTS_PER_ATTEMPT } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface HintCounterProps {
  used: number;
}

export function HintCounter({ used }: HintCounterProps) {
  const exhausted = used >= MAX_ANTI_HINTS_PER_ATTEMPT;
  const approaching = used === MAX_ANTI_HINTS_PER_ATTEMPT - 1;

  return (
    <div
      className={cn(
        'relative overflow-hidden flex items-center gap-2 px-3 py-1 rounded border text-[0.65rem] font-mono tracking-wider uppercase',
        exhausted
          ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
          : approaching
          ? 'border-[var(--accent-amber)] text-[var(--accent-amber)] rate-pulse'
          : 'border-[var(--border-default)] text-[var(--text-secondary)]'
      )}
      aria-label={`${used} of ${MAX_ANTI_HINTS_PER_ATTEMPT} analyses used`}
    >
      {/* fill bar */}
      <div
        className="absolute left-0 top-0 h-full bg-current opacity-5 transition-all duration-500"
        style={{ width: `${(used / MAX_ANTI_HINTS_PER_ATTEMPT) * 100}%` }}
      />
      <span className="relative">
        {used}/{MAX_ANTI_HINTS_PER_ATTEMPT} Analysis Used
        {MAX_ANTI_HINTS_PER_ATTEMPT - used > 0
          ? ` · ${MAX_ANTI_HINTS_PER_ATTEMPT - used} Remaining`
          : ''}
      </span>
    </div>
  );
}
