import { AttemptRow } from './AttemptRow';
import type { AttemptHistoryItem } from '@/types/dryRun';

interface AttemptHistoryProps {
  attempts: AttemptHistoryItem[];
}

export function AttemptHistory({ attempts }: AttemptHistoryProps) {
  if (attempts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)] font-mono text-sm text-center">
        <span className="text-3xl mb-3 opacity-20">◈</span>
        <p className="mb-1">Your first dry run is a flat line.</p>
        <p>Pick a problem and start bleeding.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Column headers */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-[var(--border-default)]">
        <span className="w-2 h-2 shrink-0" />
        <span className="flex-1 text-[0.6rem] font-mono uppercase tracking-widest text-[var(--text-muted)]">Problem</span>
        <span className="text-[0.6rem] font-mono uppercase tracking-widest text-[var(--text-muted)] shrink-0">Date</span>
        <span className="text-[0.6rem] font-mono uppercase tracking-widest text-[var(--text-muted)] shrink-0 hidden sm:block">Status</span>
        <span className="text-[0.6rem] font-mono uppercase tracking-widest text-[var(--text-muted)] shrink-0 hidden md:block">Hints</span>
        <span className="w-20 shrink-0 hidden md:block" />
      </div>
      {attempts.map((a) => <AttemptRow key={a.id} attempt={a} />)}
    </div>
  );
}
