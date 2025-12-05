import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Knight } from './Knight';
import { Dragon } from './Dragon';
import { Goblin } from './Goblin';
import { useGameStore } from '../store/gameStore';
import type { Enemy } from '../types/models';

/**
 * Game area containing knight character and enemy entities
 */
export const GameArea: React.FC = React.memo(() => {
  // Group all state and context at the top (Tip #14)
  const enemies = useGameStore((state) => state.enemies);
  const tasks = useGameStore((state) => state.tasks);
  const battle = useGameStore((state) => state.battle);

  return (
    <div className="lg:col-span-2">
      <div 
        className="relative min-h-[400px] overflow-hidden rounded-lg border-2 border-dark-700 bg-dark-800 p-4 shadow-xl sm:min-h-[500px] sm:p-8"
        role="region"
        aria-label="Game area"
        aria-live="polite"
        aria-atomic="false"
      >
        {/* Knight Character - Interactive when not in battle - ensure boolean (Tip #7) */}
        {battle.isActive === false && (
          <Knight 
            isInBattle={false} 
            interactive
          />
        )}
        
        {/* Enemies (Dragons and Goblins) */}
        <AnimatePresence>
          {enemies.length > 0 && enemies.map((enemy: Enemy) => {
            // Hide enemy if it's currently in battle (Tip #18: use === for cases)
            if (battle.isActive === true && battle.enemyId === enemy.id) {
              return null;
            }

            // Find associated task to check if defeatable
            const task = tasks.find((t) => t.id === enemy.taskId);
            const isDefeatable = task?.status === 'done';

            // Use value === case pattern (Tip #18)
            if (enemy.type === 'dragon') {
              return (
                <Dragon
                  key={enemy.id}
                  id={enemy.id}
                  taskId={enemy.taskId}
                  position={enemy.position}
                  isDefeatable={isDefeatable === true}
                />
              );
            }
            
            if (enemy.type === 'goblin') {
              return (
                <Goblin
                  key={enemy.id}
                  id={enemy.id}
                  taskId={enemy.taskId}
                  position={enemy.position}
                  isDefeatable={isDefeatable === true}
                />
              );
            }
            
            return null;
          })}
        </AnimatePresence>

        {/* Empty state when no enemies - ensure boolean check (Tip #7) */}
        {enemies.length === 0 && (
          <div className="flex h-full min-h-[400px] items-center justify-center sm:min-h-[500px]">
            <div className="text-center">
              <p className="mb-2 font-fantasy text-3xl text-primary-400">⚔️</p>
              <p className="text-sm text-dark-300 sm:text-base">Create a task to spawn an enemy!</p>
              <p className="mt-2 text-xs text-dark-400 sm:text-sm">Urgent tasks spawn dragons 🐉</p>
              <p className="text-xs text-dark-400 sm:text-sm">Normal tasks spawn goblins 👺</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

GameArea.displayName = 'GameArea';

