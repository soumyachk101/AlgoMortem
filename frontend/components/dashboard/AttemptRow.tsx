import Link from 'next/link';
import { formatRelative } from '@/lib/utils';
import { DIFFICULTY_COLORS } from '@/lib/constants';
import type { AttemptHistoryItem } from '@/types/dryRun';

interface AttemptRowProps {
  attempt: AttemptHistoryItem;
}

export function AttemptRow({ attempt }: AttemptRowProps) {
  const dotColor = DIFFICULTY_COLORS[attempt.difficulty].dot;

  return (
    <Link
      href={`/attempt/${attempt.id}`}
      className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] transition-colors group"
    >
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dotColor }} />

      <span className="flex-1 font-mono text-sm text-[var(--text-primary)] group-hover:text-white truncate">
        {attempt.problemTitle}
      </span>

      <span className="font-mono text-xs text-[var(--text-muted)] shrink-0">
        {formatRelative(attempt.createdAt)}
      </span>

      <span className="font-mono text-xs text-[var(--text-muted)] shrink-0 hidden sm:block">
        {attempt.stepIdentified != null
          ? `Step ${attempt.stepIdentified} identified`
          : attempt.isComplete
          ? 'Completed'
          : 'Abandoned'}
      </span>

      <span className="font-mono text-xs text-[var(--text-muted)] shrink-0 hidden md:block">
        {attempt.antiHintsUsed} hint{attempt.antiHintsUsed !== 1 ? 's' : ''}
      </span>

      {attempt.breakthroughAt ? (
        <span className="font-mono text-xs shrink-0" style={{ color: 'var(--brand-primary)' }}>
          ✦ Breakthrough
        </span>
      ) : (
        <span className="w-20 shrink-0 hidden md:block" />
      )}
    </Link>
  );
}
