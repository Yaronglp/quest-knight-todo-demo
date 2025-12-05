# Coding Standards

These standards define **MINIMAL but CRITICAL** rules to prevent common mistakes.

## Critical Rules

- **Type Sharing:** Always define shared types in `frontend/src/types/models.ts`

- **State Access:** Never access Zustand state directly. Always use selector functions.
  ```typescript
  // ❌ BAD: Causes re-render on ANY state change
  const { tasks, player } = useStore();
  
  // ✅ GOOD: Only re-renders when tasks change
  const tasks = useStore(state => state.tasks);
  ```

- **Animation Properties:** Only animate `transform` and `opacity`. Never animate `width`, `height`, `top`, `left`.

- **LocalStorage Schema:** Never modify `PersistedState` without incrementing version and adding migration.

- **Enemy-Task Association:** Every enemy MUST have a `taskId` referencing an existing task.

- **Battle State Machine:** Phases MUST progress in order: `knight-attack` → `enemy-defeat` → `victory` → `xp-award` → `complete`.

- **XP Rewards:** Use constants from `utils/constants.ts`. Never hardcode XP values.

- **Component Memoization:** Wrap list items (`TaskCard`, `EnemyEntity`) in `React.memo()`.

- **Accessibility Labels:** All icon-only buttons MUST have `aria-label`. All images MUST have `alt` text.

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| React Components | PascalCase | `TaskCard` |
| Hooks | camelCase with 'use' | `useStore` |
| Services | camelCase | `animationController` |
| Constants | SCREAMING_SNAKE_CASE | `XP_REWARDS` |
| CSS Modules | camelCase | `taskCard` |

## Git Commit Conventions

```bash
# Format: <type>(<scope>): <subject>

feat(game): add dragon battle animation
fix(store): prevent duplicate enemy spawns
perf(animation): optimize particle rendering
docs(readme): add setup instructions
test(xp): add level calculation unit tests
```

