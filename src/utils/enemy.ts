import type { Enemy } from '../types/models';

/**
 * Enemy-related utility functions
 */

/**
 * Generate a random position for an enemy in the game area
 * Uses a grid-based system to reduce overlap
 */
export const generateEnemyPosition = (existingEnemies: Enemy[]): { x: number; y: number } => {
  // Define a grid of possible positions (5x3 grid)
  const gridPositions = [
    { x: 20, y: 25 },
    { x: 40, y: 25 },
    { x: 60, y: 25 },
    { x: 80, y: 25 },
    { x: 30, y: 50 },
    { x: 50, y: 50 },
    { x: 70, y: 50 },
    { x: 25, y: 75 },
    { x: 45, y: 75 },
    { x: 65, y: 75 },
    { x: 85, y: 75 },
  ];

  // Find occupied positions
  const occupiedPositions = existingEnemies.map((e) => `${e.position.x},${e.position.y}`);

  // Find available positions
  const availablePositions = gridPositions.filter(
    (pos) => !occupiedPositions.includes(`${pos.x},${pos.y}`)
  );

  // If all positions taken, add some randomness to avoid exact overlap
  if (availablePositions.length === 0) {
    const randomOffset = () => Math.random() * 10 - 5;
    return {
      x: 50 + randomOffset(),
      y: 50 + randomOffset(),
    };
  }

  // Return a random available position
  return availablePositions[Math.floor(Math.random() * availablePositions.length)];
};

