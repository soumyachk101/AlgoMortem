'use client';

import { useEffect, useRef, useState } from 'react';

const MOCK_TEXT = `At Step 4, your pointer values are [left=2, right=4]. What is the loop condition you wrote in Step 1 — and does it hold for these values?`;

export function AntiHintCardMock() {
  const [displayed, setDisplayed] = useState('');
  const iRef = useRef(0);

  useEffect(() => {
    iRef.current = 0;
    const id = setInterval(() => {
      iRef.current += 1;
      setDisplayed(MOCK_TEXT.slice(0, iRef.current));
      if (iRef.current >= MOCK_TEXT.length) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)]">
      <div className="absolute left-0 top-0 w-1 h-full bg-[var(--brand-primary)] rounded-l" />
      <div className="pl-5 pr-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--brand-primary)] font-medium">◈ Logic Fracture</span>
          <span className="font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase">Hint 1/3</span>
        </div>
        <p className="font-mono text-[var(--text-primary)] text-sm leading-[1.7] min-h-[4rem]">
          {displayed}
          {displayed.length < MOCK_TEXT.length && <span className="animate-pulse">▌</span>}
        </p>
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[var(--border-subtle)]">
          <span className="text-[0.6rem] font-mono uppercase tracking-widest text-[var(--text-muted)]">Step referenced:</span>
          <span className="font-mono text-xs text-[var(--accent-amber)] border border-[var(--accent-amber)] px-1.5 py-0.5 rounded">4</span>
        </div>
      </div>
    </div>
  );
}
