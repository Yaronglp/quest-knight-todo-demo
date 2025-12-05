# Core Workflows

## Create Urgent Task and Spawn Dragon

This workflow demonstrates the immediate visual feedback loop (PRD NFR9: first "wow moment" within 90 seconds).

```mermaid
sequenceDiagram
    actor User
    participant TaskForm as TaskForm Component
    participant Store as Zustand Store
    participant Persist as Persistence Service
    participant GameArea as GameArea Component
    participant Enemy as EnemyEntity Component
    
    User->>TaskForm: Clicks "New Quest" button
    TaskForm->>TaskForm: Opens modal, focus title input
    User->>TaskForm: Types title, description, sets urgency="urgent"
    User->>TaskForm: Clicks "Create"
    
    TaskForm->>TaskForm: Validates title non-empty
    TaskForm->>Store: createTask(title, description, 'urgent')
    
    Store->>Store: Generate UUID for task
    Store->>Store: Create Task object with status='todo'
    Store->>Store: Add task to tasks array
    Store->>Store: Call spawnEnemy(task)
    
    Store->>Store: Create Enemy object (type='dragon')
    Store->>Store: Calculate position (avoid overlap)
    Store->>Store: Add enemy to enemies array
    Store->>Store: Set enemy.animationState='idle'
    
    Store->>Persist: Auto-persist via middleware
    Persist->>Persist: Serialize tasks + player state
    Persist->>Persist: JSON.stringify and save to LocalStorage
    
    Store-->>GameArea: State update notification (new enemy)
    GameArea->>Enemy: Render dragon at position
    Enemy->>Enemy: Play spawn animation (fade in + scale)
    
    Store-->>TaskForm: State update notification
    TaskForm->>TaskForm: Close modal
    TaskForm-->>User: Returns to main view
    
    User->>User: Sees dragon appear in game area (<100ms)
    
    Note over User,Enemy: Total time from click to dragon visible: <100ms (NFR2)
```

## Complete Task and Battle Animation Sequence

This is the core gamification loop - the most complex and critical workflow (PRD Story 1.6).

```mermaid
sequenceDiagram
    actor User
    participant TaskItem as TaskItem Component
    participant Store as Zustand Store
    participant AnimCtrl as Animation Controller
    participant Battle as BattleAnimation Component
    participant Knight as KnightCharacter Component
    participant Enemy as EnemyEntity Component
    participant XPBar as XPProgressBar Component
    participant LevelUp as LevelUpCelebration Component
    
    User->>TaskItem: Clicks "Complete" button on urgent task
    TaskItem->>Store: updateTaskStatus(taskId, 'done')
    
    Store->>Store: Update task.status='done'
    Store->>Store: Set task.completedAt=Date.now()
    Store->>Store: Find associated enemy
    Store->>Store: Set enemy.isDefeatable=true
    
    Store->>AnimCtrl: startBattle(enemyId)
    
    AnimCtrl->>Store: Update game.isAnimating=true
    AnimCtrl->>Store: Create BattleState object
    AnimCtrl->>Store: Set activeBattle.phase='knight-attack'
    
    Store-->>Battle: State update (battle started)
    Battle->>Battle: Mount overlay component
    Battle->>Knight: Trigger attack animation
    Knight->>Knight: Play sword swing (1 second)
    
    Knight-->>AnimCtrl: onAnimationComplete callback
    AnimCtrl->>Store: Set activeBattle.phase='enemy-defeat'
    
    Store-->>Enemy: State update
    Enemy->>Enemy: Play defeat animation (1 second)
    Enemy-->>AnimCtrl: onAnimationComplete callback
    
    AnimCtrl->>Store: Set activeBattle.phase='victory'
    Store-->>Knight: State update
    Knight->>Knight: Victory pose animation (0.5 seconds)
    
    Knight-->>AnimCtrl: onAnimationComplete callback
    AnimCtrl->>Store: Set activeBattle.phase='xp-award'
    AnimCtrl->>Store: awardXP(100) for dragon defeat
    
    Store->>Store: Increment player.currentXP += 100
    Store->>Store: Increment player.totalDragonsDefeated
    Store->>Store: Calculate if level up needed
    
    alt Level Up Triggered
        Store->>Store: Increment player.currentLevel
        Store->>Store: Calculate new xpForNextLevel
        Store->>Store: Set game.pendingLevelUp=true
    end
    
    Store-->>XPBar: State update (XP increased)
    XPBar->>XPBar: Animate progress bar fill (0.5 seconds)
    XPBar->>XPBar: Show "+100 XP" floating text
    
    XPBar-->>AnimCtrl: onAnimationComplete callback
    AnimCtrl->>Store: removeEnemy(enemyId)
    AnimCtrl->>Store: Set activeBattle=null
    
    alt Level Up Occurred
        AnimCtrl->>Store: Set game.pendingLevelUp=false
        Store-->>LevelUp: State update
        LevelUp->>LevelUp: Mount celebration modal
        LevelUp->>LevelUp: Play celebration animation (1.5 seconds)
        LevelUp->>LevelUp: Display new level prominently
        User->>LevelUp: Clicks "Continue" or auto-dismiss
        LevelUp->>LevelUp: Unmount modal
    end
    
    AnimCtrl->>Store: Set game.isAnimating=false
    Store->>Store: Auto-persist to LocalStorage
    
    Store-->>TaskItem: State update (task completed)
    TaskItem->>TaskItem: Update visual (strikethrough, move to completed section)
    
    Note over User,LevelUp: Total sequence: 3-4 seconds (PRD Story 1.6 AC #6)
```

## Application Load and State Restoration

Demonstrates LocalStorage hydration and enemy regeneration from saved tasks.

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant App as App Component
    participant Store as Zustand Store
    participant Persist as Persistence Service
    participant GameArea as GameArea Component
    participant Enemy as EnemyEntity Component
    
    User->>Browser: Opens application URL
    Browser->>Browser: Load HTML, CSS, JS bundles from Vercel CDN
    Browser->>App: Mount React application
    
    App->>Store: Initialize Zustand store
    Store->>Persist: Zustand middleware calls rehydrate()
    
    Persist->>Persist: Read from localStorage['quest-knight-state']
    
    alt State Found
        Persist->>Persist: JSON.parse(savedState)
        Persist->>Persist: Validate schema version
        Persist-->>Store: Return PersistedState
        
        Store->>Store: Restore tasks array
        Store->>Store: Restore player state (XP, level)
        
        Store->>Store: Regenerate enemies from active tasks
        loop For each active task (status != 'done')
            Store->>Store: Call spawnEnemy(task)
            Store->>Store: Calculate enemy position
            Store->>Store: Add enemy to enemies array
        end
        
        Store->>Store: Initialize game state to idle
    else No State Found
        Store->>Store: Initialize with empty tasks array
        Store->>Store: Initialize player (level=1, XP=0)
        Store->>Store: Initialize empty enemies array
        Store->>Store: Initialize game state to idle
    end
    
    Store-->>App: Hydration complete
    App->>App: Render Layout component
    
    App->>GameArea: Render with enemies state
    loop For each enemy
        GameArea->>Enemy: Render at saved position
        Enemy->>Enemy: Play spawn animation
    end
    
    App->>App: Render TaskList, XP Bar, etc.
    
    Browser-->>User: Application fully loaded and interactive
    
    Note over User,Enemy: Load time target: <3 seconds (NFR3)
```

