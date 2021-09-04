export type TaskType = 'LONG' | 'SHORT' | 'MEDIUM';

export type TaskPriority = 'CRITICAL' | 'MAJOR' | 'MODERATE' | 'LOW';

export class NewTaskDto {
  id: number;
  name: string;
  description: string;
  userId: number;
  type: TaskType;
  priority: TaskPriority;
  createdAt: number;
  finishedAt?: number;
}
