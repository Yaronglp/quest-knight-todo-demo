import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

/**
 * Hook to synchronize state across browser tabs using storage events
 */
export const useStorageSync = () => {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Only handle changes to our storage key
      if (e.key === 'quest-knight-state' && e.newValue) {
        console.log('[Quest Knight] State changed in another tab, syncing...');
        
        try {
          const newState = JSON.parse(e.newValue);
          
          // Manually sync the state from the other tab
          if (newState?.state) {
            const { tasks, player } = newState.state;
            
            // Update the store with the new state
            useGameStore.setState({
              tasks: tasks || [],
              player: player || { level: 1, xp: 0 },
            });
            
            console.log('[Quest Knight] State synced from another tab');
          }
        } catch (error) {
          console.error('[Quest Knight] Error syncing state from another tab:', error);
        }
      }
    };

    // Listen for storage events (fired when localStorage changes in other tabs)
    window.addEventListener('storage', handleStorageChange);

    console.log('[Quest Knight] Cross-tab sync enabled');

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
};

