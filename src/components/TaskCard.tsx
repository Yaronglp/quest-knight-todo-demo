import React from 'react';
import type { Task } from '../types/models';
import { useGameStore } from '../store/gameStore';
import { XP_REWARDS } from '../utils/constants';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = React.memo(({ task }) => {
  const toggleTaskStatus = useGameStore((state) => state.toggleTaskStatus);

  // Derive values from props (Tip #28: never create state for derived values)
  const isUrgent = task.urgency === 'urgent';
  const isDone = task.status === 'done';

  return (
    <div
      className={`rounded-lg border-2 p-4 transition-all ${
        isUrgent
          ? 'border-primary-500 bg-primary-950 bg-opacity-20'
          : 'border-secondary-600 bg-secondary-950 bg-opacity-20'
      } ${isDone ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {/* Title */}
          <div className="mb-1 flex items-center gap-2">
            {isUrgent ? (
              <span className="text-primary-500" aria-label="Urgent - Dragon">🐉</span>
            ) : (
              <span className="text-green-500" aria-label="Normal - Goblin">👺</span>
            )}
            <h3
              className={`font-semibold ${
                isDone ? 'text-dark-400 line-through' : 'text-dark-100'
              }`}
            >
              {task.title}
            </h3>
          </div>

          {/* Description - ensure boolean check (Tip #7) */}
          {task.description !== undefined && task.description !== '' && (
            <p
              className={`text-sm ${
                isDone ? 'text-dark-500 line-through' : 'text-dark-300'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Status Badge */}
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                isUrgent
                  ? 'bg-red-900 text-red-300 border border-red-700'
                  : 'bg-green-900 text-green-300 border border-green-700'
              }`}
            >
              {isUrgent ? `URGENT • ${XP_REWARDS.URGENT_TASK} XP` : `NORMAL • ${XP_REWARDS.NORMAL_TASK} XP`}
            </span>
            {isDone === true && (
              <span className="inline-block rounded bg-dark-700 px-2 py-0.5 text-xs font-medium text-dark-300">
                ✓ Completed
              </span>
            )}
          </div>
        </div>

        {/* Complete Button */}
        <button
          onClick={() => toggleTaskStatus(task.id)}
          className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
            isDone
              ? 'bg-dark-700 text-dark-300 hover:bg-dark-600'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
          aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isDone ? 'Undo' : 'Complete'}
        </button>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

