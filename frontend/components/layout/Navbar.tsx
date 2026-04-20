'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();


  const navHeight = useTransform(scrollY, [0, 80], [72, 52]);
  const logoSize = useTransform(scrollY, [0, 80], [1.35, 1.05]);
  const bgOpacity = useTransform(scrollY, [0, 60], [0, 1]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ height: navHeight }}
    >
      {/* Blur bg that appears on scroll */}
      <motion.div
        className="absolute inset-0 border-b border-[var(--border-default)]"
        style={{
          opacity: bgOpacity,
          backgroundColor: 'rgba(8,11,15,0.92)',
          backdropFilter: 'blur(12px)',
        }}
      />

      <nav className="relative max-w-7xl mx-auto px-6 h-full flex items-center justify-between" aria-label="Main navigation">
        {/* Logo */}
        <Link href="/" className="focus-visible:outline-none">
          <motion.span
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              fontSize: logoSize,
              display: 'block',
              lineHeight: 1,
            }}
          >
            AlgoMortem
          </motion.span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/problems" className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-150">
            Problems
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard" className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-150">
              Dashboard
            </Link>
          )}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[var(--text-muted)]">{user?.name}</span>
              <button
                onClick={logout}
                className="inline-flex items-center h-8 px-3 rounded border border-[var(--border-default)] font-mono text-xs text-[var(--text-secondary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in" className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center h-8 px-4 rounded bg-[var(--brand-primary)] font-mono text-xs text-white hover:bg-[#a93226] transition-all duration-150 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 bg-[var(--bg-surface)] border-b border-[var(--border-default)] px-6 py-4 flex flex-col gap-4"
        >
          <Link href="/problems" className="font-mono text-sm text-[var(--text-secondary)]" onClick={() => setMenuOpen(false)}>Problems</Link>
          {isLoggedIn && <Link href="/dashboard" className="font-mono text-sm text-[var(--text-secondary)]" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
          {isLoggedIn
            ? <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left font-mono text-sm text-[var(--brand-primary)] cursor-pointer">Sign Out</button>
            : <>
                <Link href="/sign-in" className="font-mono text-sm text-[var(--text-secondary)]" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link href="/sign-up" className="font-mono text-sm text-white bg-[var(--brand-primary)] px-4 py-2 rounded text-center" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </>
          }
        </motion.div>
      )}
    </motion.header>
  );
}
