export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span
          className="text-[var(--text-muted)]"
          style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '0.9rem' }}
        >
          AlgoMortem
        </span>
        <p className="font-mono text-xs text-[var(--text-muted)] text-center">
          We don&apos;t fix your code. We dissect your thinking.
        </p>
        <p className="font-mono text-[0.6rem] text-[var(--text-muted)]">
          © {new Date().getFullYear()} AlgoMortem
        </p>
      </div>
    </footer>
  );
}
