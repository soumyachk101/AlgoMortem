'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const GRID_LINES = Array.from({ length: 12 });
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: i * 0.15,
  duration: Math.random() * 4 + 3,
}));

const CODE_SNIPPETS = [
  { text: 'step_4.pointer = left', x: '8%', y: '28%', delay: 0.8 },
  { text: 'while left < right:', x: '78%', y: '22%', delay: 1.2 },
  { text: '◈ LOGIC FRACTURE', x: '72%', y: '68%', delay: 1.6, red: true },
  { text: 'mid = (l + r) // 2', x: '6%', y: '72%', delay: 1.0 },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative flex flex-col items-center justify-center min-h-dvh overflow-hidden px-6 text-center">
      {/* Animated grid */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {GRID_LINES.map((_, i) => (
          <div
            key={`v${i}`}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${(i + 1) * (100 / 13)}%`,
              background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.03) 70%, transparent)',
            }}
          />
        ))}
        {GRID_LINES.map((_, i) => (
          <div
            key={`h${i}`}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${(i + 1) * (100 / 13)}%`,
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.03) 70%, transparent)',
            }}
          />
        ))}
      </div>

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(192,57,43,0.12) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: 'rgba(192,57,43,0.4)' }}
            animate={{ y: [-10, 10, -10], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Floating code snippets */}
      {CODE_SNIPPETS.map((s, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:block"
          style={{ left: s.x, top: s.y }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: s.delay, duration: 0.6, ease: 'easeOut' }}
        >
          <span
            className="font-mono text-xs px-2.5 py-1.5 rounded border select-none"
            style={{
              color: s.red ? 'var(--brand-primary)' : 'var(--text-muted)',
              borderColor: s.red ? 'rgba(192,57,43,0.3)' : 'var(--border-subtle)',
              background: s.red ? 'rgba(192,57,43,0.06)' : 'rgba(14,18,25,0.8)',
            }}
          >
            {s.text}
          </span>
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div style={{ y, opacity }} className="relative z-10 flex flex-col items-center gap-6 max-w-4xl">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-default)] font-mono text-[0.65rem] uppercase tracking-widest text-[var(--text-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] animate-pulse" />
            Anti-Hint Learning Platform
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(3rem, 9vw, 6.5rem)',
            lineHeight: 1.05,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          We dissect
          <br />
          <span style={{ color: 'var(--brand-primary)' }}>your thinking.</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
          className="max-w-[520px] text-[var(--text-secondary)] leading-relaxed"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontFamily: 'var(--font-ui)' }}
        >
          Not a hint system. Not a solution generator. An AI that watches you dry-run a problem step by step — then tells you exactly which step your logic broke.
        </motion.p>

        {/* Mono tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="font-mono text-sm text-[var(--text-muted)]"
        >
          The AI that never gives you the answer.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: 'easeOut' }}
          className="flex items-center gap-3 flex-wrap justify-center"
        >
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 h-12 px-7 rounded-md bg-[var(--brand-primary)] font-mono text-sm text-white hover:bg-[#a93226] transition-all duration-200 active:scale-[0.97] shadow-[0_0_30px_rgba(192,57,43,0.25)]"
          >
            Start dying smarter
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/problems"
            className="inline-flex items-center h-12 px-7 rounded-md border border-[var(--border-default)] font-mono text-sm text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-all duration-200"
          >
            Browse Problems
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="flex items-center gap-6 flex-wrap justify-center mt-2"
        >
          {[
            { val: '200+', label: 'Problems' },
            { val: '40%', label: 'Breakthrough Rate' },
            { val: '<4s', label: 'Analysis Time' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <span className="font-mono text-lg font-medium text-[var(--text-primary)] tabular-nums">{s.val}</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--text-muted)]">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{ opacity }}
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--text-muted)]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-4 h-4 text-[var(--text-muted)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
