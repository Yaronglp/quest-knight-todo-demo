import React, { useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { XP_REWARDS } from '../utils/constants';
import type { Task } from '../types/models';

// Move constants outside component (Tip #10: move data that doesn't rely on props/state outside)
const DEFAULT_URGENCY: Task['urgency'] = 'normal';

export const TaskForm: React.FC = React.memo(() => {
  // Group all state at the top (Tip #14)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<Task['urgency']>(DEFAULT_URGENCY);
  const [isOpen, setIsOpen] = useState(false);

  const addTask = useGameStore((state) => state.addTask);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // Validation: title is required
    if (!title.trim()) {
      return;
    }

    // Add task to store
    addTask(title.trim(), description.trim(), urgency);

    // Reset form - use function form for state updates (Tip #31: update state based on previous state)
    setTitle(() => '');
    setDescription(() => '');
    setUrgency(() => DEFAULT_URGENCY);
    setIsOpen(() => false);
  }, [addTask, title, description, urgency]);

  const handleCancel = useCallback(() => {
    setTitle(() => '');
    setDescription(() => '');
    setUrgency(() => DEFAULT_URGENCY);
    setIsOpen(() => false);
  }, []);

  // Use value === case pattern (Tip #18)
  if (isOpen === false) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-lg border-2 border-dashed border-primary-500 bg-dark-800 px-4 py-3 text-primary-400 transition-colors hover:border-primary-400 hover:bg-dark-700"
        aria-label="Create new quest"
      >
        <span className="text-lg font-fantasy">+ New Quest</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border-2 border-primary-500 bg-dark-800 p-4">
      <h3 className="mb-4 font-fantasy text-lg font-semibold text-primary-400">
        Create New Quest
      </h3>

      {/* Title Input */}
      <div className="mb-3">
        <label htmlFor="task-title" className="mb-1 block text-sm font-medium text-dark-200">
          Title <span className="text-primary-500">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter quest title..."
          className="w-full rounded border border-dark-600 bg-dark-900 px-3 py-2 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          autoFocus
        />
      </div>

      {/* Description Input */}
      <div className="mb-3">
        <label htmlFor="task-description" className="mb-1 block text-sm font-medium text-dark-200">
          Description
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter quest details... (optional)"
          rows={3}
          className="w-full rounded border border-dark-600 bg-dark-900 px-3 py-2 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {/* Urgency Toggle */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-dark-200">Urgency Level</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setUrgency('normal')}
            className={`flex flex-col items-center gap-1 rounded-lg border-2 px-4 py-3 font-medium transition-all ${
              urgency === 'normal'
                ? 'border-green-600 bg-green-900 bg-opacity-30 text-white shadow-lg shadow-green-900/50'
                : 'border-dark-700 bg-dark-700 text-dark-300 hover:border-dark-600 hover:bg-dark-600'
            }`}
            aria-pressed={urgency === 'normal'}
          >
            <span className="text-2xl">👺</span>
            <span className="text-sm">Normal</span>
            <span className="text-xs text-dark-400">Goblin • {XP_REWARDS.NORMAL_TASK} XP</span>
          </button>
          <button
            type="button"
            onClick={() => setUrgency('urgent')}
            className={`flex flex-col items-center gap-1 rounded-lg border-2 px-4 py-3 font-medium transition-all ${
              urgency === 'urgent'
                ? 'border-red-600 bg-red-900 bg-opacity-30 text-white shadow-lg shadow-red-900/50'
                : 'border-dark-700 bg-dark-700 text-dark-300 hover:border-dark-600 hover:bg-dark-600'
            }`}
            aria-pressed={urgency === 'urgent'}
          >
            <span className="text-2xl">🐉</span>
            <span className="text-sm">Urgent</span>
            <span className="text-xs text-dark-400">Dragon • {XP_REWARDS.URGENT_TASK} XP</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
          <button
            type="submit"
            disabled={title.trim() === ''}
            className="flex-1 rounded bg-primary-600 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary-600"
          >
            Create Quest
          </button>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded bg-dark-700 px-4 py-2 font-medium text-dark-300 transition-colors hover:bg-dark-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
});

TaskForm.displayName = 'TaskForm';

