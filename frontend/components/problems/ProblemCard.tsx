import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { DifficultyBadge } from './DifficultyBadge';
import { DIFFICULTY_COLORS, TOPIC_LABELS } from '@/lib/constants';
import type { ProblemListItem } from '@/types/problem';

interface ProblemCardProps {
  problem: ProblemListItem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const dotColor = DIFFICULTY_COLORS[problem.difficulty].dot;

  return (
    <Link href={`/problems/${problem.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] rounded-lg">
      <Card hoverable className="p-4 h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0 mt-0.5"
              style={{ background: dotColor }}
              aria-hidden="true"
            />
            <h3 className="font-mono text-sm font-medium text-[var(--text-primary)] leading-snug uppercase tracking-wide">
              {problem.title}
            </h3>
          </div>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-1 mb-3">
          {problem.topics.slice(0, 3).map((t) => (
            <span key={t} className="text-[0.6rem] font-mono text-[var(--text-muted)] tracking-wide">
              {TOPIC_LABELS[t]}
              {problem.topics.indexOf(t) < Math.min(problem.topics.length, 3) - 1 ? ' ·' : ''}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-[0.65rem] font-mono text-[var(--text-muted)]">
          <span>{problem.attemptCount.toLocaleString()} attempts</span>
          <span>·</span>
          <span>{Math.round(problem.breakthroughRate * 100)}% breakthrough</span>
        </div>

        {/* Most fail */}
        {problem.mostFailedStep != null && (
          <div className="mt-2 pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-[0.6rem] font-mono" style={{ color: 'var(--accent-amber)' }}>
              Most fail: Step {problem.mostFailedStep}
            </span>
          </div>
        )}
      </Card>
    </Link>
  );
}
