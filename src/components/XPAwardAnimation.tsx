import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface XPAwardAnimationProps {
  xpAmount: number;
  show: boolean;
  onComplete?: () => void;
}

/**
 * XP Award Animation - Floating "+100 XP" text that appears after battle
 */
export const XPAwardAnimation: React.FC<XPAwardAnimationProps> = ({
  xpAmount,
  show,
  onComplete,
}) => {
  React.useEffect(() => {
    // Ensure boolean checks (Tip #7)
    if (show === true && onComplete !== undefined) {
      // Animation lasts 2 seconds
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show === true && (
        <motion.div
          className="pointer-events-none fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{ opacity: 1, scale: 1.5, y: -100 }}
          exit={{ opacity: 0, scale: 2, y: -150 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          <div className="relative">
            {/* Main XP Text */}
            <motion.div
              className="font-fantasy text-6xl font-bold text-amber-400"
              animate={{
                textShadow: [
                  '0 0 10px rgba(251,191,36,0.8)',
                  '0 0 20px rgba(251,191,36,1)',
                  '0 0 10px rgba(251,191,36,0.8)',
                ],
              }}
              transition={{ duration: 1, repeat: 1 }}
            >
              +{xpAmount} XP
            </motion.div>

            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                  x: Math.cos((i * Math.PI * 2) / 6) * 80,
                  y: Math.sin((i * Math.PI * 2) / 6) * 80,
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.3 + i * 0.1,
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

