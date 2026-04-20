'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Lock, Brain, BookOpen, BarChart3, History, Shield } from 'lucide-react';

const FEATURES = [
  { icon: Brain, title: 'Anti-Hint Engine', desc: 'RAG over a curated mistake knowledge base. Finds where your mental model diverged from correct algorithm behavior.', accent: 'var(--brand-primary)' },
  { icon: Lock, title: 'Step Locking', desc: 'Committed steps cannot be edited. Backend-enforced immutability keeps your dry run honest.', accent: 'var(--accent-steel)' },
  { icon: BookOpen, title: '200+ Problems', desc: 'Handpicked problems tagged with common mistake patterns and canonical dry run structures.', accent: 'var(--accent-amber)' },
  { icon: BarChart3, title: 'Step Failure Heatmaps', desc: 'Crowd data shows which step most people fail at for every problem. Forewarned is forearmed.', accent: 'var(--accent-amber)' },
  { icon: History, title: 'Attempt History', desc: 'Every attempt is stored: logic plan, dry run, anti-hints received. Compare across attempts to see your progression.', accent: 'var(--accent-steel)' },
  { icon: Shield, title: 'No Solution Leakage', desc: 'Anti-hints never contain code. Never suggest the algorithm. Never collapse the solution space. This is a legal and product constraint.', accent: 'var(--brand-primary)' },
];

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

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
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--brand-primary)]">Features</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text-primary)', lineHeight: 1.15 }}>
            Built to make you think.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                className="flex flex-col gap-4 p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-colors duration-300 group"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${f.accent}18`, border: `1px solid ${f.accent}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: f.accent }} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-mono text-sm font-medium text-[var(--text-primary)] uppercase tracking-wide">{f.title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
