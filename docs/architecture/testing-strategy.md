# Testing Strategy

## Testing Pyramid

```
                    E2E Tests (Post-MVP)
                   /                    \
            Integration Tests (Post-MVP)
           /                              \
    Frontend Unit Tests          Component Tests
   /                    \        /                \
Services, Utils      React Components    Visual/Animation
(Vitest)            (React Testing Library)    (Manual)
```

**Testing Distribution (MVP):**
- **Unit Tests (40%):** Services, utilities, XP calculations, enemy positioning
- **Component Tests (40%):** React components with React Testing Library
- **Manual Testing (20%):** Animations, visual design, accessibility
- **E2E Tests (0%):** Deferred to post-MVP per PRD testing strategy

## Unit Testing

**Framework:** Vitest 1.0+

**Example:**

```typescript
// tests/unit/xpCalculator.test.ts
import { describe, it, expect } from 'vitest';
import { calculateLevel, XP_REWARDS } from '@/utils/constants';

describe('XP Calculation', () => {
  it('should return level 1 for 0 XP', () => {
    expect(calculateLevel(0)).toBe(1);
  });
  
  it('should return level 2 for 100 XP', () => {
    expect(calculateLevel(100)).toBe(2);
  });
  
  it('should award 100 XP for urgent tasks', () => {
    expect(XP_REWARDS.URGENT_TASK).toBe(100);
  });
});
```

**Coverage Target:** 80% for services and utilities

## Component Testing

**Framework:** React Testing Library + Vitest

**Example:**

```typescript
// components/task/TaskCard/TaskCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from './TaskCard';

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Defeat the dragon',
    urgency: 'urgent',
    status: 'todo',
    createdAt: Date.now(),
    completedAt: null,
  };
  
  it('should render task title', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Defeat the dragon')).toBeInTheDocument();
  });
  
  it('should show dragon icon for urgent tasks', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('🐉')).toBeInTheDocument();
  });
});
```

**Coverage Target:** 70% for components

## Manual Testing Checklist

**Animation Quality:**
- [ ] Dragon battle: 4 seconds duration, 60fps
- [ ] Goblin battle: 2.5 seconds duration, 60fps
- [ ] Level up: ~3 seconds, celebratory feel
- [ ] XP progress bar: smooth fill animation

**Accessibility:**
- [ ] Keyboard navigation works for all features
- [ ] Screen reader announces task creation/completion
- [ ] `prefers-reduced-motion` respected
- [ ] All interactive elements have focus indicators
- [ ] WCAG AA contrast ratios met

**Functional Testing:**
- [ ] Create/complete/delete tasks
- [ ] Urgent tasks spawn dragons
- [ ] Normal tasks spawn goblins
- [ ] XP/level progression works correctly
- [ ] LocalStorage persistence/restoration
- [ ] Multi-tab sync works

