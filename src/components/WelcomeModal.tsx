import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { XP_REWARDS } from '../utils/constants';

// Move constants outside component (Tip #10: move data that doesn't rely on props/state outside)
const WELCOME_STORAGE_KEY = 'quest-knight-welcome-shown';

// Demo tasks data - moved outside (Tip #10)
const DEMO_TASKS = [
  {
    title: 'Complete this urgent quest',
    description: `Click the Complete button to battle the dragon and earn ${XP_REWARDS.URGENT_TASK} XP!`,
    urgency: 'urgent' as const,
  },
  {
    title: 'Try a normal quest',
    description: `Normal tasks spawn goblins and award ${XP_REWARDS.NORMAL_TASK} XP when completed.`,
    urgency: 'normal' as const,
  },
  {
    title: 'Click the knight character',
    description: 'The knight is interactive! Click them to see fun animations.',
    urgency: 'normal' as const,
  },
];

/**
 * Welcome modal for first-time users
 * Shows instructions and offers to start with demo tasks
 */
export const WelcomeModal: React.FC = React.memo(() => {
  // Group all state and context at the top (Tip #14)
  const [isVisible, setIsVisible] = useState(false);
  const addTask = useGameStore((state) => state.addTask);
  const tasks = useGameStore((state) => state.tasks);

  useEffect(() => {
    // Check if welcome has been shown before
    const welcomeShown = localStorage.getItem(WELCOME_STORAGE_KEY);
    
    // Show welcome if it's the first time and there are no tasks
    if (!welcomeShown && tasks.length === 0) {
      setIsVisible(true);
    }
  }, [tasks.length]);

  // Prevent body scroll when modal is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isVisible]);

  const handleStartDemo = useCallback(() => {
    // Create demo tasks - use function to avoid polluting scope (Tip #8)
    DEMO_TASKS.forEach((task) => {
      addTask(task.title, task.description, task.urgency);
    });
    
    // Mark welcome as shown
    localStorage.setItem(WELCOME_STORAGE_KEY, 'true');
    setIsVisible(() => false);
  }, [addTask]);

  const handleSkip = useCallback(() => {
    localStorage.setItem(WELCOME_STORAGE_KEY, 'true');
    setIsVisible(() => false);
  }, []);

  return (
    <AnimatePresence>
      {isVisible === true && (
        <motion.div
          className="fixed inset-0 z-50 bg-dark-900/90 backdrop-blur-sm overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute top-1/2 left-1/2 w-[90%] max-w-2xl max-h-[95vh] overflow-hidden rounded-xl sm:rounded-2xl border-2 sm:border-4 border-primary-500 bg-gradient-to-br from-dark-800 to-dark-900 shadow-2xl"
            initial={{ scale: 0.8, x: '-50%', y: '-40%' }}
            animate={{ scale: 1, x: '-50%', y: '-50%' }}
            exit={{ scale: 0.8, x: '-50%', y: '-40%' }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 -z-10 rounded-xl sm:rounded-2xl bg-primary-500 opacity-30 blur-3xl pointer-events-none will-change-transform"
              animate={{
                scale: [1, 1.03, 1],
                opacity: [0.3, 0.45, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: [0.45, 0, 0.55, 1],
                repeatType: "loop",
              }}
            />
            
            {/* Scrollable Content */}
            <div className="relative overflow-y-auto overflow-x-hidden max-h-[95vh] p-4 sm:p-6 md:p-8">

            {/* Header */}
            <div className="mb-4 sm:mb-6 text-center">
              <motion.div
                className="mb-2 sm:mb-4 text-5xl sm:text-6xl md:text-7xl will-change-transform"
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 3, -3, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: [0.45, 0, 0.55, 1],
                  repeatType: "loop",
                }}
              >
                ⚔️
              </motion.div>
              <h1 className="mb-1 sm:mb-2 font-fantasy text-2xl sm:text-3xl md:text-4xl font-bold text-primary-400">
                Welcome, Adventurer!
              </h1>
              <p className="text-base sm:text-lg text-dark-200">
                Transform your tasks into epic quests
              </p>
            </div>

            {/* Instructions */}
            <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-4 rounded-lg border-2 border-dark-700 bg-dark-850 p-3 sm:p-4 md:p-6">
              <h2 className="font-fantasy text-lg sm:text-xl font-semibold text-primary-400">
                How to Play:
              </h2>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl flex-shrink-0">🐉</span>
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-dark-100">Create Urgent Tasks → Spawn Dragons</p>
                    <p className="text-xs sm:text-sm text-dark-300">High-priority tasks become mighty dragons worth {XP_REWARDS.URGENT_TASK} XP</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl flex-shrink-0">👺</span>
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-dark-100">Create Normal Tasks → Spawn Goblins</p>
                    <p className="text-xs sm:text-sm text-dark-300">Regular tasks become goblins worth {XP_REWARDS.NORMAL_TASK} XP</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl flex-shrink-0">⚔️</span>
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-dark-100">Complete Tasks → Battle Enemies</p>
                    <p className="text-xs sm:text-sm text-dark-300">Watch epic battle animations and earn experience points</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl flex-shrink-0">✨</span>
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-dark-100">Level Up & Interact</p>
                    <p className="text-xs sm:text-sm text-dark-300">Gain XP to level up and click your knight for animations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <motion.button
                onClick={handleStartDemo}
                className="flex-1 rounded-lg bg-primary-600 py-2.5 sm:py-3 font-fantasy text-base sm:text-lg font-semibold text-white shadow-lg transition-colors hover:bg-primary-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🎮 Start with Demo Tasks
              </motion.button>
              <motion.button
                onClick={handleSkip}
                className="rounded-lg bg-dark-700 px-6 py-2.5 sm:py-3 font-medium text-sm sm:text-base text-dark-200 transition-colors hover:bg-dark-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Skip
              </motion.button>
            </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

WelcomeModal.displayName = 'WelcomeModal';

