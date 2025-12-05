import React from 'react';
import { motion } from 'framer-motion';
import type { Enemy } from '../types/models';

interface GoblinProps {
  id: string;
  taskId: string;
  isDefeatable: boolean;
  position: Enemy['position'];
}

/**
 * Goblin enemy component that represents a non-urgent task
 * Smaller and less threatening than dragons
 * Active state: Task incomplete, goblin is present
 * Defeatable state: Task completed, goblin can be defeated
 */
export const Goblin: React.FC<GoblinProps> = React.memo(({ id, isDefeatable, position }) => {
  return (
    <motion.div
      key={id}
      className="absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        y: [0, -5, 0],
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        scale: { duration: 0.4, ease: 'backOut' },
        opacity: { duration: 0.4 },
        y: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      <div className="relative">
        {/* Goblin Visual - Smaller than dragon */}
        <motion.div
          className={`text-4xl transition-all duration-500 sm:text-5xl ${
            isDefeatable
              ? 'opacity-50 grayscale'
              : 'opacity-100 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]'
          }`}
          animate={
            isDefeatable
              ? {}
              : {
                  rotate: [-3, 3, -3],
                }
          }
          transition={{
            rotate: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          👺
        </motion.div>

        {/* Threat Indicator - Smaller and less intense than dragon - ensure boolean (Tip #7) */}
        {isDefeatable === false && (
          <>
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-sm shadow-lg shadow-yellow-500/40">
                ⚠️
              </div>
            </motion.div>

            {/* Glow Effect - Green tint, less intense than dragon */}
            <motion.div
              className="absolute left-1/2 top-1/2 -z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500 opacity-15 blur-2xl"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </>
        )}

        {/* Defeatable Indicator - ensure boolean (Tip #7) */}
        {isDefeatable === true && (
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded bg-green-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
              Ready!
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

Goblin.displayName = 'Goblin';

