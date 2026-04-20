'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

export function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-28 px-6 border-t border-[var(--border-default)]">
      <div ref={ref} className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-12 overflow-hidden w-full"
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 100%, rgba(192,57,43,0.1) 0%, transparent 70%)' }}
          />

          <div className="relative flex flex-col items-center gap-6">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--brand-primary)]">Ready?</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              Your flat line is waiting.
            </h2>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-md">
              Pick a problem. Write your logic. Dry run it. Get dissected. That&apos;s it. No leaderboards. No streaks. No dopamine traps. Just thinking.
            </p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 h-12 px-8 rounded-md bg-[var(--brand-primary)] font-mono text-sm text-white hover:bg-[#a93226] transition-all duration-200 active:scale-[0.97] shadow-[0_0_40px_rgba(192,57,43,0.3)]"
              >
                Start dying smarter
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center h-12 px-6 font-mono text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Already have an account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
