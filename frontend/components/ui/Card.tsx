import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className, hoverable }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg',
        hoverable && 'transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
