import React from 'react';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';

/**
 * Task list area containing task form and list
 */
export const TaskListArea: React.FC = React.memo(() => {
  return (
    <div className="lg:col-span-1">
      <div className="space-y-4 rounded-lg border-2 border-dark-700 bg-dark-800 p-6 shadow-xl">
        <h2 className="mb-4 font-fantasy text-2xl font-semibold text-primary-400">
          Quests
        </h2>

        {/* Task Creation Form */}
        <TaskForm />

        {/* Task List */}
        <div className="mt-6">
          <TaskList />
        </div>
      </div>
    </div>
  );
});

TaskListArea.displayName = 'TaskListArea';

