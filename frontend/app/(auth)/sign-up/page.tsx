'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { Spinner } from '@/components/ui/Spinner';
import { Check } from 'lucide-react';

const PERKS = ['200+ problems', 'Anti-hint engine', 'Attempt history', 'Step failure data'];

export default function SignUpPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('All fields required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 800));
    login(email);
    router.push('/problems');
  };

  return (
    <div className="relative flex flex-col min-h-dvh items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(192,57,43,0.07) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm flex flex-col gap-7"
      >
        <div className="text-center flex flex-col items-center gap-2">
          <Link href="/">
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '2.2rem', color: 'var(--text-primary)', display: 'block' }}>
              AlgoMortem
            </span>
          </Link>
          <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">Start dying smarter</p>
        </div>

        {/* Perks */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {PERKS.map((p) => (
            <div key={p} className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-[var(--brand-primary)]" />
              <span className="font-mono text-[0.6rem] text-[var(--text-muted)] uppercase tracking-wider">{p}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-[0_0_60px_rgba(0,0,0,0.4)]">
          {error && (
            <div className="px-3 py-2 rounded border border-[var(--brand-primary)] bg-[var(--brand-glow)] font-mono text-xs text-[var(--brand-primary)]">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--text-muted)]">Email</label>
            <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="h-10 px-3 bg-[var(--bg-sunken)] border border-[var(--border-default)] rounded-md font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
              placeholder="you@example.com" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--text-muted)]">Password</label>
            <input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="h-10 px-3 bg-[var(--bg-sunken)] border border-[var(--border-default)] rounded-md font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
              placeholder="Min. 6 characters" />
          </div>

          <button type="submit" disabled={loading}
            className="h-11 w-full rounded-md font-mono text-sm font-medium bg-[var(--brand-primary)] text-white hover:bg-[#a93226] disabled:opacity-60 transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(192,57,43,0.2)]"
          >
            {loading && <Spinner size="sm" />}
            {loading ? 'Creating account...' : 'Create Free Account'}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--border-default)]" />
            <span className="font-mono text-[0.6rem] text-[var(--text-muted)]">or</span>
            <div className="flex-1 h-px bg-[var(--border-default)]" />
          </div>

          <button type="button" className="h-10 w-full rounded-md border border-[var(--border-default)] font-mono text-xs text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-all duration-150 cursor-pointer">
            Continue with Google
          </button>

          <p className="font-mono text-[0.6rem] text-[var(--text-muted)] text-center leading-relaxed">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="text-[var(--accent-steel)] hover:underline">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-[var(--accent-steel)] hover:underline">Privacy Policy</Link>.
          </p>
        </form>

        <p className="font-mono text-xs text-[var(--text-muted)] text-center">
          Have an account?{' '}
          <Link href="/sign-in" className="text-[var(--accent-steel)] hover:underline">Sign in →</Link>
        </p>
      </motion.div>
    </div>
  );
}
