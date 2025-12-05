# Data Models

These TypeScript interfaces serve as the contract between UI components and the Zustand store.

## Task Model

**Purpose:** Represents a user's todo item that manifests as an enemy in the game world. The urgency property determines enemy type (dragon vs goblin), and status controls the task lifecycle.

**Key Attributes:**
- `id`: string (UUID) - Unique identifier for task and enemy association
- `title`: string - Task name displayed in list and potentially in battle UI
- `description`: string (optional) - Extended task details
- `urgency`: 'urgent' | 'normal' - Determines enemy type (dragon vs goblin) and XP reward
- `status`: 'todo' | 'in-progress' | 'done' - Task lifecycle state
- `createdAt`: number (timestamp) - Creation time for sorting and analytics
- `completedAt`: number | null (timestamp) - Completion time for history tracking

**TypeScript Interface:**

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  urgency: 'urgent' | 'normal';
  status: 'todo' | 'in-progress' | 'done';
  createdAt: number;
  completedAt: number | null;
}

// Type guards for status filtering
type ActiveTask = Task & { status: 'todo' | 'in-progress' };
type CompletedTask = Task & { status: 'done'; completedAt: number };
```

**Relationships:**
- One-to-one with Enemy entity (each task spawns exactly one enemy)
- Tasks persist to LocalStorage as JSON array

## Player Model

**Purpose:** Tracks user's progression through XP accumulation and level advancement. This model drives the gamification reward system.

**Key Attributes:**
- `currentXP`: number - Total accumulated experience points
- `currentLevel`: number - Derived from XP using progression curve
- `xpForNextLevel`: number - Calculated threshold for next level up
- `totalTasksCompleted`: number - Lifetime task completion counter
- `totalDragonsDefeated`: number - Urgent task completion counter
- `totalGoblinsDefeated`: number - Normal task completion counter

**TypeScript Interface:**

```typescript
interface Player {
  currentXP: number;
  currentLevel: number;
  xpForNextLevel: number;
  totalTasksCompleted: number;
  totalDragonsDefeated: number;
  totalGoblinsDefeated: number;
}

// XP progression curve from PRD Story 1.5
const XP_CURVE: Record<number, number> = {
  1: 0,      // Level 1 starts at 0 XP
  2: 100,    // Level 2 requires 100 XP total
  3: 250,    // Level 3 requires 250 XP total
  4: 500,    // Level 4 requires 500 XP total
  5: 1000,   // Exponential curve continues...
};

// XP rewards from PRD Story 1.5
const XP_REWARDS = {
  URGENT_TASK: 100,   // Dragon defeat
  NORMAL_TASK: 50,    // Goblin defeat
} as const;
```

**Relationships:**
- Player state is global singleton
- XP updates trigger level recalculation
- Persists to LocalStorage as JSON object

## Enemy Model

**Purpose:** Represents visual game entities (dragons/goblins) spawned from tasks. Handles positioning, animation state, and task association.

**Key Attributes:**
- `id`: string - Same as associated Task ID for lookup
- `taskId`: string - Foreign key to Task entity
- `type`: 'dragon' | 'goblin' - Determined by task urgency
- `position`: {x, y} - Screen coordinates in game area
- `animationState`: 'idle' | 'threatened' | 'defeated' - Visual state
- `isDefeatable`: boolean - True when associated task marked complete

**TypeScript Interface:**

```typescript
type EnemyType = 'dragon' | 'goblin';
type EnemyAnimationState = 'idle' | 'threatened' | 'defeated';

interface Position {
  x: number; // Pixels from left edge of game area
  y: number; // Pixels from top edge of game area
}

interface Enemy {
  id: string;
  taskId: string;
  type: EnemyType;
  position: Position;
  animationState: EnemyAnimationState;
  isDefeatable: boolean;
}
```

**Relationships:**
- Many-to-one with Task (one task → one enemy, but multiple enemies exist simultaneously)
- Enemies are ephemeral (not persisted to LocalStorage, regenerated from tasks on load)
- Position calculated by layout algorithm to prevent overlap (Story 1.4)

## Game State Model

**Purpose:** Manages battle animation sequences, knight state, and UI interactions. Controls the animation state machine.

**Key Attributes:**
- `knightState`: 'idle' | 'sharpening' | 'looking-at-map' | 'attacking' | 'celebrating'
- `activeBattle`: BattleState | null - Current battle animation details
- `pendingLevelUp`: boolean - Flags level-up celebration pending
- `isAnimating`: boolean - Blocks user interactions during animations

**TypeScript Interface:**

```typescript
type KnightState = 
  | 'idle' 
  | 'sharpening-sword' 
  | 'looking-at-map' 
  | 'adjusting-armor'
  | 'attacking' 
  | 'celebrating';

interface BattleState {
  enemyId: string;
  enemyType: EnemyType;
  phase: 'knight-attack' | 'enemy-defeat' | 'victory' | 'xp-award' | 'complete';
  xpAwarded: number;
  startedAt: number; // Timestamp for animation timing
}

interface GameState {
  knightState: KnightState;
  activeBattle: BattleState | null;
  pendingLevelUp: boolean;
  isAnimating: boolean;
  lastInteractionAt: number; // For idle animation timing
}
```

**Relationships:**
- Game state is global singleton
- BattleState references Enemy by ID
- Not persisted (resets to initial state on page load)

## Application State Model (Root Store)

**Purpose:** Top-level Zustand store that combines all state slices with actions. This is the single source of truth for the entire application.

**TypeScript Interface:**

```typescript
interface AppState {
  // State slices
  tasks: Task[];
  player: Player;
  enemies: Enemy[];
  game: GameState;
  
  // Task actions
  createTask: (title: string, description: string, urgency: Task['urgency']) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  deleteTask: (taskId: string) => void;
  
  // Player actions
  awardXP: (amount: number) => void;
  levelUp: () => void;
  
  // Enemy actions
  spawnEnemy: (task: Task) => Enemy;
  removeEnemy: (enemyId: string) => void;
  updateEnemyPosition: (enemyId: string, position: Position) => void;
  
  // Game actions
  startBattle: (enemyId: string) => void;
  advanceBattlePhase: () => void;
  completeBattle: () => void;
  updateKnightState: (state: KnightState) => void;
  
  // Persistence
  hydrate: () => void; // Load from LocalStorage
  persist: () => void; // Save to LocalStorage
}
```

**Relationships:**
- Root store composed of all model slices
- Actions encapsulate business logic
- Zustand middleware handles LocalStorage persistence automatically

## LocalStorage Schema

**Purpose:** Define the exact structure persisted to browser LocalStorage for state restoration.

```typescript
interface PersistedState {
  version: 1; // Schema version for future migrations
  tasks: Task[];
  player: Player;
  lastSaved: number; // Timestamp
}

// LocalStorage key
const STORAGE_KEY = 'quest-knight-state';
```

**Persistence Rules:**
- `tasks` array persisted (all statuses, including completed)
- `player` state persisted
- `enemies` NOT persisted (regenerated from tasks)
- `game` state NOT persisted (resets to idle)
- Maximum storage size check: ~5MB limit (warn at 4MB)

