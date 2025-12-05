import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

/**
 * Screen reader announcer for game state changes
 * Provides audio feedback for visually impaired users
 */
export const ScreenReaderAnnouncer: React.FC = React.memo(() => {
  // Group all state and context at the top (Tip #14)
  const [announcement, setAnnouncement] = useState('');
  const player = useGameStore((state) => state.player);
  const tasks = useGameStore((state) => state.tasks);
  const enemies = useGameStore((state) => state.enemies);
  const battle = useGameStore((state) => state.battle);

  // Announce level changes - use function form for state updates (Tip #31)
  useEffect(() => {
    setAnnouncement(() => `Current level: ${player.level}. Experience: ${player.xp} points.`);
  }, [player.level, player.xp]);

  // Announce task count changes - use function form for state updates (Tip #31)
  useEffect(() => {
    const activeTasks = tasks.filter(t => t.status === 'todo').length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    setAnnouncement(() => `${activeTasks} active quests, ${completedTasks} completed.`);
  }, [tasks.length]);

  // Announce enemy count - ensure boolean check (Tip #7)
  useEffect(() => {
    const dragons = enemies.filter(e => e.type === 'dragon').length;
    const goblins = enemies.filter(e => e.type === 'goblin').length;
    if (dragons > 0 || goblins > 0) {
      setAnnouncement(() => `${dragons} dragons and ${goblins} goblins in game area.`);
    }
  }, [enemies.length]);

  // Announce battle state - use value === case pattern (Tip #18)
  useEffect(() => {
    if (battle.isActive === true) {
      setAnnouncement(() => 'Battle started!');
    }
  }, [battle.isActive]);

  return (
    <div
      className="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {announcement}
    </div>
  );
});

ScreenReaderAnnouncer.displayName = 'ScreenReaderAnnouncer';

