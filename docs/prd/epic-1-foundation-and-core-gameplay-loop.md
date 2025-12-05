# Epic 1: Foundation & Core Gameplay Loop

**Expanded Goal:** Establish the complete development environment with React, TypeScript, and build tooling, then implement the minimum viable game experience that proves the core concept. Users must be able to create urgent tasks that spawn dragon enemies on screen, complete those tasks through satisfying animated battle sequences, and see their progress reflected through XP gains and level progression. All state persists across browser sessions using LocalStorage. This epic delivers a working proof-of-concept that validates whether transforming task completion into dungeon crawler gameplay creates genuine emotional engagement.

---

## Story 1.1: Project Setup & Basic Application Shell

**As a** developer,  
**I want** a fully configured React + TypeScript project with build tools and basic application structure,  
**so that** I can begin implementing features in a well-organized codebase.

**Acceptance Criteria:**

1. Monorepo created with frontend directory containing React 18+ application
2. TypeScript configured with strict mode and appropriate compiler options
3. Vite build tool configured with dev server, hot module replacement, and production builds
4. ESLint and Prettier configured for code quality
5. Git repository initialized with .gitignore for node_modules, build artifacts, and IDE files
6. Package.json includes all required dependencies: React, TypeScript, animation library (Framer Motion), CSS solution
7. Basic application shell renders "Quest Knight" header and empty game area
8. Application runs successfully on `npm run dev` with no console errors
9. Project README documents setup steps, available scripts, and project structure

---

## Story 1.2: Task Creation and Display System

**As a** user,  
**I want** to create tasks with title, description, and urgency level, and see them displayed in a list,  
**so that** I can manage my todos within the game interface.

**Acceptance Criteria:**

1. Task creation form/modal includes fields for title (required), description (optional), and urgency toggle (urgent/normal)
2. Tasks are stored in React state using Context API or useReducer for state management
3. Task list UI displays all created tasks with title, description, urgency indicator, and status
4. Each task shows urgency level with clear visual differentiation (color, icon, or label)
5. Task status defaults to "todo" when created
6. Users can mark tasks as "done" via button or checkbox interaction
7. Completed tasks visibly change appearance (strikethrough, different color, or separate section)
8. Empty state displays when no tasks exist with helpful message ("Create your first quest!")
9. Task creation form validates that title is not empty before allowing submission
10. UI layout reserves space for both task list and game area (split-pane or side-by-side layout)

---

## Story 1.3: LocalStorage Persistence Layer

**As a** user,  
**I want** my tasks and game progress automatically saved,  
**so that** I don't lose my data when closing the browser.

**Acceptance Criteria:**

1. All tasks serialize to LocalStorage automatically when created, updated, or completed
2. Application state (tasks array) loads from LocalStorage on app initialization
3. If no saved data exists, app initializes with empty task array
4. LocalStorage operations handle serialization/deserialization using JSON.stringify/parse
5. Tasks persist their properties: id, title, description, urgency, status, creation timestamp
6. Error handling gracefully manages LocalStorage quota exceeded or unavailable scenarios
7. Console log confirms successful save/load operations during development
8. Multiple browser tabs stay in sync with most recent changes (use storage event listener)
9. Clear data option available in UI for testing purposes (can be hidden debug feature)

---

## Story 1.4: Dragon Enemy Spawning System

**As a** user,  
**I want** dragons to appear on screen when I create urgent tasks,  
**so that** I see immediate visual feedback connecting my tasks to the game world.

**Acceptance Criteria:**

1. When user creates task with urgency="urgent", a dragon visual element appears in the game area
2. Each urgent task generates exactly one dragon enemy
3. Dragons display as sprite images or SVG graphics with clear visual identity
4. Dragons position themselves in the game area without overlapping excessively (basic positioning logic)
5. Dragons include visual threat indicators (size, color, effects) to convey danger
6. Each dragon maintains association with its source task (via task ID)
7. When urgent task is marked done, corresponding dragon becomes "defeatable" (visual indicator changes)
8. Dragons remain visible until their associated task is completed
9. If user creates multiple urgent tasks, multiple dragons appear on screen
10. Game area layout accommodates multiple dragons without layout breaking (max 5 dragons tested)

---

## Story 1.5: XP and Level Progression System

**As a** user,  
**I want** to earn experience points and level up,  
**so that** I feel rewarded for completing tasks and see my progress over time.

**Acceptance Criteria:**

1. User profile state includes current XP (number) and level (number, starts at 1)
2. Completing any task awards XP: urgent tasks = 100 XP, normal tasks = 50 XP
3. XP progression curve defined: Level 2 requires 100 XP, Level 3 requires 250 XP total, Level 4 requires 500 XP total (exponential curve)
4. When user accumulates enough XP, level automatically increments
5. XP progress bar displays current XP, XP needed for next level, and progress percentage
6. Level display shows current level prominently in UI header or fixed position
7. Progress bar updates smoothly when XP is awarded (animated fill)
8. XP and level persist to LocalStorage along with tasks
9. XP and level restore correctly from LocalStorage on app load
10. Level-up triggers visual notification (simple alert or toast message for MVP)

---

## Story 1.6: Battle Animation on Task Completion

**As a** user,  
**I want** to see an animated battle sequence when I complete urgent tasks,  
**so that** task completion feels exciting and rewarding.

**Acceptance Criteria:**

1. When user completes urgent task (marks as done), battle animation sequence initiates automatically
2. Knight character sprite/image appears or moves into position for battle
3. Knight performs attack animation (sword swing, movement toward dragon)
4. Dragon performs defeat animation (damage reaction, fade out, or explosion effect)
5. Victory celebration animation plays (knight victory pose, particles, or screen flash)
6. Battle sequence takes 2-4 seconds total and cannot be interrupted
7. During battle animation, UI displays animation overlay to maintain focus
8. After battle completes, dragon disappears from game area
9. XP award animation plays immediately after battle ("+100 XP" floating text or similar)
10. If level-up occurs, level-up celebration displays after XP award
11. Battle animation uses Framer Motion or chosen animation library for smooth 60fps performance
12. Completed task remains in task list with "done" status after animation completes

---

## Story 1.7: Knight Character with Idle State

**As a** user,  
**I want** to see an animated knight character in the game area,  
**so that** I have a visual protagonist representing me in the game world.

**Acceptance Criteria:**

1. Knight character sprite/image displays prominently in the game area (left or center position)
2. Knight idle animation loops continuously when no battle is active (subtle movement like breathing, sword shimmer)
3. Knight sprite quality matches dragon sprite aesthetic (consistent art style)
4. Knight has clear visual identity (recognizable as player character, heroic appearance)
5. Knight position remains fixed during idle state (doesn't wander)
6. Idle animation performs smoothly at 30-60fps without performance impact
7. Knight persists on screen throughout entire app session
8. Knight state doesn't require LocalStorage persistence (visual only for MVP)

