'use client';

import { Tooltip } from '@/components/ui/Tooltip';
import { formatDate } from '@/lib/utils';

interface HeatmapDay {
  date: string;
  attempts: number;
  breakthroughs: number;
}

interface ActivityHeatmapProps {
  data: HeatmapDay[];
}

function cellColor(d: HeatmapDay): string {
  if (d.attempts === 0) return 'var(--accent-ghost)';
  if (d.breakthroughs > 0) return 'var(--brand-primary)';
  if (d.attempts >= 3) return 'var(--accent-steel)';
  if (d.attempts >= 1) return 'rgba(78,158,191,0.4)';
  return 'var(--accent-ghost)';
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[0.6rem] font-mono uppercase tracking-widest text-[var(--text-muted)]">Activity</span>
        <div className="flex items-center gap-2 text-[0.6rem] font-mono text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: 'var(--accent-ghost)' }} /> None
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: 'var(--accent-steel)' }} /> Attempted
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: 'var(--brand-primary)' }} /> Breakthrough
          </span>
        </div>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <Tooltip key={day.date} content={`${formatDate(day.date)} · ${day.attempts} attempt${day.attempts !== 1 ? 's' : ''}`}>
                <div
                  className="w-3 h-3 rounded-sm cursor-default"
                  style={{ background: cellColor(day) }}
                  aria-label={`${formatDate(day.date)}: ${day.attempts} attempts`}
                />
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
