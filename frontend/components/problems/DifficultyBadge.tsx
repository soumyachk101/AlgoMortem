import { DIFFICULTY_COLORS } from '@/lib/constants';
import type { Difficulty } from '@/types/problem';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const color = DIFFICULTY_COLORS[difficulty].text;
  return (
    <span
      className="font-mono text-xs uppercase tracking-wider"
      style={{ color }}
    >
      {difficulty}
    </span>
  );
}
