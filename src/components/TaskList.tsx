import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { TaskCard } from './TaskCard';

export const TaskList: React.FC = React.memo(() => {
  // Use selector to only re-render when tasks change
  const tasks = useGameStore((state) => state.tasks);
  const battleActive = useGameStore((state) => state.battle.isActive);

  // Separate active and completed tasks - memoized to prevent recalculation
  const activeTasks = useMemo(() => tasks.filter((task) => task.status === 'todo'), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((task) => task.status === 'done'), [tasks]);

  // Empty state - use CSS :empty pseudo-class (Tip #13)
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-dark-700 bg-dark-800 p-8 text-center empty:block">
        <div className="text-4xl">⚔️</div>
        <p className="mt-3 font-fantasy text-lg text-primary-400">Create your first quest!</p>
        <p className="mt-1 text-sm text-dark-400">
          Your adventure begins with a single task
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Tasks */}
      <div>
        <h3 className="mb-3 font-fantasy text-lg font-semibold text-primary-400">
          Active Quests ({activeTasks.length})
        </h3>
        <div className="min-h-[60px] space-y-3">
          <AnimatePresence initial={false}>
            {activeTasks.map((task) => (
              <motion.div
                key={task.id}
                layout="position"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ 
                  opacity: { duration: 0.2 },
                  height: { duration: 0.2 },
                  layout: { duration: 0.3, ease: 'easeInOut' }
                }}
              >
                <TaskCard task={task} />
              </motion.div>
            ))}
          </AnimatePresence>
          {/* Use CSS :empty pseudo-class for empty states (Tip #13) */}
          {activeTasks.length === 0 && battleActive === false && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border-2 border-dashed border-dark-700 bg-dark-800/50 p-4 text-center text-sm text-dark-400 empty:block"
            >
              No active quests
            </motion.div>
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      <div>
        <h3 className="mb-3 font-fantasy text-lg font-semibold text-dark-400">
          Completed ({completedTasks.length})
        </h3>
        <div className="min-h-[60px] space-y-3">
          <AnimatePresence initial={false}>
            {completedTasks.map((task) => (
              <motion.div
                key={task.id}
                layout="position"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ 
                  opacity: { duration: 0.2 },
                  height: { duration: 0.2 },
                  layout: { duration: 0.3, ease: 'easeInOut' }
                }}
              >
                <TaskCard task={task} />
              </motion.div>
            ))}
          </AnimatePresence>
          {completedTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border-2 border-dashed border-dark-700 bg-dark-800/50 p-4 text-center text-sm text-dark-400 empty:block"
            >
              No completed quests
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
});

TaskList.displayName = 'TaskList';

