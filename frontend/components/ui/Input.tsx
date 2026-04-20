import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-[var(--text-secondary)] text-xs font-mono uppercase tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'h-9 px-3 rounded bg-[var(--bg-sunken)] border border-[var(--border-default)]',
            'text-[var(--text-primary)] font-mono text-sm',
            'placeholder:text-[var(--text-muted)]',
            'focus:border-[var(--brand-primary)] focus:outline-none',
            'transition-colors duration-150',
            error && 'border-[var(--brand-primary)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-[var(--error)] text-xs font-mono">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
