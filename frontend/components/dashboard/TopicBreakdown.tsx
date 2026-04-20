'use client';

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TOPIC_LABELS } from '@/lib/constants';
import type { Topic } from '@/types/problem';

interface TopicBreakdownProps {
  data: Partial<Record<Topic, number>>;
}

export function TopicBreakdown({ data }: TopicBreakdownProps) {
  const chartData = (Object.entries(data) as [Topic, number][]).map(([topic, value]) => ({
    subject: TOPIC_LABELS[topic],
    value,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[var(--text-muted)] font-mono text-xs">
        No topic data yet.
      </div>
    );
  }

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid stroke="var(--border-default)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
          />
          <Radar
            dataKey="value"
            stroke="var(--brand-primary)"
            fill="var(--brand-primary)"
            fillOpacity={0.2}
            strokeWidth={1.5}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 4,
              fontSize: 11,
              fontFamily: 'IBM Plex Mono',
              color: 'var(--text-primary)',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
