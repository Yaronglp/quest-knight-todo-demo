import React from 'react';
import { motion } from 'framer-motion';

interface KnightProps {
  isInBattle: boolean;
  onAttackComplete?: () => void;
  interactive?: boolean;
}

// Move constants outside component (Tip #10: move data that doesn't rely on props/state outside)
const IDLE_ANIMATION_TYPES = ['sharpen', 'map', 'armor'] as const;
const INTERACTION_TYPES = ['wave', 'jump', 'flourish'] as const;
const IDLE_ANIMATION_DELAY_MIN = 5000;
const IDLE_ANIMATION_DELAY_MAX = 10000;
const INTERACTION_DURATION = 1500;
const ATTACK_DURATION = 1000;

/**
 * Get idle animation configuration based on animation type
 * Moved outside component to avoid recreation on every render
 */
const getIdleAnimation = (
  isIdleAnimating: boolean,
  idleAnimation: 'breathing' | 'sharpen' | 'map' | 'armor'
) => {
  if (!isIdleAnimating || idleAnimation === 'breathing') {
    return {
      // Gentle breathing
      y: [0, -5, 0],
      scale: [1, 1.02, 1],
    };
  }
  
  switch (idleAnimation) {
    case 'sharpen':
      // Sharpening sword motion
      return {
        rotate: [0, -5, 5, -5, 5, 0],
        x: [0, -3, 3, -3, 3, 0],
      };
    case 'map':
      // Looking at map
      return {
        rotate: [0, 10, 10, 0],
        scale: [1, 0.98, 0.98, 1],
      };
    case 'armor':
      // Adjusting armor
      return {
        y: [0, -3, 3, -3, 0],
        rotate: [0, -3, 3, -3, 0],
      };
    default:
      return {
        y: [0, -5, 0],
        scale: [1, 1.02, 1],
      };
  }
};

/**
 * Get interaction animation configuration based on interaction type
 * Moved outside component to avoid recreation on every render
 */
const getInteractionAnimation = (
  isInteracting: boolean,
  interactionType: 'wave' | 'jump' | 'flourish'
) => {
  if (!isInteracting) return {};
  
  switch (interactionType) {
    case 'wave':
      return { rotate: [0, 10, -10, 10, 0] };
    case 'jump':
      return { y: [0, -40, -20, -40, 0] };
    case 'flourish':
      return { 
        rotate: [0, 360],
        scale: [1, 1.2, 1]
      };
    default:
      return {};
  }
};

/**
 * Knight character component - the player's avatar
 * Idle state: Subtle breathing animation when not in battle
 * Battle state: Performs attack animation when battling
 * Interactive: Can be clicked to trigger reaction animations
 */
export const Knight: React.FC<KnightProps> = ({ 
  isInBattle, 
  onAttackComplete, 
  interactive = false 
}) => {
  // Group all state at the top (Tip #14)
  const [isAttacking, setIsAttacking] = React.useState(false);
  const [isInteracting, setIsInteracting] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [interactionType, setInteractionType] = React.useState<'wave' | 'jump' | 'flourish'>('wave');
  const [idleAnimation, setIdleAnimation] = React.useState<'breathing' | 'sharpen' | 'map' | 'armor'>('breathing');
  const [isIdleAnimating, setIsIdleAnimating] = React.useState(false);

  React.useEffect(() => {
    // Use value === case pattern (Tip #18)
    if (isInBattle === true && isAttacking === false) {
      setIsAttacking(() => true);
      // Attack animation - use constant from outside
      const timer = setTimeout(() => {
        setIsAttacking(() => false);
        onAttackComplete?.();
      }, ATTACK_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isInBattle, isAttacking, onAttackComplete]);

  // Cycle through idle animations when not in battle or interacting
  React.useEffect(() => {
    // Use value === case pattern (Tip #18)
    if (isInBattle === true || isInteracting === true || interactive === false) return;
    
    // Cycle idle animations - use constants from outside
    const randomDelay = Math.random() * (IDLE_ANIMATION_DELAY_MAX - IDLE_ANIMATION_DELAY_MIN) + IDLE_ANIMATION_DELAY_MIN;
    
    const idleTimer = setTimeout(() => {
      const randomAnimation = IDLE_ANIMATION_TYPES[Math.floor(Math.random() * IDLE_ANIMATION_TYPES.length)];
      
      setIdleAnimation(() => randomAnimation);
      setIsIdleAnimating(() => true);
      
      // Animation lasts 2-4 seconds
      const animationDuration = Math.random() * 2000 + 2000;
      setTimeout(() => {
        setIdleAnimation(() => 'breathing');
        setIsIdleAnimating(() => false);
      }, animationDuration);
    }, randomDelay);
    
    return () => clearTimeout(idleTimer);
  }, [isInBattle, isInteracting, interactive, isIdleAnimating]);

  const handleClick = () => {
    // Use value === case pattern (Tip #18)
    if (interactive === false || isInteracting === true || isInBattle === true) return;
    
    // Randomly choose interaction type - use constant from outside
    const randomInteraction = INTERACTION_TYPES[Math.floor(Math.random() * INTERACTION_TYPES.length)];
    setInteractionType(() => randomInteraction);
    setIsInteracting(() => true);
    
    // Interaction - use constant from outside
    setTimeout(() => {
      setIsInteracting(() => false);
    }, INTERACTION_DURATION);
  };
  
  // Memoize animation configs to avoid recalculation on every render
  const idleAnimationConfig = React.useMemo(
    () => getIdleAnimation(isIdleAnimating, idleAnimation),
    [isIdleAnimating, idleAnimation]
  );
  
  const interactionAnimationConfig = React.useMemo(
    () => getInteractionAnimation(isInteracting, interactionType),
    [isInteracting, interactionType]
  );

  return (
    <motion.div
      className={`absolute bottom-8 left-[10%] sm:bottom-12 sm:left-[10%] ${interactive ? 'cursor-pointer' : ''}`}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleClick}
      onMouseEnter={() => interactive === true && setIsHovered(() => true)}
      onMouseLeave={() => setIsHovered(() => false)}
      whileHover={interactive === true && isInBattle === false ? { scale: 1.05 } : {}}
    >
      <div className="relative">
        {/* Knight Visual */}
        <motion.div
          className={`text-6xl sm:text-8xl md:text-9xl drop-shadow-[0_0_20px_rgba(251,191,36,0.6)] ${
            interactive && isHovered ? 'drop-shadow-[0_0_30px_rgba(251,191,36,0.9)]' : ''
          }`}
          style={{
            transform: 'scaleX(-1)',
          }}
          animate={
            isInteracting
              ? interactionAnimationConfig
              : isAttacking
              ? {
                  // Attack animation: lunge forward towards dragon
                  x: [0, 200, 180],
                  rotate: [0, -10, 5],
                  scale: [1, 1.15, 1.1],
                }
              : idleAnimationConfig
          }
          transition={
            isInteracting
              ? {
                  duration: 1.5,
                  ease: 'easeInOut',
                }
              : isAttacking
              ? {
                  duration: 1,
                  ease: 'easeInOut',
                }
              : isIdleAnimating && idleAnimation !== 'breathing'
              ? {
                  duration: idleAnimation === 'sharpen' ? 2 : idleAnimation === 'map' ? 3 : 2.5,
                  ease: 'easeInOut',
                  times: idleAnimation === 'sharpen' ? [0, 0.2, 0.4, 0.6, 0.8, 1] : undefined,
                }
              : {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        >
          🤺
        </motion.div>
        
        {/* Click hint - only show when interactive and hovered - ensure boolean (Tip #7) */}
        {interactive === true && isHovered === true && isInBattle === false && isInteracting === false && (
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="rounded bg-amber-500 px-2 py-1 text-xs font-bold text-dark-900 shadow-lg">
              Click me!
            </div>
          </motion.div>
        )}
        
        {/* Interaction effect - ensure boolean (Tip #7) */}
        {isInteracting === true && (
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 2, 3] }}
            transition={{ duration: 1.5 }}
          >
            {interactionType === 'wave' ? '👋' : interactionType === 'jump' ? '✨' : '⚔️'}
          </motion.div>
        )}
        
        {/* Idle animation indicators - ensure boolean (Tip #7) */}
        {isIdleAnimating === true && idleAnimation !== 'breathing' && isInteracting === false && (
          <motion.div
            className="absolute -right-12 top-1/2 -translate-y-1/2 text-3xl"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            {idleAnimation === 'sharpen' ? '🗡️' : idleAnimation === 'map' ? '🗺️' : '🛡️'}
          </motion.div>
        )}

        {/* Sword Shine Effect - Only when idle - ensure boolean (Tip #7) */}
        {isAttacking === false && (
          <motion.div
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-amber-300"
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        )}

        {/* Heroic Glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 -z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 opacity-20 blur-3xl"
          animate={{
            scale: isAttacking ? [1, 1.5, 1] : [1, 1.1, 1],
            opacity: isAttacking ? [0.2, 0.4, 0.2] : [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: isAttacking ? 1 : 2.5,
            repeat: isAttacking ? 0 : Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Attack Slash Effect - Positioned near dragon - ensure boolean (Tip #7) */}
        {isAttacking === true && (
          <>
            {/* Sword slash closer to dragon */}
            <motion.div
              className="absolute text-7xl"
              style={{ left: '220px', top: '0' }}
              initial={{ opacity: 0, scale: 0, rotate: -45 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.8, 2.5], rotate: 45 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              ⚔️
            </motion.div>
            {/* Impact effect on dragon */}
            <motion.div
              className="absolute text-6xl"
              style={{ left: '240px', top: '20px' }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 2, 3] }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              💥
            </motion.div>
            {/* Speed lines during lunge */}
            <motion.div
              className="absolute text-5xl"
              style={{ left: '100px', top: '30px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0], x: [0, 80, 120] }}
              transition={{ duration: 0.6 }}
            >
              💨
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

