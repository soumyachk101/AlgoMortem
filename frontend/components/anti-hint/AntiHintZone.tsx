'use client';

import { useDryRunStore } from '@/stores/dryRunStore';
import { AntiHintCard } from './AntiHintCard';
import { Spinner } from '@/components/ui/Spinner';

interface AntiHintZoneProps {
  onRate?: (hintId: string, rating: number) => void;
}

export function AntiHintZone({ onRate }: AntiHintZoneProps) {
  const { antiHints, isAnalyzing } = useDryRunStore();

  if (!isAnalyzing && antiHints.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 px-4 py-4 border-t border-[var(--border-default)]" aria-label="Analysis results">
      {isAnalyzing && (
        <div className="flex items-center gap-3 text-[var(--text-secondary)] font-mono text-sm">
          <Spinner size="sm" />
          <span>Dissecting your logic...</span>
        </div>
      )}
      {antiHints.map((hint) => (
        <AntiHintCard key={hint.id} hint={hint} onRate={onRate} />
      ))}
    </div>
  );
}
