export interface AntiHint {
  id: string;
  dryRunId: string;
  hintNumber: number;
  text: string;
  stepReference: number;
  rating: number | null;
  createdAt: string;
}

export interface AntiHintTaskStatus {
  taskId: string;
  status: 'pending' | 'running' | 'done' | 'error';
  result?: AntiHint;
  error?: string;
}
