'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { Problem } from '@/types/problem';

interface ProblemStatementProps {
  problem: Problem;
  defaultOpen?: boolean;
}

export function ProblemStatement({ problem, defaultOpen = true }: ProblemStatementProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col border-b border-[var(--border-default)]">
      {/* Toggle header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        aria-expanded={open}
      >
        {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        <span className="text-[0.6rem] font-mono uppercase tracking-widest">Problem Statement</span>
      </button>

      {open && (
        <div className="px-4 pb-4 text-sm text-[var(--text-primary)] leading-relaxed space-y-3">
          <p>{problem.statement}</p>

          <div className="space-y-1">
            <p className="text-[0.65rem] font-mono uppercase tracking-wider text-[var(--text-muted)]">Example Input</p>
            <pre className="font-mono text-xs bg-[var(--bg-sunken)] px-3 py-2 rounded border border-[var(--border-subtle)] text-[var(--text-primary)] overflow-x-auto">
              {problem.exampleInput}
            </pre>
          </div>

          <div className="space-y-1">
            <p className="text-[0.65rem] font-mono uppercase tracking-wider text-[var(--text-muted)]">Example Output</p>
            <pre className="font-mono text-xs bg-[var(--bg-sunken)] px-3 py-2 rounded border border-[var(--border-subtle)] text-[var(--accent-steel)] overflow-x-auto">
              {problem.exampleOutput}
            </pre>
          </div>

          <div className="space-y-1">
            <p className="text-[0.65rem] font-mono uppercase tracking-wider text-[var(--text-muted)]">Constraints</p>
            <ul className="space-y-0.5">
              {problem.constraints.map((c, i) => (
                <li key={i} className="font-mono text-xs text-[var(--text-secondary)]">
                  · {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
