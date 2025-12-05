/**
 * XP calculation utilities
 * 
 * Handles XP-to-level conversion and level-to-XP requirements
 */

/**
 * Calculate XP required for a given level
 * Level 1: 0 XP, Level 2: 100 XP, Level 3: 250 XP, Level 4: 500 XP, etc.
 */
export const getXPForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level - 1, 1.5));
};

/**
 * Calculate current level based on total XP
 */
export const getLevelFromXP = (xp: number): number => {
  let level = 1;
  while (xp >= getXPForLevel(level + 1)) {
    level++;
  }
  return level;
};

