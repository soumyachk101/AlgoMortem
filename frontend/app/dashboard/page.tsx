import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthGate } from '@/components/auth/AuthGate';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { AttemptHistory } from '@/components/dashboard/AttemptHistory';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { TopicBreakdown } from '@/components/dashboard/TopicBreakdown';
import { MOCK_ATTEMPTS, MOCK_HEATMAP, MOCK_TOPIC_STATS } from '@/lib/mockData';

function DashboardContent() {
  const stats = [
    { label: 'Total Attempts', value: MOCK_ATTEMPTS.length },
    { label: 'Breakthroughs', value: MOCK_ATTEMPTS.filter((a) => a.breakthroughAt).length, sub: `${Math.round((MOCK_ATTEMPTS.filter((a) => a.breakthroughAt).length / Math.max(MOCK_ATTEMPTS.length, 1)) * 100)}% rate` },
    { label: 'Hints Used', value: MOCK_ATTEMPTS.reduce((acc, a) => acc + a.antiHintsUsed, 0) },
    { label: 'Day Streak', value: 4, sub: 'Keep going' },
  ];

  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-8">
        <div className="flex items-baseline justify-between">
          <h1 className="font-mono text-sm uppercase tracking-widest text-[var(--text-muted)]">Dashboard</h1>
          <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">14 day streak</span>
        </div>

        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4 p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)]">
            <ActivityHeatmap data={MOCK_HEATMAP} />
          </div>
          <div className="flex flex-col gap-3 p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)]">
            <span className="text-[0.6rem] font-mono uppercase tracking-widest text-[var(--text-muted)]">Topic Breakdown</span>
            <TopicBreakdown data={MOCK_TOPIC_STATS} />
          </div>
        </div>

        <div className="rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border-default)]">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--text-muted)]">Attempt History</span>
          </div>
          <AttemptHistory attempts={MOCK_ATTEMPTS} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return <AuthGate><DashboardContent /></AuthGate>;
}
