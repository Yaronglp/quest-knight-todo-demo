# Epic 2: Visual Polish, Enemy Variety & Demo Readiness

**Expanded Goal:** Transform the working proof-of-concept from Epic 1 into a polished, demo-ready showcase application. Add visual richness through enemy variety (goblins for non-urgent tasks), enhanced knight interactivity, and smooth UI polish. Optimize performance to achieve consistent 60fps animations and ensure the application creates immediate "wow moments" for productivity enthusiasts. After Epic 2, the application is presentation-ready for stakeholder demos and conference showcases.

---

## Story 2.1: Goblin Enemies for Non-Urgent Tasks

**As a** user,  
**I want** non-urgent tasks to spawn goblin enemies that look different from dragons,  
**so that** I can visually distinguish task urgency levels in the game world.

**Acceptance Criteria:**

1. When user creates task with urgency="normal", a goblin visual element appears in the game area
2. Each non-urgent task generates exactly one goblin enemy
3. Goblins display with distinctly different sprite/visual from dragons (smaller, different color, less threatening)
4. Goblins position in game area without overlapping dragons or other goblins
5. Goblin visual style communicates "lesser threat" compared to dragons
6. Each goblin maintains association with its source non-urgent task (via task ID)
7. When non-urgent task is completed, corresponding goblin becomes defeatable (visual indicator)
8. Completing non-urgent task triggers battle animation with goblin enemy (reuse battle system from Story 1.6)
9. Goblin defeat animation differs from dragon defeat (faster, simpler, less dramatic)
10. XP system correctly awards 50 XP for goblin defeats vs. 100 XP for dragon defeats
11. Task list UI visually distinguishes urgent vs. non-urgent tasks clearly
12. Game area accommodates mixed dragons and goblins without layout issues

---

## Story 2.2: Interactive Knight Character

**As a** user,  
**I want** to click on my knight character and see responsive animations,  
**so that** the game world feels interactive and my character feels alive.

**Acceptance Criteria:**

1. Knight character is clickable/interactive via mouse click
2. Clicking knight triggers reaction animation (wave, sword flourish, jump, or other action)
3. Reaction animation plays for 1-2 seconds then returns to idle state
4. Multiple rapid clicks queue or ignore subsequent clicks until current animation completes
5. Click interaction provides satisfying feedback (animation + optional visual effect)
6. Knight remains in original position after interaction (doesn't move permanently)
7. Interaction works consistently across different game states (idle, during dragon presence)
8. Hover state provides visual feedback that knight is interactive (cursor change, subtle highlight)
9. Interaction doesn't interfere with task management or battle animations
10. Knight interaction adds personality without distracting from core task completion loop

---

## Story 2.3: Enhanced Idle Animation Suite

**As a** user,  
**I want** my knight to perform varied idle animations,  
**so that** the character feels alive and the game world feels dynamic.

**Acceptance Criteria:**

1. Knight cycles through multiple idle animations: sharpening sword, looking at map, adjusting armor
2. Idle animation transitions happen naturally every 5-10 seconds
3. Each idle animation lasts 2-4 seconds before returning to base idle state
4. Animations selected randomly or in sequence to provide variety
5. Idle animations perform smoothly at 30-60fps
6. Animations don't interfere with battle sequences (battle takes priority)
7. All idle animations maintain knight's position (no movement across screen)
8. Animations reinforce adventurer/hero theme
9. Dragon presence doesn't stop idle animations (knight remains active)
10. Visual consistency maintained across all animation states

---

## Story 2.4: UI/UX Layout Polish and Visual Refinement

**As a** user,  
**I want** a polished, cohesive interface with smooth interactions,  
**so that** the application feels professional and enjoyable to use.

**Acceptance Criteria:**

1. Desktop layout (1920x1080) comfortably displays all elements: game area, task list, XP bar
2. Visual hierarchy clearly emphasizes knight character and game area as primary focus
3. Task list panel styled with fantasy/dungeon crawler theme consistent with game area
4. XP progress bar displays prominently with smooth fill animations
5. Level display shows current level with celebration effect on level-up
6. Color scheme cohesive across all UI elements (consistent palette)
7. Typography uses fantasy-appropriate fonts for headers, readable fonts for task text
8. All buttons and interactive elements have hover states and click feedback
9. Task creation form/modal styled consistently with overall theme
10. Loading states handled gracefully (if any async operations exist)
11. Empty states provide helpful guidance ("Create your first quest to begin!")
12. Completed tasks section visually separated or styled differently from active tasks
13. Overall aesthetic evokes dungeon crawler RPG without looking cluttered
14. Responsive layout tested at 1920x1080, 2560x1440, and 3840x2160 resolutions

---

## Story 2.5: Performance Optimization and 60fps Target

**As a** user,  
**I want** smooth animations without lag or stuttering,  
**so that** the game feels responsive and professional.

**Acceptance Criteria:**

1. All animations achieve target 60fps on modern desktop hardware (tested with Chrome DevTools Performance)
2. Battle animations use requestAnimationFrame for smooth rendering
3. Component renders optimized with React.memo, useMemo, useCallback where appropriate
4. No unnecessary re-renders detected during animation sequences
5. LocalStorage operations don't block UI thread (async if needed)
6. Sprite assets optimized (compressed images, sprite sheets if applicable)
7. Game area renders efficiently even with 5+ dragons and goblins visible
8. Task list renders efficiently with 20+ tasks
9. No console warnings or errors during normal operation
10. Performance monitoring reveals no memory leaks during extended sessions (30+ minutes)
11. Animation quality degrades gracefully on older hardware (30fps fallback acceptable)
12. Profiling confirms no long tasks blocking main thread (>50ms)

---

## Story 2.6: Demo Quick Start and First-Run Experience

**As a** user,  
**I want** to experience a "wow moment" within 90 seconds,  
**so that** the app creates immediate excitement and understanding.

**Acceptance Criteria:**

1. First-time users see helpful onboarding message explaining the concept briefly
2. Option to seed demo with 1-2 pre-created urgent tasks (toggleable via URL param or config)
3. Pre-seeded tasks allow immediate task completion → battle animation → XP gain flow
4. Onboarding message explains: "Complete tasks to battle enemies and level up!"
5. First dragon battle triggers within 90 seconds for demo scenarios
6. Demo mode setting available to reset progress and restart demonstration
7. Clear visual cues guide new users to task creation action
8. First task creation provides tooltips or guidance (optional: animated pointer or highlight)
9. Demo flow optimized: Create task (10 sec) → See dragon (instant) → Complete task (5 sec) → Battle animation (3 sec) → XP gain (2 sec) = <30 second first wow moment
10. Demo mode can be exited to normal mode for actual use
11. Instructions or help panel accessible but not obtrusive

---

## Story 2.7: Accessibility and Reduced Motion Support

**As a** user with motion sensitivity,  
**I want** the option to reduce or disable animations,  
**so that** I can use the application comfortably.

**Acceptance Criteria:**

1. Application respects `prefers-reduced-motion` media query from browser/OS settings
2. When reduced motion enabled, battle animations simplify to static transitions or very subtle effects
3. XP bar fill animation simplified or instantaneous in reduced motion mode
4. Knight idle animations reduced or disabled in reduced motion mode
5. Level-up celebrations simplified (text notification instead of animation)
6. Core functionality (task management, XP gain, level progression) works identically in reduced motion mode
7. Manual toggle available in settings/options to enable/disable animations regardless of system preference
8. Keyboard navigation supports all task management functions (create, complete, delete)
9. Tab order logical through task list, creation form, and interactive elements
10. Focus indicators visible on all interactive elements
11. ARIA labels provided for game state ("Current level: 3", "5 active quests")
12. Color contrast meets WCAG AA standards for all text elements

