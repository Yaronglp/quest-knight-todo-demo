import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

/**
 * Shows a celebration notification when the player levels up
 */
export const LevelUpNotification: React.FC = React.memo(() => {
  // Group all state and context at the top (Tip #14)
  const level = useGameStore((state) => state.player.level);
  const [showNotification, setShowNotification] = useState(false);
  const [displayLevel, setDisplayLevel] = useState(level);
  const prevLevelRef = useRef(level);
  
  const handleDismiss = useCallback(() => {
    setShowNotification(false);
  }, []);

  useEffect(() => {
    const previousLevel = prevLevelRef.current;
    
    // Detect level up - use function form for state updates (Tip #31)
    if (level > previousLevel) {
      console.log(`[LevelUpNotification] Level up detected: ${previousLevel} → ${level}`);
      setDisplayLevel(() => level);
      setShowNotification(() => true);

      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        setShowNotification(() => false);
      }, 3000);

      // Always update ref to track current level
      prevLevelRef.current = level;

      return () => clearTimeout(timer);
    }
    
    // Always update ref to current level for next check
    prevLevelRef.current = level;
  }, [level]);

  return (
    <AnimatePresence>
      {showNotification === true && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
        >
          <motion.div
            className="relative rounded-2xl border-4 border-primary-500 bg-gradient-to-br from-dark-800 to-dark-900 p-8 shadow-2xl"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 -z-10 rounded-2xl bg-primary-500 opacity-50 blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Content */}
            <div className="text-center">
              <motion.div
                className="mb-4 text-6xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              >
                🎉
              </motion.div>

              <h2 className="mb-2 font-fantasy text-4xl font-bold text-primary-400">LEVEL UP!</h2>

              {/* Level Badge */}
              <motion.div
                className="mb-4 flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', duration: 0.8 }}
              >
                <div className="relative">
                  {/* Medal/Badge Background */}
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary-500 bg-gradient-to-br from-amber-400 via-primary-500 to-amber-600 shadow-2xl">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-amber-300 bg-gradient-to-br from-primary-600 to-primary-800">
                      <span className="font-fantasy text-5xl font-bold text-amber-100 drop-shadow-lg">
                        {displayLevel}
                      </span>
                    </div>
                  </div>
                  
                  {/* Trophy Icon */}
                  <motion.div
                    className="absolute -right-2 -top-2 text-4xl"
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                    }}
                  >
                    🏆
                  </motion.div>
                </div>
              </motion.div>

              <p className="text-dark-300">You've grown stronger!</p>

              <motion.button
                onClick={handleDismiss}
                className="mt-6 rounded-lg bg-primary-600 px-6 py-2 font-medium text-white transition-colors hover:bg-primary-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue
              </motion.button>
            </div>

            {/* Particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((i / 8) * Math.PI * 2) * 150,
                  y: Math.sin((i / 8) * Math.PI * 2) * 150,
                  opacity: 0,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              >
                ✨
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

LevelUpNotification.displayName = 'LevelUpNotification';

