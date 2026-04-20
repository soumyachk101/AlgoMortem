'use client';

import { TOPICS, TOPIC_LABELS, DIFFICULTIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Difficulty, Topic } from '@/types/problem';

interface ProblemFiltersProps {
  selectedTopics: Topic[];
  selectedDifficulty: Difficulty | null;
  sort: string;
  search: string;
  onTopicToggle: (t: Topic) => void;
  onDifficultyChange: (d: Difficulty | null) => void;
  onSortChange: (s: string) => void;
  onSearchChange: (s: string) => void;
}

export function ProblemFilters({
  selectedTopics, selectedDifficulty, sort, search,
  onTopicToggle, onDifficultyChange, onSortChange, onSearchChange,
}: ProblemFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Search + sort row */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search problems..."
          className="flex-1 min-w-[200px] h-9 px-3 bg-[var(--bg-sunken)] border border-[var(--border-default)] rounded font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
        />
        <div className="flex items-center gap-1">
          {(['most-failed', 'newest', 'most-attempted'] as const).map((s) => (
            <button
              key={s}
              onClick={() => onSortChange(s)}
              className={cn(
                'px-3 h-8 rounded text-[0.65rem] font-mono uppercase tracking-wider transition-colors cursor-pointer',
                sort === s
                  ? 'bg-[var(--brand-primary)] text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
              )}
            >
              {s.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty tabs */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onDifficultyChange(null)}
          className={cn(
            'px-3 h-7 rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer',
            selectedDifficulty === null
              ? 'bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          )}
        >
          All
        </button>
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => onDifficultyChange(selectedDifficulty === d ? null : d)}
            className={cn(
              'px-3 h-7 rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer',
              selectedDifficulty === d
                ? 'bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-primary)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Topic chips */}
      <div className="flex flex-wrap gap-1.5">
        {TOPICS.map((t) => {
          const active = selectedTopics.includes(t);
          return (
            <button
              key={t}
              onClick={() => onTopicToggle(t)}
              className={cn(
                'px-2.5 h-6 rounded-full text-[0.65rem] font-mono tracking-wide transition-all cursor-pointer',
                active
                  ? 'bg-[var(--brand-glow)] border border-[var(--brand-primary)] text-[var(--brand-primary)]'
                  : 'border border-[var(--border-default)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-secondary)]'
              )}
            >
              {TOPIC_LABELS[t]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
