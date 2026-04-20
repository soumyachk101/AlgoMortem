interface StatCard {
  label: string;
  value: string | number;
  sub?: string;
}

interface StatsCardsProps {
  stats: StatCard[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col gap-1 p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)]"
        >
          <span className="text-[0.6rem] font-mono uppercase tracking-widest text-[var(--text-muted)]">{s.label}</span>
          <span className="font-mono text-2xl font-medium text-[var(--text-primary)] tabular-nums">{s.value}</span>
          {s.sub && <span className="font-mono text-xs text-[var(--text-muted)]">{s.sub}</span>}
        </div>
      ))}
    </div>
  );
}
