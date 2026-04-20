'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HintRating } from './HintRating';
import type { AntiHint } from '@/types/antiHint';

interface AntiHintCardProps {
  hint: AntiHint;
  onRate?: (hintId: string, rating: number) => void;
}

export function AntiHintCard({ hint, onRate }: AntiHintCardProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const iRef = useRef(0);

  useEffect(() => {
    iRef.current = 0;
    const id = setInterval(() => {
      iRef.current += 1;
      const next = hint.text.slice(0, iRef.current);
      setDisplayed(next);
      if (iRef.current >= hint.text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, 28);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint.id]);

  return (
    <motion.div
      role="region"
      aria-live="polite"
      aria-label="Logic Fracture analysis result"
      className="relative overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)]"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Animated left border */}
      <motion.div
        className="absolute left-0 top-0 w-1 bg-[var(--brand-primary)] rounded-l"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        style={{ height: '100%', transformOrigin: 'top' }}
      />

      <div className="pl-5 pr-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--brand-primary)] font-medium">
            ◈ Logic Fracture
          </span>
          <span className="font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase">
            Hint {hint.hintNumber}/{3}
          </span>
        </div>

        {/* Text */}
        <p className="font-mono text-[var(--text-primary)] text-sm leading-[1.7] min-h-[3rem]">
          {displayed}
          {!done && <span className="animate-pulse">▌</span>}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <span className="text-[0.6rem] font-mono uppercase tracking-widest text-[var(--text-muted)]">Step referenced:</span>
            <motion.span
              className="font-mono text-xs text-[var(--accent-amber)] border border-[var(--accent-amber)] px-1.5 py-0.5 rounded"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ delay: 0.8, duration: 0.3 }}
            >
              {hint.stepReference}
            </motion.span>
          </div>
          <HintRating hintId={hint.id} onRate={(r) => onRate?.(hint.id, r)} />
        </div>
      </div>
    </motion.div>
  );
}
