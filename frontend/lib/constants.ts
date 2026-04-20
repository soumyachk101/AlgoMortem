import type { Topic } from '@/types/problem';

export const TOPICS: Topic[] = [
  'arrays', 'strings', 'linked-lists', 'trees',
  'graphs', 'dynamic-programming', 'backtracking', 'two-pointers',
  'sliding-window', 'binary-search', 'heaps', 'tries',
];

export const TOPIC_LABELS: Record<Topic, string> = {
  'arrays': 'Arrays',
  'strings': 'Strings',
  'linked-lists': 'Linked Lists',
  'trees': 'Trees',
  'graphs': 'Graphs',
  'dynamic-programming': 'Dynamic Programming',
  'backtracking': 'Backtracking',
  'two-pointers': 'Two Pointers',
  'sliding-window': 'Sliding Window',
  'binary-search': 'Binary Search',
  'heaps': 'Heaps',
  'tries': 'Tries',
};

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

export const DIFFICULTY_COLORS = {
  easy:   { dot: '#1E7D47', text: '#1E7D47' },
  medium: { dot: '#E8A020', text: '#E8A020' },
  hard:   { dot: '#C0392B', text: '#C0392B' },
};

export const MAX_ANTI_HINTS_PER_ATTEMPT = 3;
export const MAX_STEPS = 30;
export const MAX_VARIABLES = 10;

export const ANTI_HINT_POLL_INTERVAL_MS = 500;
export const ANTI_HINT_POLL_TIMEOUT_MS = 10000;
