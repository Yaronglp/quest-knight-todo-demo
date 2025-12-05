// Shared type definitions for the Quest Knight application

export interface Task {
  id: string;
  title: string;
  description?: string;
  urgency: 'urgent' | 'normal';
  status: 'todo' | 'done';
  createdAt: number;
}

export interface Player {
  level: number;
  xp: number;
}

export interface Enemy {
  id: string;
  taskId: string;
  type: 'dragon' | 'goblin';
  position: { x: number; y: number };
}
