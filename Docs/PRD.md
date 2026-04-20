# AlgoMortem: We don't fix your code. We dissect your thinking.

## 1. Product Summary
**AlgoMortem** is an AI-powered educational platform that helps developers master algorithmic thinking by focusing on **logical post-mortems**. Unlike LeetCode (code output verification) or ChatGPT (answer generation), AlgoMortem forces the user to manually dry-run their logic step-by-step and uses AI to identify exactly *where* and *why* their mental model failed.

## 2. The Core Problem
Most developers fail technical interviews not because they don't know syntax, but because they have **Logic Blind Spots**. 
- They jump into coding before having a solid plan.
- They don't realize their logic fails for edge cases until they run it.
- When they look at a solution, they understand the code but don't learn how to *reach* that logic themselves.

## 3. The Solution: "Anti-Hints" & "Logic Canvas"
- **Logic Canvas**: A structured spreadsheet/grid where users must trace variables through their proposed algorithm *before* writing a single line of code.
- **Anti-Hints**: AI that observes your dry-run and gives hints that point to logical inconsistencies (e.g., \"Your 'j' pointer stayed at index 5 for two steps, but your logic says it should increment. Why?\") rather than giving away the algorithm.
- **Mortem Report**: A final analysis of your breakthrough. Did you find the error? Was it a fence-post error? A boundary condition?

## 4. Key Personas
- **The Grinder**: Has done 500 LeetCode problems but still fails unseen problems.
- **The Student**: Learning DSA for the first time and needs to visualize how pointers move.
- **The Interviewer**: Wants to see a candidate's step-by-step thinking process.

## 5. Main User Flow
1. **Selection**: User picks a problem (e.g., \"Two Sum\", \"Rainwater Trapping\").
2. **The Logic Plan**: User describes their approach in plain text or pseudocode.
3. **The Dry-Run**:
   - User defines variables (e.g., `left`, `right`, `current_sum`).
   - User fills out a table row for each step of the algorithm execution on a provided example.
4. **AI Interjection**: If the user makes a manual error in the dry-run OR if their dry-run reveals a logic flaw in their plan, the AI issues an \"Anti-Hint\".
5. **Breakthrough**: Once the user successfully dry-runs the *correct* logic, they are prompted to write the code.
6. **Post-Mortem**: Analysis of how many \"mental retakes\" they needed.

## 6. Success Metrics
- **Logic Retention**: Users solve similar problems faster without hints.
- **Mental Speed**: Reduced time taken to identify logic errors.
- **The \"Aha!\" Moment**: Users report higher satisfaction from finding their own errors than being told the answer.
