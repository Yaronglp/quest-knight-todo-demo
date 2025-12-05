import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Task, Player, Enemy } from '../types/models';
import { getLevelFromXP } from '../utils/xp';
import { generateEnemyPosition } from '../utils/enemy';
import { XP_REWARDS } from '../utils/constants';

interface BattleState {
  isActive: boolean;
  enemyId: string | null;
  taskId: string | null;
  xpAwarded: number;
}

interface GameState {
  // State
  tasks: Task[];
  player: Player;
  enemies: Enemy[];
  battle: BattleState;

  // Actions
  addTask: (title: string, description: string, urgency: 'urgent' | 'normal') => void;
  toggleTaskStatus: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  removeEnemy: (enemyId: string) => void;
  startBattle: (enemyId: string, taskId: string, xpAwarded: number) => void;
  endBattle: () => void;
  clearAllData: () => void;
  cleanupOrphanedEnemies: () => void;
}

const STORAGE_KEY = 'quest-knight-state';
const STORAGE_VERSION = 1;

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      // Initial state
      tasks: [],
      player: {
        level: 1,
        xp: 0,
      },
      enemies: [],
      battle: {
        isActive: false,
        enemyId: null,
        taskId: null,
        xpAwarded: 0,
      },

      // Actions
      addTask: (title, description, urgency) =>
        set((state) => {
          const newTask = {
            id: crypto.randomUUID(),
            title,
            description,
            urgency,
            status: 'todo' as const,
            createdAt: Date.now(),
          };
          console.log('[Quest Knight] Task created:', newTask.title);

          // Spawn enemy based on urgency
          let newEnemies = state.enemies || []; // Ensure array exists
          
          if (urgency === 'urgent') {
            const dragon: Enemy = {
              id: crypto.randomUUID(),
              taskId: newTask.id,
              type: 'dragon',
              position: generateEnemyPosition(state.enemies || []),
            };
            newEnemies = [...newEnemies, dragon];
            console.log('[Quest Knight] Dragon spawned for urgent task:', newTask.title);
          } else if (urgency === 'normal') {
            const goblin: Enemy = {
              id: crypto.randomUUID(),
              taskId: newTask.id,
              type: 'goblin',
              position: generateEnemyPosition(state.enemies || []),
            };
            newEnemies = [...newEnemies, goblin];
            console.log('[Quest Knight] Goblin spawned for normal task:', newTask.title);
          }

          return {
            tasks: [...state.tasks, newTask],
            enemies: newEnemies,
          };
        }),

      toggleTaskStatus: (taskId) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;

          const isCompleting = task.status === 'todo';
          const isUncompleting = task.status === 'done';

          console.log(
            `[Quest Knight] Task ${isCompleting ? 'completed' : 'uncompleted'}:`,
            task.title
          );
          console.log('[Quest Knight] Task urgency:', task.urgency);
          console.log('[Quest Knight] Current enemies:', state.enemies.length);
          console.log('[Quest Knight] Battle active:', state.battle.isActive);

          // If completing a task with an enemy, trigger battle animation
          if (isCompleting) {
            const enemy = state.enemies.find((e) => e.taskId === taskId);
            if (enemy) {
              const xpAwarded = enemy.type === 'dragon' ? XP_REWARDS.URGENT_TASK : XP_REWARDS.NORMAL_TASK;
              console.log(`[Quest Knight] Starting battle with ${enemy.type} ${enemy.id}!`);
              
              // Start battle (don't award XP yet - will happen after battle)
              return {
                tasks: state.tasks.map((t) =>
                  t.id === taskId ? { ...t, status: 'done' } : t
                ),
                player: state.player, // Keep player state unchanged
                enemies: state.enemies, // Keep enemies unchanged (removed after battle)
                battle: {
                  isActive: true,
                  enemyId: enemy.id,
                  taskId: taskId,
                  xpAwarded: xpAwarded,
                },
              };
            }
          }

          // For non-urgent tasks or un-completing, handle XP immediately
          let newXP = state.player.xp;
          let xpAwarded = 0;
          let newEnemies = state.enemies;

          if (isCompleting) {
            // Award XP when completing a normal task
            xpAwarded = task.urgency === 'urgent' ? XP_REWARDS.URGENT_TASK : XP_REWARDS.NORMAL_TASK;
            newXP += xpAwarded;
            console.log(`[Quest Knight] +${xpAwarded} XP awarded! Total XP: ${newXP}`);
          } else if (isUncompleting) {
            // Remove XP when un-completing a task
            xpAwarded = task.urgency === 'urgent' ? -XP_REWARDS.URGENT_TASK : -XP_REWARDS.NORMAL_TASK;
            newXP = Math.max(0, newXP + xpAwarded);
            console.log(`[Quest Knight] ${xpAwarded} XP removed. Total XP: ${newXP}`);

            // Respawn enemy based on urgency
            if (task.urgency === 'urgent') {
              console.log('[Quest Knight] Respawning dragon for urgent task:', task.title);
              console.log('[Quest Knight] Current enemies before respawn:', state.enemies.length);
              
              const dragon: Enemy = {
                id: crypto.randomUUID(),
                taskId: task.id,
                type: 'dragon',
                position: generateEnemyPosition(state.enemies),
              };
              newEnemies = [...state.enemies, dragon];
              
              console.log('[Quest Knight] Dragon respawned with ID:', dragon.id);
              console.log('[Quest Knight] New enemies count:', newEnemies.length);
              console.log('[Quest Knight] Dragon position:', dragon.position);
            } else if (task.urgency === 'normal') {
              console.log('[Quest Knight] Respawning goblin for normal task:', task.title);
              
              const goblin: Enemy = {
                id: crypto.randomUUID(),
                taskId: task.id,
                type: 'goblin',
                position: generateEnemyPosition(state.enemies),
              };
              newEnemies = [...state.enemies, goblin];
              
              console.log('[Quest Knight] Goblin respawned with ID:', goblin.id);
            }
          }

          // Check for level up (or level down)
          const oldLevel = state.player.level;
          const newLevel = getLevelFromXP(newXP);
          const leveledUp = newLevel > oldLevel;
          const leveledDown = newLevel < oldLevel;

          if (leveledUp) {
            console.log(`[Quest Knight] 🎉 LEVEL UP! ${oldLevel} → ${newLevel}`);
          } else if (leveledDown) {
            console.log(`[Quest Knight] Level decreased: ${oldLevel} → ${newLevel}`);
          }

          const result = {
            tasks: state.tasks.map((t) =>
              t.id === taskId 
                ? { ...t, status: (t.status === 'todo' ? 'done' : 'todo') as Task['status'] } 
                : t
            ),
            player: {
              xp: newXP,
              level: newLevel,
            },
            enemies: newEnemies,
          };
          
          console.log('[Quest Knight] Returning state with', result.enemies.length, 'enemies');
          return result;
        }),

      deleteTask: (taskId) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (task) {
            console.log('[Quest Knight] Task deleted:', task.title);
          }
          // Remove associated enemy when task is deleted
          const newEnemies = state.enemies.filter((enemy) => enemy.taskId !== taskId);
          return {
            tasks: state.tasks.filter((task) => task.id !== taskId),
            enemies: newEnemies,
          };
        }),

      removeEnemy: (enemyId) =>
        set((state) => {
          console.log('[Quest Knight] Enemy removed:', enemyId);
          return {
            enemies: state.enemies.filter((enemy) => enemy.id !== enemyId),
          };
        }),

      startBattle: (enemyId, taskId, xpAwarded) =>
        set(() => {
          console.log(`[Quest Knight] Battle started: enemy ${enemyId}, task ${taskId}`);
          return {
            battle: {
              isActive: true,
              enemyId,
              taskId,
              xpAwarded,
            },
          };
        }),

      endBattle: () =>
        set((state) => {
          console.log('[Quest Knight] Battle ended');
          console.log('[Quest Knight] Enemy to remove:', state.battle.enemyId);
          console.log('[Quest Knight] Enemies before removal:', state.enemies.length);
          
          // Award XP after battle completes
          const xpAwarded = state.battle.xpAwarded;
          const newXP = state.player.xp + xpAwarded;
          
          // Check for level up
          const oldLevel = state.player.level;
          const newLevel = getLevelFromXP(newXP);
          const leveledUp = newLevel > oldLevel;

          if (leveledUp) {
            console.log(`[Quest Knight] 🎉 LEVEL UP! ${oldLevel} → ${newLevel}`);
          }
          
          console.log(`[Quest Knight] +${xpAwarded} XP awarded! Total XP: ${newXP}`);

          // Remove the defeated enemy
          const enemyId = state.battle.enemyId;
          const newEnemies = enemyId 
            ? state.enemies.filter((enemy) => enemy.id !== enemyId)
            : state.enemies;

          console.log('[Quest Knight] Enemies after removal:', newEnemies.length);
          console.log('[Quest Knight] Enemy IDs after removal:', newEnemies.map(e => e.id));

          return {
            tasks: state.tasks, // Explicitly preserve tasks
            player: {
              xp: newXP,
              level: newLevel,
            },
            enemies: newEnemies,
            battle: {
              isActive: false,
              enemyId: null,
              taskId: null,
              xpAwarded: 0,
            },
          };
        }),

      clearAllData: () => {
        console.log('[Quest Knight] All data cleared');
        set({
          tasks: [],
          player: {
            level: 1,
            xp: 0,
          },
          enemies: [],
          battle: {
            isActive: false,
            enemyId: null,
            taskId: null,
            xpAwarded: 0,
          },
        });
      },

      // Cleanup orphaned enemies (dragons without associated tasks)
      cleanupOrphanedEnemies: () =>
        set((state) => {
          const taskIds = new Set(state.tasks.map(t => t.id));
          const validEnemies = state.enemies.filter(enemy => taskIds.has(enemy.taskId));
          const removedCount = state.enemies.length - validEnemies.length;
          
          if (removedCount > 0) {
            console.log(`[Quest Knight] Cleaned up ${removedCount} orphaned enemies`);
          }
          
          return {
            enemies: validEnemies,
          };
        }),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => {
        try {
          // Test if localStorage is available
          localStorage.setItem('__test__', 'test');
          localStorage.removeItem('__test__');
          console.log('[Quest Knight] LocalStorage available');
          return localStorage;
        } catch (error) {
          console.warn('[Quest Knight] LocalStorage unavailable, data will not persist:', error);
          // Fallback to memory storage (no persistence)
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
      }),
      onRehydrateStorage: () => {
        console.log('[Quest Knight] Loading saved data...');
        return (state, error) => {
          if (error) {
            console.error('[Quest Knight] Error loading saved data:', error);
          } else if (state) {
            // Ensure enemies array exists (for backward compatibility)
            if (!state.enemies) {
              console.log('[Quest Knight] Migrating old data: adding enemies array');
              state.enemies = [];
            }
            // Ensure battle state exists (for backward compatibility)
            if (!state.battle) {
              console.log('[Quest Knight] Migrating old data: adding battle state');
              state.battle = {
                isActive: false,
                enemyId: null,
                taskId: null,
                xpAwarded: 0,
              };
            }
            console.log('[Quest Knight] Data loaded successfully:', {
              tasks: state.tasks.length,
              enemies: state.enemies.length,
              level: state.player.level,
              xp: state.player.xp,
            });
            
            // Clean up any orphaned enemies after loading
            state.cleanupOrphanedEnemies();
          } else {
            console.log('[Quest Knight] No saved data found, starting fresh');
          }
        };
      },
    }
  )
);

