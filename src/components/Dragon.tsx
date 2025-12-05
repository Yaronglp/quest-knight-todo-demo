import React from 'react';
import { motion } from 'framer-motion';
import type { Enemy } from '../types/models';

interface DragonProps {
  id: string;
  taskId: string;
  isDefeatable: boolean;
  position: Enemy['position'];
}

/**
 * Dragon enemy component that represents an urgent task
 * Active state: Task incomplete, dragon is threatening
 * Defeatable state: Task completed, dragon can be defeated
 */
export const Dragon: React.FC<DragonProps> = React.memo(({ id, isDefeatable, position }) => {
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
        y: [0, -10, 0],
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        scale: { duration: 0.5, ease: 'backOut' },
        opacity: { duration: 0.5 },
        y: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      <div className="relative">
        {/* Dragon Visual */}
        <motion.div
          className={`text-5xl transition-all duration-500 sm:text-7xl md:text-8xl ${
            isDefeatable
              ? 'opacity-50 grayscale'
              : 'opacity-100 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]'
          }`}
          animate={
            isDefeatable
              ? {}
              : {
                  rotate: [-5, 5, -5],
                }
          }
          transition={{
            rotate: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          🐉
        </motion.div>

        {/* Threat Indicator - Only show when active - ensure boolean (Tip #7) */}
        {isDefeatable === false && (
          <>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-xl shadow-lg shadow-red-500/50">
                ⚠️
              </div>
            </motion.div>

            {/* Glow Effect - Only when active */}
            <motion.div
              className="absolute left-1/2 top-1/2 -z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 opacity-20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 2,
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
              Ready to Battle!
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

Dragon.displayName = 'Dragon';
