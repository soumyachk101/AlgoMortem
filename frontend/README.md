# AlgoMortem Frontend

This is the Next.js frontend for AlgoMortem.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS 4
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure
- `/app`: Pages and layouts.
- `/components`: UI and feature-specific components.
- `/lib`: Utilities, API clients, and shared logic.
- `/stores`: Zustand state stores.
- `/types`: TypeScript interfaces and types.
- `/public`: Static assets.

## Core Features
- **Logic Canvas**: Interactive grid for step-by-step algorithm dry-runs.
- **Anti-Hints**: Real-time AI feedback on logical inconsistencies.
- **Problem Dashboard**: Track your "Breakthrough Rate" and mental retakes.
