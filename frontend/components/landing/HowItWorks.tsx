'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const STEPS = [
  {
    num: '01',
    label: 'Write Your Logic',
    desc: 'No code. Describe how you plan to solve the problem in plain English or pseudocode. The canvas is watching.',
    detail: 'Freeform text area · Markdown-lite · Saved automatically',
    color: 'var(--text-muted)',
  },
  {
    num: '02',
    label: 'Dry Run the Problem',
    desc: 'Trace through a test case step by step. Define your variables. Fill in their values at each step. Commit steps to lock them permanently — no going back.',
    detail: 'Structured table · Step locking · Variable tracking',
    color: 'var(--accent-steel)',
  },
  {
    num: '03',
    label: 'Get Dissected',
    desc: 'The AI runs RAG over a curated mistake knowledge base using your dry run as the query. It tells you exactly which step your logic fractures — and asks a Socratic question. Never the answer.',
    detail: '< 4s latency · Max 3 analyses · Zoom-in on each',
    color: 'var(--brand-primary)',
  },
];

function Step({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col gap-4 p-8 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] group hover:border-[var(--border-strong)] transition-colors duration-300"
    >
      {/* Connector line (not last) */}
      {index < STEPS.length - 1 && (
        <div className="hidden lg:block absolute top-1/2 -right-px w-px h-1/2 bg-[var(--border-default)]" style={{ transform: 'translateX(50%)' }} />
      )}

      <div className="flex items-start justify-between">
        <span
          className="font-mono text-4xl font-medium tabular-nums leading-none"
          style={{ color: step.color, opacity: 0.4 }}
        >
          {step.num}
        </span>
        <motion.div
          className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: step.color }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: step.color }} />
        </motion.div>
      </div>

      <h3 className="font-mono text-base font-medium uppercase tracking-wide text-[var(--text-primary)]">
        {step.label}
      </h3>
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{step.desc}</p>
      <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-3 mt-1">
        {step.detail}
      </p>
    </motion.div>
  );
}

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-28 px-6 border-t border-[var(--border-default)]">
      <div className="max-w-6xl mx-auto flex flex-col gap-14">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--brand-primary)]">How It Works</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text-primary)', lineHeight: 1.15 }}>
            Three steps. No shortcuts.
          </h2>
          <p className="max-w-md text-[var(--text-secondary)] text-sm leading-relaxed">
            The entire product is built around one radical idea: you have to think through it yourself.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {STEPS.map((s, i) => <Step key={s.num} step={s} index={i} />)}
        </div>
      </div>
    </section>
  );
}
