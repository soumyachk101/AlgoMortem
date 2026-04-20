'use client';

interface VariableCellProps {
  value: string;
  locked: boolean;
  stepNumber: number;
  varName: string;
  onChange: (val: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function VariableCell({ value, locked, onChange, onKeyDown }: VariableCellProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      disabled={locked}
      aria-readonly={locked}
      className="w-full h-full px-2 py-1.5 bg-transparent font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none disabled:text-[var(--text-muted)] disabled:cursor-default transition-colors"
      placeholder={locked ? '—' : ''}
    />
  );
}
