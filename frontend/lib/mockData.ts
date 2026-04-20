import type { ProblemListItem, Problem } from '@/types/problem';
import type { AttemptHistoryItem } from '@/types/dryRun';

export const MOCK_PROBLEMS: (ProblemListItem & Problem)[] = [
  {
    id: '1', slug: 'two-sum', title: 'Two Sum', difficulty: 'easy',
    topics: ['arrays', 'two-pointers'],
    statement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    exampleInput: 'nums = [2,7,11,15], target = 9',
    exampleOutput: '[0,1]',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
    commonMistakePatterns: ['Off-by-one in nested loop', 'Forgetting to handle duplicates'],
    attemptCount: 247, breakthroughRate: 0.61, mostFailedStep: 3, createdAt: '2024-01-01',
  },
  {
    id: '2', slug: 'merge-intervals', title: 'Merge Intervals', difficulty: 'medium',
    topics: ['arrays', 'two-pointers'],
    statement: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
    exampleInput: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
    exampleOutput: '[[1,6],[8,10],[15,18]]',
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2'],
    commonMistakePatterns: ['Not sorting first', 'Wrong overlap condition'],
    attemptCount: 193, breakthroughRate: 0.48, mostFailedStep: 2, createdAt: '2024-01-02',
  },
  {
    id: '3', slug: 'lru-cache', title: 'LRU Cache', difficulty: 'hard',
    topics: ['linked-lists', 'arrays'],
    statement: 'Design a data structure that follows the Least Recently Used (LRU) cache constraints.',
    exampleInput: 'LRUCache(2): put(1,1), put(2,2), get(1), put(3,3), get(2)',
    exampleOutput: '[null,null,null,1,null,-1]',
    constraints: ['1 <= capacity <= 3000', '0 <= key <= 10^4', 'At most 2*10^5 calls to get and put.'],
    commonMistakePatterns: ['Forgetting to update on get', 'Wrong node removal order'],
    attemptCount: 312, breakthroughRate: 0.32, mostFailedStep: 5, createdAt: '2024-01-03',
  },
  {
    id: '4', slug: 'binary-search', title: 'Binary Search', difficulty: 'easy',
    topics: ['binary-search', 'arrays'],
    statement: 'Given an array of integers nums sorted in ascending order, find the target using binary search.',
    exampleInput: 'nums = [-1,0,3,5,9,12], target = 9',
    exampleOutput: '4',
    constraints: ['1 <= nums.length <= 10^4', 'All values are unique', 'nums is sorted ascending'],
    commonMistakePatterns: ['Off-by-one on mid calculation', 'Infinite loop from wrong boundary update'],
    attemptCount: 421, breakthroughRate: 0.72, mostFailedStep: 2, createdAt: '2024-01-04',
  },
  {
    id: '5', slug: 'course-schedule', title: 'Course Schedule', difficulty: 'medium',
    topics: ['graphs', 'backtracking'],
    statement: 'There are numCourses courses labeled from 0 to numCourses-1. Given prerequisites, determine if you can finish all courses.',
    exampleInput: 'numCourses = 2, prerequisites = [[1,0]]',
    exampleOutput: 'true',
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000'],
    commonMistakePatterns: ['Not detecting cycles correctly', 'Wrong DFS state transitions'],
    attemptCount: 178, breakthroughRate: 0.41, mostFailedStep: 4, createdAt: '2024-01-05',
  },
  {
    id: '6', slug: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'easy',
    topics: ['dynamic-programming'],
    statement: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?',
    exampleInput: 'n = 3',
    exampleOutput: '3',
    constraints: ['1 <= n <= 45'],
    commonMistakePatterns: ['Base case off-by-one', 'Not seeing the Fibonacci pattern'],
    attemptCount: 509, breakthroughRate: 0.68, mostFailedStep: 1, createdAt: '2024-01-06',
  },
];

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

export const MOCK_ATTEMPTS: AttemptHistoryItem[] = [
  { id: 'a1', problemId: '1', problemTitle: 'Two Sum', problemSlug: 'two-sum', difficulty: 'easy', antiHintsUsed: 2, isComplete: true, breakthroughAt: daysAgo(0), stepIdentified: 3, createdAt: daysAgo(0) },
  { id: 'a2', problemId: '2', problemTitle: 'Merge Intervals', problemSlug: 'merge-intervals', difficulty: 'medium', antiHintsUsed: 3, isComplete: false, breakthroughAt: null, stepIdentified: null, createdAt: daysAgo(2) },
  { id: 'a3', problemId: '3', problemTitle: 'LRU Cache', problemSlug: 'lru-cache', difficulty: 'hard', antiHintsUsed: 1, isComplete: false, breakthroughAt: null, stepIdentified: 5, createdAt: daysAgo(4) },
  { id: 'a4', problemId: '4', problemTitle: 'Binary Search', problemSlug: 'binary-search', difficulty: 'easy', antiHintsUsed: 1, isComplete: true, breakthroughAt: daysAgo(6), stepIdentified: 2, createdAt: daysAgo(6) },
];

const DAYS = 84;
export const MOCK_HEATMAP = Array.from({ length: DAYS }, (_, i) => {
  const d = new Date(now.getTime() - (DAYS - i) * 86400000);
  const rand = Math.random();
  return {
    date: d.toISOString(),
    attempts: rand > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0,
    breakthroughs: rand > 0.85 ? 1 : 0,
  };
});

export const MOCK_TOPIC_STATS = {
  arrays: 8,
  'binary-search': 4,
  'dynamic-programming': 3,
  graphs: 2,
  trees: 5,
  strings: 3,
  'two-pointers': 6,
  heaps: 1,
};
