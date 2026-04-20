'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface HintRatingProps {
  hintId: string;
  onRate?: (rating: number) => void;
}

export function HintRating({ onRate }: HintRatingProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const handleRate = (r: number) => {
    setSelected(r);
    onRate?.(r);
  };

  return (
    <div className="flex items-center gap-1" aria-label="Rate this hint">
      {[1, 2, 3, 4, 5].map((r) => (
        <button
          key={r}
          onClick={() => handleRate(r)}
          onMouseEnter={() => setHovered(r)}
          onMouseLeave={() => setHovered(null)}
          aria-label={`Rate ${r} out of 5`}
          className={cn(
            'w-5 h-5 rounded-sm text-xs transition-colors cursor-pointer',
            (selected !== null ? r <= selected : hovered !== null ? r <= hovered : false)
              ? 'text-[var(--accent-amber)]'
              : 'text-[var(--text-muted)]'
          )}
        >
          ○
        </button>
      ))}
    </div>
  );
}
