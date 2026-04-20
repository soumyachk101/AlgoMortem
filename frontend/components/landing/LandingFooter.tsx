import Link from 'next/link';

const LINKS = {
  Product: [
    { label: 'Problems', href: '/problems' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border-default)] pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-4">
            <Link href="/">
              <span
                style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.5rem', color: 'var(--text-primary)' }}
              >
                AlgoMortem
              </span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs">
              The anti-hint learning platform. We don&apos;t fix your code. We dissect your thinking.
            </p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" />
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--text-muted)]">
                The AI that never gives you the answer
              </span>
            </div>
            {/* Pricing tiers */}
            <div className="flex flex-col gap-2 mt-2 p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)]">
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--text-muted)] mb-1">Pricing</span>
              {[
                { tier: 'Free', price: '$0', note: '5 problems/week' },
                { tier: 'Pro', price: '$12/mo', note: 'Unlimited' },
                { tier: 'Team', price: '$49/mo', note: 'Per cohort' },
              ].map((t) => (
                <div key={t.tier} className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--text-primary)]">{t.tier}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[0.6rem] text-[var(--text-muted)]">{t.note}</span>
                    <span className="font-mono text-xs text-[var(--accent-amber)]">{t.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section} className="flex flex-col gap-3">
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--text-muted)]">{section}</span>
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--border-subtle)]">
          <span className="font-mono text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider">
            © {new Date().getFullYear()} AlgoMortem. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[0.6rem] text-[var(--text-muted)]">Built for thinkers. Not copiers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
