'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: "Why doesn't AlgoMortem ever give me the answer?",
    a: "Because the answer is not the point. When an AI hands you a solution, you copy it and learn nothing. When you're forced to find the contradiction in your own logic, you build a durable mental model. The constraint is the product.",
  },
  {
    q: 'What is an Anti-Hint exactly?',
    a: 'An anti-hint references a specific step in your dry run and asks a Socratic question about it. It never uses the words: solve, answer, correct, try, algorithm, or pattern. It leaves at least 3 possible interpretations of what you might need to fix. It is the opposite of a hint — it creates productive confusion.',
  },
  {
    q: 'What is a "dry run" in this context?',
    a: 'A dry run is a step-by-step trace of how an algorithm would execute on a specific input. You define the variables that matter, then fill in their values at each step. It is how engineers mentally simulate code without running it.',
  },
  {
    q: "Why are steps locked once I commit them?",
    a: "Retroactively editing your dry run after seeing the anti-hint defeats the entire purpose. The immutability is backend-enforced, not just UI. It mirrors how real problem-solving works: you cannot undo your mental state before reading a hint.",
  },
  {
    q: "What if I'm completely stuck even after 3 anti-hints?",
    a: "There is no \"I give up\" button. There is no solution reveal. That is an explicit non-goal of the product. You can start a new attempt with a different approach. Your previous attempt is preserved so you can compare them. This is uncomfortable. It is meant to be.",
  },
  {
    q: 'Is this for beginners?',
    a: "No. This is for people who have done 50–150 problems and hit a ceiling. People who realize that editorial copy-paste culture isn't actually teaching them. If you're just starting DSA, learn the basics first.",
  },
  {
    q: "How is this different from just using ChatGPT?",
    a: "ChatGPT will give you the solution. If you ask it not to, it gives you a guided walkthrough that still collapses the solution space. AlgoMortem's Anti-Hint Engine is architecturally constrained to never produce code and never suggest the algorithm — this is enforced at the model prompt level with explicit rejection criteria.",
  },
];

function FAQItem({ item, index }: { item: typeof FAQS[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="border-b border-[var(--border-default)] last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-start justify-between w-full py-5 gap-4 text-left group cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-mono text-sm text-[var(--text-primary)] group-hover:text-white transition-colors leading-relaxed pr-2">
          {item.q}
        </span>
        <span className="mt-0.5 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] transition-colors">
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-[var(--text-secondary)] leading-relaxed">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="faq" className="py-28 px-6 border-t border-[var(--border-default)]">
      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--brand-primary)]">FAQ</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text-primary)', lineHeight: 1.15 }}>
            Questions you&apos;re about to have.
          </h2>
        </motion.div>

        <div>
          {FAQS.map((f, i) => <FAQItem key={i} item={f} index={i} />)}
        </div>
      </div>
    </section>
  );
}
