'use client';

import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepCommitButtonProps {
  locked: boolean;
  stepNumber: number;
  onCommit: () => void;
}

export function StepCommitButton({ locked, onCommit }: StepCommitButtonProps) {
  if (locked) {
    return (
      <div className="flex items-center justify-center w-8 h-8">
        <Lock className="w-3.5 h-3.5 text-[var(--accent-steel)]" aria-label="Step locked" />
      </div>
    );
  }

  return (
    <button
      onClick={onCommit}
      title="Commit step (locks it permanently)"
      className={cn(
        'flex items-center justify-center w-8 h-8 rounded',
        'text-[var(--text-muted)] hover:text-[var(--accent-steel)] hover:bg-[var(--accent-ghost)]',
        'transition-all duration-150 cursor-pointer'
      )}
      aria-label="Commit and lock this step"
    >
      <Lock className="w-3.5 h-3.5" />
    </button>
  );
}
