# Frontend Architecture

## Component Architecture

**Component Organization:**

```
frontend/src/
├── components/
│   ├── common/              # Reusable UI primitives
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── ProgressBar/
│   │   ├── Modal/
│   │   ├── Badge/
│   │   └── Tooltip/
│   ├── task/                # Task management components
│   │   ├── TaskList/
│   │   ├── TaskItem/
│   │   ├── TaskForm/
│   │   └── TaskCard/
│   ├── game/                # Game world components
│   │   ├── GameArea/
│   │   ├── KnightCharacter/
│   │   ├── EnemyEntity/
│   │   └── BattleAnimation/
│   └── player/              # Player progression components
│       ├── XPProgressBar/
│       ├── LevelDisplay/
│       ├── LevelUpCelebration/
│       └── PlayerStats/
```

**Component Template:**

```typescript
// components/task/TaskCard/TaskCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/hooks/useStore';
import { Task } from '@/types/models';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = React.memo(({ task }) => {
  const updateTaskStatus = useStore(state => state.updateTaskStatus);
  
  const handleComplete = () => {
    updateTaskStatus(task.id, 'done');
  };
  
  return (
    <motion.div
      className={styles.taskCard}
      data-urgency={task.urgency}
      data-status={task.status}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.urgencyBadge}>
        {task.urgency === 'urgent' ? '🐉' : '⚔️'}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{task.title}</h3>
        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}
      </div>
      
      <button
        className={styles.completeButton}
        onClick={handleComplete}
        aria-label={`Complete task: ${task.title}`}
        disabled={task.status === 'done'}
      >
        {task.status === 'done' ? '✓' : '○'}
      </button>
    </motion.div>
  );
});

TaskCard.displayName = 'TaskCard';
```

## State Management Architecture

**Zustand Store Structure:**

```typescript
// store/index.ts
import create from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { createTasksSlice } from './slices/tasksSlice';
import { createPlayerSlice } from './slices/playerSlice';
import { createEnemiesSlice } from './slices/enemiesSlice';
import { createGameSlice } from './slices/gameSlice';

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...createTasksSlice(set, get),
        ...createPlayerSlice(set, get),
        ...createEnemiesSlice(set, get),
        ...createGameSlice(set, get),
      }),
      {
        name: 'quest-knight-state',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          version: 1,
          tasks: state.tasks,
          player: state.player,
          lastSaved: Date.now(),
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.regenerateEnemies();
          }
        },
      }
    ),
    { name: 'QuestKnight' }
  )
);
```

**State Management Patterns:**

1. **Selector-Based Subscriptions:** Components use specific selectors to prevent unnecessary re-renders
2. **Action Co-location:** Actions defined in same slice as state they modify
3. **Computed Values:** Derived state calculated in selectors, not stored
4. **Shallow Equality:** Use Zustand's shallow compare for object selections

## Routing Architecture

**No Routing Required:** Quest Knight is a single-screen application with no navigation.

**Future Considerations (Post-MVP):**
- If multiple screens needed (settings page, achievements), use React Router
- Hash-based routing for static deployment compatibility

## Frontend Services Layer

Services are pure TypeScript classes/functions with no React dependencies, enabling independent testing.

**Service Pattern Example:**

```typescript
// services/animationController.ts
export class AnimationController {
  async triggerBattle(enemyId: string): Promise<void> {
    const store = useStore.getState();
    const enemy = store.enemies.find(e => e.id === enemyId);
    
    if (!enemy) return;
    
    const xpReward = enemy.type === 'dragon' ? 100 : 50;
    
    // Phase 1: Knight Attack
    store.setActiveBattle({
      enemyId,
      enemyType: enemy.type,
      phase: 'knight-attack',
      xpAwarded: xpReward,
      startedAt: Date.now(),
    });
    
    await this.delay(1000);
    
    // Phase 2: Enemy Defeat
    store.advanceBattlePhase();
    await this.delay(enemy.type === 'dragon' ? 800 : 400);
    
    // Phase 3: Victory
    store.advanceBattlePhase();
    await this.delay(600);
    
    // Phase 4: XP Award
    store.advanceBattlePhase();
    store.awardXP(xpReward);
    await this.delay(500);
    
    // Check for level up
    if (store.pendingLevelUp) {
      await this.triggerLevelUp();
    }
    
    // Complete
    store.completeBattle();
    store.removeEnemy(enemyId);
  }
  
  private async triggerLevelUp(): Promise<void> {
    await this.delay(1500);
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

