export type Difficulty = 'easy' | 'medium' | 'hard';

export type Topic =
  | 'arrays' | 'strings' | 'linked-lists' | 'trees'
  | 'graphs' | 'dynamic-programming' | 'backtracking' | 'two-pointers'
  | 'sliding-window' | 'binary-search' | 'heaps' | 'tries';

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  topics: Topic[];
  statement: string;
  exampleInput: string;
  exampleOutput: string;
  constraints: string[];
  commonMistakePatterns: string[];
  attemptCount: number;
  breakthroughRate: number;
  mostFailedStep: number | null;
  createdAt: string;
}

export interface ProblemListItem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  topics: Topic[];
  attemptCount: number;
  breakthroughRate: number;
  mostFailedStep: number | null;
}
