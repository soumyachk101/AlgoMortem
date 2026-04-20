'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AntiHintCardMock } from '@/components/anti-hint/AntiHintCardMock';

const DRY_RUN_ROWS = [
  { step: 1, left: '0', right: '6', mid: '3', note: 'Initial', locked: true },
  { step: 2, left: '0', right: '2', mid: '1', note: 'nums[3]<target', locked: true },
  { step: 3, left: '2', right: '2', mid: '2', note: 'nums[1]<target', locked: true },
  { step: 4, left: '2', right: '1', mid: '—', note: '?? loop ends', locked: false, broken: true },
];

export function DemoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-28 px-6 border-t border-[var(--border-default)]">
      <div className="max-w-6xl mx-auto flex flex-col gap-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--brand-primary)]">See It In Action</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text-primary)', lineHeight: 1.15 }}>
            Where logic goes to die.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Dry run table mock */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl overflow-hidden border border-[var(--border-default)] bg-[var(--bg-surface)]"
          >
            <div className="px-4 py-3 border-b border-[var(--border-default)] bg-[var(--bg-elevated)] flex items-center justify-between">
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--text-muted)]">Dry Run — Binary Search</span>
              <span className="font-mono text-[0.6rem] text-[var(--accent-amber)]">Step 4 flagged</span>
            </div>
            {/* Header */}
            <div className="flex border-b border-[var(--border-default)] bg-[var(--bg-elevated)]">
              {['#', 'left', 'right', 'mid', 'note'].map((h) => (
                <div key={h} className="flex-1 px-3 py-2 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent-steel)]">{h}</div>
              ))}
            </div>
            {DRY_RUN_ROWS.map((row, i) => (
              <motion.div
                key={row.step}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="flex border-b border-[var(--border-subtle)] last:border-0"
                style={{
                  borderLeft: row.broken
                    ? '2px solid var(--brand-primary)'
                    : row.locked
                    ? '2px solid var(--accent-steel)'
                    : '2px solid transparent',
                  background: row.broken ? 'rgba(192,57,43,0.04)' : row.locked ? 'rgba(78,158,191,0.04)' : 'transparent',
                }}
              >
                {[String(row.step), row.left, row.right, row.mid, row.note].map((v, j) => (
                  <div key={j} className="flex-1 px-3 py-2.5 font-mono text-xs" style={{ color: row.broken ? 'var(--brand-primary)' : j === 0 ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                    {v}
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>

          {/* Anti-hint result */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 px-1">
              <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
              <span className="font-mono text-xs text-[var(--text-muted)]">Analysis complete</span>
            </div>
            <AntiHintCardMock />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
