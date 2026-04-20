'use client';

import { useRef } from 'react';
import { useDryRunStore } from '@/stores/dryRunStore';

interface LogicPlanEditorProps {
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

export function LogicPlanEditor({ readOnly, onChange }: LogicPlanEditorProps) {
  const { logicPlan, setLogicPlan } = useDryRunStore();
  const ref = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    const text = ref.current?.innerText ?? '';
    setLogicPlan(text);
    onChange?.(text);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2.5 border-b border-[var(--border-default)] flex items-center gap-2">
        <span className="text-[0.6rem] font-mono uppercase tracking-widest text-[var(--text-muted)]">Logic Plan</span>
        {readOnly && (
          <span className="text-[0.6rem] font-mono uppercase tracking-widest text-[var(--accent-steel)] ml-auto">Read Only</span>
        )}
      </div>
      <div
        ref={ref}
        role="textbox"
        aria-label="Logic plan editor — describe your approach, no code"
        aria-multiline="true"
        contentEditable={!readOnly}
        suppressContentEditableWarning
        onInput={handleInput}
        className="flex-1 px-4 py-3 text-[var(--text-primary)] text-sm leading-relaxed font-[var(--font-ui)] focus:outline-none overflow-y-auto empty:before:content-[attr(data-placeholder)] before:text-[var(--text-muted)] before:pointer-events-none"
        data-placeholder="Describe your approach. No code. Just how you're thinking."
        style={{
          borderLeft: '3px solid var(--border-default)',
          background: 'var(--bg-sunken)',
          minHeight: 0,
          whiteSpace: 'pre-wrap',
        }}
        dangerouslySetInnerHTML={readOnly ? { __html: logicPlan.replace(/\n/g, '<br>') } : undefined}
      />
    </div>
  );
}
