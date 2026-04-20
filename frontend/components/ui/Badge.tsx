import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'amber' | 'steel' | 'brand' | 'success' | 'muted';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'border-[var(--border-default)] text-[var(--text-secondary)]',
    amber:   'border-[var(--accent-amber)] text-[var(--accent-amber)]',
    steel:   'border-[var(--accent-steel)] text-[var(--accent-steel)]',
    brand:   'border-[var(--brand-primary)] text-[var(--brand-primary)]',
    success: 'border-[var(--success)] text-[var(--success)]',
    muted:   'border-[var(--border-subtle)] text-[var(--text-muted)]',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center border px-1.5 py-0.5 rounded text-[0.65rem] font-mono tracking-wider uppercase',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
