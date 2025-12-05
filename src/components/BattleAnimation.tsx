import React from 'react';
import { motion } from 'framer-motion';
import { Knight } from './Knight';
import { XPAwardAnimation } from './XPAwardAnimation';
import { useGameStore } from '../store/gameStore';
import type { Enemy } from '../types/models';

interface BattleAnimationProps {
  isActive: boolean;
  enemyId: string | null;
  enemyPosition: Enemy['position'] | null;
  xpAwarded: number;
  onBattleComplete: () => void;
}

type BattlePhase = 'knight-enter' | 'attack' | 'enemy-defeat' | 'victory' | 'xp-award' | 'complete';

// Move timing constants outside component (Tip #10: move data that doesn't rely on props/state outside)
const BATTLE_TIMINGS = {
  goblin: { enter: 300, attack: 1000, defeat: 1700, victory: 2300, complete: 3500 },
  dragon: { enter: 500, attack: 1500, defeat: 2500, victory: 3500, complete: 5500 },
} as const;

/**
 * Calculates circular particle position for celebration animation
 * @param index - Particle index (0-11 for 12 particles)
 * @param radius - Radius of the circle
 * @returns Object with x and y coordinates
 */
function calculateParticlePosition(index: number, radius: number): { x: number; y: number } {
  const angle = (index * Math.PI * 2) / 12;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

/**
 * BattleAnimation - Orchestrates the complete battle sequence
 * 
 * Dragon sequence (5.5s total):
 * 1. Knight appears (0.5s)
 * 2. Knight attacks (1s)
 * 3. Dragon defeat animation (1s)
 * 4. Victory celebration (1s)
 * 5. XP award animation (2s)
 * 
 * Goblin sequence (3.5s total):
 * 1. Knight appears (0.3s)
 * 2. Knight attacks (0.7s)
 * 3. Goblin defeat animation (0.7s)
 * 4. Victory celebration (0.6s)
 * 5. XP award animation (1.2s)
 */
export const BattleAnimation: React.FC<BattleAnimationProps> = React.memo(({
  isActive,
  enemyId,
  enemyPosition,
  xpAwarded,
  onBattleComplete,
}) => {
  // Group all state at the top (Tip #14)
  const [phase, setPhase] = React.useState<BattlePhase>('knight-enter');
  const [showXPAward, setShowXPAward] = React.useState(false);
  
  // Get enemy type from store - memoized selector
  const enemy = useGameStore(React.useCallback((state) => 
    state.enemies.find((e) => e.id === enemyId), [enemyId]
  ));
  const enemyType = enemy?.type || 'dragon';
  const isGoblin = enemyType === 'goblin';

  React.useEffect(() => {
    // Use value === case pattern (Tip #18)
    if (isActive === false) {
      setPhase(() => 'knight-enter');
      setShowXPAward(() => false);
      return;
    }

    console.log(`[Quest Knight] Battle started with ${enemyType}!`);
    
    // Timings differ based on enemy type - use constant from outside
    const timings = isGoblin === true ? BATTLE_TIMINGS.goblin : BATTLE_TIMINGS.dragon;
    
    // Phase 1: Knight enters - use function form for state updates (Tip #31)
    const timer1 = setTimeout(() => {
      setPhase(() => 'attack');
      console.log('[Quest Knight] Knight attacking...');
    }, timings.enter);

    // Phase 2: Knight attacks
    const timer2 = setTimeout(() => {
      setPhase(() => 'enemy-defeat');
      console.log(`[Quest Knight] ${enemyType} defeated!`);
    }, timings.attack);

    // Phase 3: Enemy defeat
    const timer3 = setTimeout(() => {
      setPhase(() => 'victory');
      console.log('[Quest Knight] Victory!');
    }, timings.defeat);

    // Phase 4: Victory celebration
    const timer4 = setTimeout(() => {
      setPhase(() => 'xp-award');
      setShowXPAward(() => true);
      console.log(`[Quest Knight] +${xpAwarded} XP awarded!`);
    }, timings.victory);

    // Phase 5: XP award animation completes
    const timer5 = setTimeout(() => {
      setPhase(() => 'complete');
      setShowXPAward(() => false);
      console.log('[Quest Knight] Battle complete!');
      onBattleComplete();
    }, timings.complete);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [isActive, enemyId, enemyType, isGoblin, xpAwarded, onBattleComplete]);

  // Use value === case pattern (Tip #18)
  if (isActive === false) return null;

  return (
    <>
      {/* Full-screen overlay to prevent interaction during battle */}
      <motion.div
        className="fixed inset-0 z-40 bg-dark-900/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex h-full items-center justify-center px-4">
          {/* Battle Arena */}
          <div className="relative h-[400px] w-full max-w-4xl sm:h-[500px] md:h-[600px]">
            {/* Knight */}
            <Knight
              isInBattle={phase === 'attack'}
              onAttackComplete={() => {
                // Attack complete is handled by phase timing
              }}
            />

            {/* Enemy (Dragon or Goblin) - ensure boolean checks (Tip #7) */}
            {phase !== 'complete' && enemyPosition !== null && (
              <motion.div
                className="absolute"
                style={{
                  left: '60%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 1, scale: 1 }}
                animate={
                  phase === 'enemy-defeat'
                    ? {
                        opacity: 0,
                        scale: isGoblin ? 0.3 : 0.5,
                        rotate: isGoblin ? 90 : 180,
                        y: isGoblin ? 30 : 50,
                      }
                    : phase === 'attack'
                    ? {
                        // Recoil when hit
                        x: [0, isGoblin ? 15 : 20, isGoblin ? 8 : 10],
                        rotate: [0, isGoblin ? -3 : -5, 0],
                      }
                    : {}
                }
                transition={{ 
                  duration: phase === 'attack' ? (isGoblin ? 0.4 : 0.6) : (isGoblin ? 0.7 : 1),
                  delay: phase === 'attack' ? (isGoblin ? 0.3 : 0.4) : 0
                }}
              >
                <div className="relative">
                  <div className={isGoblin ? "text-5xl sm:text-6xl" : "text-6xl sm:text-8xl md:text-9xl"}>
                    {isGoblin ? '👺' : '🐉'}
                  </div>
                  
                  {/* Damage effect */}
                  {phase === 'enemy-defeat' && (
                    <>
                      <motion.div
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${isGoblin ? 'text-4xl' : 'text-6xl'}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 2, 3] }}
                        transition={{ duration: isGoblin ? 0.7 : 1 }}
                      >
                        💥
                      </motion.div>
                      {!isGoblin && (
                        <motion.div
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0], scale: [1, 2, 3] }}
                          transition={{ duration: 1, delay: 0.2 }}
                        >
                          💨
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Victory Celebration - use value === case pattern (Tip #18) */}
            {(phase === 'victory' || phase === 'xp-award') && (
              <motion.div
                className="absolute left-1/2 top-1/4 -translate-x-1/2"
                initial={{ opacity: 0, scale: 0, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                <div className="text-center">
                  <motion.div
                    className="font-fantasy text-4xl font-bold text-amber-400 sm:text-6xl md:text-7xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [-5, 5, -5],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                    }}
                  >
                    VICTORY!
                  </motion.div>
                  
                  {/* Celebration particles */}
                  {[...Array(12)].map((_, i) => {
                    const radius = window.innerWidth < 640 ? 80 : 150;
                    const position = calculateParticlePosition(i, radius);
                    return (
                      <motion.div
                        key={i}
                        className="absolute text-2xl sm:text-3xl md:text-4xl"
                        style={{
                          left: '50%',
                          top: '50%',
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0.5],
                          x: position.x,
                          y: position.y,
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.05,
                          repeat: phase === 'victory' ? Infinity : 0,
                          repeatDelay: 1,
                        }}
                      >
                        {i % 3 === 0 ? '⭐' : i % 3 === 1 ? '✨' : '🎉'}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* XP Award Animation (overlays on top) */}
      <XPAwardAnimation
        xpAmount={xpAwarded}
        show={showXPAward}
        onComplete={() => {
          // Handled by phase timing
        }}
      />
    </>
  );
});

BattleAnimation.displayName = 'BattleAnimation';

