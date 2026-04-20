# AlgoMortem — UI/UX System

**Version:** 1.0  
**Reference aesthetic:** Clinical, Dark, Post-Mortem — think autopsy table meets developer tool  
**Closest refs:** Linear (density), Sentry (error precision), Radix UI (primitives)  

---

## 1. Design Philosophy

AlgoMortem's visual language communicates a single message: **this is where your thinking ends and clarity begins.**

The aesthetic is **dark clinical** — not scary, not hacker-ish. Like a surgical theater. High contrast. Precise typography. Data-dense. Minimal chrome. Every UI element earns its presence.

The visual hierarchy always points the user toward the dry run canvas. Everything else is negative space.

---

## 2. Color System

```css
:root {
  /* Backgrounds */
  --bg-base:        #080B0F;    /* deepest background — surgical black */
  --bg-surface:     #0E1219;    /* cards, panels */
  --bg-elevated:    #141B24;    /* modals, popovers */
  --bg-sunken:      #060810;    /* input fields */

  /* Borders */
  --border-subtle:  rgba(255,255,255,0.04);
  --border-default: rgba(255,255,255,0.08);
  --border-strong:  rgba(255,255,255,0.14);

  /* Brand — Cold Crimson */
  --brand-primary:  #C0392B;    /* the "where your logic dies" red */
  --brand-dim:      #7B2020;    /* dimmed brand */
  --brand-glow:     rgba(192,57,43,0.15);

  /* Accents */
  --accent-amber:   #E8A020;    /* step numbers, warnings */
  --accent-steel:   #4E9EBF;    /* locked steps, confirmed states */
  --accent-ghost:   #2D3A4A;    /* disabled, placeholder */

  /* Text */
  --text-primary:   #E8EDF2;    /* main content */
  --text-secondary: #8A9BB0;    /* labels, metadata */
  --text-muted:     #4A5568;    /* timestamps, de-emphasized */
  --text-inverse:   #080B0F;    /* text on light surfaces */
  
  /* Semantic */
  --success:        #1E7D47;
  --error:          #C0392B;
  --warning:        #E8A020;
}
```

---

## 3. Typography

### Font Stack
```css
/* Display — for hero, product name, large headings */
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap');

/* Body + UI — clean, technical */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

:root {
  --font-display: 'DM Serif Display', Georgia, serif;
  --font-ui:      'IBM Plex Sans', system-ui, sans-serif;
  --font-mono:    'IBM Plex Mono', 'Fira Code', monospace;
}
```

### Scale
```css
--text-xs:   0.70rem;   /* 11.2px — labels, timestamps */
--text-sm:   0.80rem;   /* 12.8px — secondary UI text */
--text-base: 0.9375rem; /* 15px — body text */
--text-lg:   1.0625rem; /* 17px — card titles */
--text-xl:   1.25rem;   /* 20px — section headers */
--text-2xl:  1.5rem;    /* 24px — page headers */
--text-3xl:  2rem;      /* 32px — display text */
--text-hero: 3.5rem;    /* 56px — landing hero */
```

### Usage
- Product name "AlgoMortem": `var(--font-display)`, italic, `var(--text-hero)`
- Anti-hint text: `var(--font-mono)`, `var(--text-base)`, `var(--brand-primary)` — makes it feel like an error report
- Step numbers: `var(--font-mono)`, `var(--accent-amber)`, small caps
- Problem statement: `var(--font-ui)`, `var(--text-primary)`

---

## 4. Component Library

### 4.1 Logic Canvas (Core Component)
The centrepiece of the product. A split-panel layout:

```
┌──────────────────────────────────────────────────────────┐
│  LOGIC PLAN                  │  DRY RUN TABLE             │
│  ─────────────────────────── │  ──────────────────────    │
│  Freeform text area          │  Step │ var1 │ var2 │ ...  │
│  (markdown-lite)             │  ─────┼──────┼──────┼────  │
│                              │  1 🔒 │  0   │  5   │ ...  │
│                              │  2 🔒 │  1   │  5   │ ...  │
│                              │  3    │ [  ] │ [  ] │ ...  │ ← active
│                              │  + Add Step               │
│                              │                            │
│  [Analyze My Logic]          │                            │
└──────────────────────────────────────────────────────────┘
```

**Logic Plan panel:**
- Dark sunken background (`var(--bg-sunken)`)
- Borderless contenteditable div
- Placeholder text: *"Describe your approach. No code. Just how you're thinking."*
- Subtle left border `3px solid var(--border-default)`

**Dry Run Table:**
- Sticky header row with variable names
- Each row = one step
- Locked rows: steel-blue left border, all inputs disabled, lock icon visible
- Active row: brand-primary left border, inputs focused
- Variables: monospace font in input fields
- "Commit Step" button per row (replaces lock icon after commit)

### 4.2 Anti-Hint Card
Appears below the canvas when triggered. Maximum visual weight.

```
┌──────────────────────────────────────────────────────────┐
│  ◈  LOGIC FRACTURE — HINT 1/3                            │
│  ─────────────────────────────────────────────────────── │
│                                                           │
│  "At Step 4, your pointer values are [left=2, right=4].  │
│   What is the loop condition you wrote in Step 1 —       │
│   and does it hold for these values?"                    │
│                                                           │
│  ─────────────────────────────────────────────────────── │
│  Step referenced: 4    |    Rated this: ○ ○ ○ ○ ○        │
└──────────────────────────────────────────────────────────┘
```

- Background: `var(--bg-elevated)` with left border `4px solid var(--brand-primary)`
- Header: `◈ LOGIC FRACTURE` in `var(--font-mono)` small caps, `var(--brand-primary)`
- Anti-hint text: `var(--font-mono)`, `var(--text-primary)`, `1.6` line height
- Entry animation: slides up from bottom, left border "draws" from top to bottom (1.2s ease)
- Step reference badge: amber, monospace

### 4.3 Problem Card (Library View)
```
┌────────────────────────────────────┐
│  ●  TWO SUM                  EASY  │
│  ─────────────────────────────     │
│  Arrays · Hash Map                 │
│                                    │
│  247 attempts · 61% breakthrough   │
│  Most fail: Step 3                 │
└────────────────────────────────────┘
```
- Difficulty dot: green/amber/red
- Monospace metadata
- Hover: slight elevation `translateY(-2px)`, border intensifies
- "Most fail: Step N" — this is the killer feature display, shown in amber

### 4.4 Attempt History Row
```
Two Sum                 Oct 12  ·  Step 3 identified  ·  2 hints  ·  Breakthrough ✦
Merge Intervals         Oct 10  ·  Abandoned           ·  3 hints  ·  ─
```
- Timeline view, monospace
- Breakthrough marked with `✦` in brand-primary
- Click to view frozen dry run (read-only)

### 4.5 Rate Limit Badge
When user has used 2/3 hints:
```
[ 2/3 ANALYSIS USED · 1 REMAINING ]
```
Small, amber, top of canvas. When 3/3: turns red. Adds weight to the decision.

---

## 5. Page Layouts

### 5.1 Landing Page
**Hero section:**
- Full viewport, `var(--bg-base)` background with subtle noise texture (SVG filter)
- "AlgoMortem" in `var(--font-display)` italic, massive, slight letter-spacing
- Tagline: *"We don't fix your code. We dissect your thinking."*
- Subtext: *"The AI that never gives you the answer."* in monospace
- CTA button: "Start dying smarter" — this is the button copy, non-negotiable
- Below the fold: 3-step process animation (Write Logic → Dry Run → Get Dissected)

**Social proof:**
- "Step failure heatmaps" from crowd data — shown as a live-looking table
- Example anti-hint displayed in a mock anti-hint card (animated in)

### 5.2 Problem Library
- Full-width grid: 3 columns on desktop, 1 on mobile
- Filter bar: Topics (chips) + Difficulty (tabs)
- Sort: "Most failed" / "Newest" / "Most attempted"
- Search: monospace input, searches title and topic

### 5.3 Problem Workspace
- Minimal chrome: just problem title + topic in header
- Main: split-panel Logic Canvas (60% width dry run, 40% logic plan)
- Right sidebar (collapsible): Problem statement
- Bottom: Anti-hint zone (slides up when triggered)
- No navigation distractions while in workspace

### 5.4 Profile / Dashboard
- Attempt heatmap (GitHub-style, but cells colored by breakthrough vs abandoned)
- Topic radar chart: shows strength/weakness across 8 topics
- Streak counter: monospace "14 day streak" with geometric accent
- Recent attempts list

---

## 6. Micro-Interactions

### Step Locking Animation
When user commits a step:
1. Row background briefly flashes steel-blue (`200ms ease`)
2. Input fields fade to readonly mode (`300ms`)
3. Lock icon fades in from left with `scale(0) → scale(1)` (`250ms spring`)
4. Step number transitions from white to amber

### Anti-Hint Reveal
1. Card slides up from `translateY(32px)` with `opacity: 0 → 1` (`400ms ease-out`)
2. Left border "grows" from 0 to full height (`600ms ease` on a pseudo-element)
3. Text streams in character by character (typing effect, 30ms per char)
4. Step reference badge pulses once (`scale: 1 → 1.05 → 1`)

### "Analyze My Logic" Button
- Default: subtle glow, text "Analyze My Logic"
- Loading: spinner + "Dissecting..." text
- Rate limit approaching (2/3 used): amber border, subtle pulse

### Hint Counter
- Background fills left to right as hints are used
- At 3/3: border turns red, button disabled, text changes to "Analysis exhausted. Keep going alone."

---

## 7. Empty States

**No attempts yet:**
```
 ◈
 
 Your first dry run is a flat line.
 Pick a problem and start bleeding.
 
 [Browse Problems →]
```

**No logic plan entered:**
```
 Don't write code. Write what you're thinking.
 The canvas is watching.
```

---

## 8. Responsive Breakpoints

```css
--bp-mobile:  375px;
--bp-tablet:  768px;
--bp-desktop: 1280px;
--bp-wide:    1600px;
```

On mobile, the Logic Canvas stacks vertically (Logic Plan on top, Dry Run table below). The dry run table scrolls horizontally for wide variable sets.

---

## 9. Accessibility

- All interactive elements meet WCAG AA contrast ratio (4.5:1 minimum)
- Keyboard navigation fully supported in dry run table (Tab between cells, Enter to commit step)
- `aria-live` region for anti-hint card (screen readers announce when hint appears)
- Locked steps have `aria-readonly="true"` and `aria-label="Step {N} — locked"`
- No animations for `prefers-reduced-motion: reduce` users
