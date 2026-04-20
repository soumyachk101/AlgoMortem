'use client';

import { useState, useMemo } from 'react';
import { ProblemCard } from './ProblemCard';
import { ProblemFilters } from './ProblemFilters';
import type { ProblemListItem, Topic, Difficulty } from '@/types/problem';

interface ProblemGridProps {
  problems: ProblemListItem[];
}

export function ProblemGrid({ problems }: ProblemGridProps) {
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [sort, setSort] = useState<string>('most-attempted');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = problems;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.topics.some((t) => t.includes(q))
      );
    }
    if (selectedDifficulty) result = result.filter((p) => p.difficulty === selectedDifficulty);
    if (selectedTopics.length) result = result.filter((p) => selectedTopics.every((t) => p.topics.includes(t)));

    if (sort === 'most-failed') result = [...result].sort((a, b) => (a.mostFailedStep ?? 99) - (b.mostFailedStep ?? 99));
    else if (sort === 'most-attempted') result = [...result].sort((a, b) => b.attemptCount - a.attemptCount);

    return result;
  }, [problems, search, selectedDifficulty, selectedTopics, sort]);

  const toggleTopic = (t: Topic) =>
    setSelectedTopics((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  return (
    <div className="flex flex-col gap-6">
      <ProblemFilters
        selectedTopics={selectedTopics}
        selectedDifficulty={selectedDifficulty}
        sort={sort}
        search={search}
        onTopicToggle={toggleTopic}
        onDifficultyChange={setSelectedDifficulty}
        onSortChange={setSort}
        onSearchChange={setSearch}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-[var(--text-muted)] font-mono text-sm text-center">
          <span className="text-3xl mb-3 opacity-20">◈</span>
          No problems match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((p) => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </div>
      )}
    </div>
  );
}
