'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useDryRunStore } from '@/stores/dryRunStore';
import { MAX_VARIABLES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function VariableHeaderManager() {
  const { variableHeaders, addVariableHeader, removeVariableHeader } = useDryRunStore();
  const [input, setInput] = useState('');
  const canAdd = variableHeaders.length < MAX_VARIABLES;

  const handleAdd = () => {
    const name = input.trim();
    if (!name || !canAdd) return;
    addVariableHeader(name);
    setInput('');
  };

  return (
    <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-[var(--border-default)]">
      <span className="text-[var(--text-muted)] text-xs font-mono uppercase tracking-wider mr-1">Variables:</span>
      {variableHeaders.map((h) => (
        <span
          key={h}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs font-mono text-[var(--text-primary)]"
        >
          {h}
          <button
            onClick={() => removeVariableHeader(h)}
            className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors cursor-pointer"
            aria-label={`Remove variable ${h}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      {canAdd && (
        <div className="flex items-center gap-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="add var..."
            className="w-20 h-6 px-2 bg-[var(--bg-sunken)] border border-[var(--border-default)] rounded text-xs font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-steel)]"
          />
          <button
            onClick={handleAdd}
            className={cn(
              'flex items-center justify-center w-6 h-6 rounded',
              'text-[var(--text-muted)] hover:text-[var(--accent-steel)] hover:bg-[var(--accent-ghost)]',
              'transition-all cursor-pointer'
            )}
            aria-label="Add variable"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
