import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getXPForLevel } from '../utils/xp';

/**
 * Display player level and XP progress bar
 */
export const PlayerStatus: React.FC = React.memo(() => {
  // Group all state and context at the top (Tip #14)
  const xp = useGameStore((state) => state.player.xp);
  const level = useGameStore((state) => state.player.level);

  // Memoize calculations to prevent unnecessary recomputation
  const { xpInCurrentLevel, xpNeededForNextLevel, progressPercentage } = useMemo(() => {
    const currentLevelXP = getXPForLevel(level);
    const nextLevelXP = getXPForLevel(level + 1);
    const xpInCurrentLevel = xp - currentLevelXP;
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    const progressPercentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100;
    
    return {
      xpInCurrentLevel,
      xpNeededForNextLevel,
      progressPercentage
    };
  }, [xp, level]);

  // Debug logging - moved after memoized calculations
  React.useEffect(() => {
    console.log('[PlayerStatus] XP updated:', xp, 'Level:', level, 'Progress:', progressPercentage.toFixed(1) + '%');
  }, [xp, level, progressPercentage]);

  return (
    <div className="space-y-2">
      {/* Level Display */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary-500 bg-primary-900/50 shadow-lg">
            <span className="font-fantasy text-lg font-bold text-primary-400">{level}</span>
          </div>
          <div>
            <div className="font-fantasy text-sm text-dark-400">Level</div>
            <div className="font-fantasy text-lg font-bold text-primary-400">{level}</div>
          </div>
        </div>

        {/* XP Text */}
        <div className="flex-1 text-right">
          <div className="text-xs text-dark-400">
            {xpInCurrentLevel} / {xpNeededForNextLevel} XP
          </div>
          <div className="text-xs text-dark-500">Total: {xp} XP</div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="relative h-6 overflow-hidden rounded-full border-2 border-primary-700 bg-dark-900 shadow-inner">
        {/* Progress Fill */}
        <motion.div
          key={`xp-${xp}`} // Force re-render when XP changes
          className="h-full bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500 shadow-lg"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
        />

        {/* Progress Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-lg">
            {Math.floor(progressPercentage)}%
          </span>
        </div>
      </div>
    </div>
  );
});

PlayerStatus.displayName = 'PlayerStatus';

