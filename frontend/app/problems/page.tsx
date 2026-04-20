'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProblemGrid } from '@/components/problems/ProblemGrid';
import { MOCK_PROBLEMS } from '@/lib/mockData';
import { AuthGate } from '@/components/auth/AuthGate';

function ProblemsContent() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-24 pb-8">
        <div className="flex items-baseline justify-between mb-6">
          <h1 className="font-mono text-sm uppercase tracking-widest text-[var(--text-muted)]">
            Problem Library
          </h1>
          <span className="font-mono text-xs text-[var(--text-muted)]">
            {MOCK_PROBLEMS.length} problems
          </span>
        </div>
        <ProblemGrid problems={MOCK_PROBLEMS} />
      </main>
      <Footer />
    </div>
  );
}

export default function ProblemsPage() {
  return <AuthGate><ProblemsContent /></AuthGate>;
}
