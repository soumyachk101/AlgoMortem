import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DifficultyBadge } from '@/components/problems/DifficultyBadge';
import type { Problem } from '@/types/problem';

interface WorkspaceHeaderProps {
  problem: Problem;
}

export function WorkspaceHeader({ problem }: WorkspaceHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[var(--bg-base)]/95 backdrop-blur-sm">
      <div className="px-4 h-12 flex items-center gap-3">
        <Link
          href="/problems"
          className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors font-mono text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Problems
        </Link>

        <span className="text-[var(--border-default)]">/</span>

        <h1 className="font-mono text-sm font-medium text-[var(--text-primary)] tracking-wide uppercase truncate">
          {problem.title}
        </h1>

        <DifficultyBadge difficulty={problem.difficulty} />
      </div>
    </header>
  );
}
