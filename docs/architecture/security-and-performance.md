# Security and Performance

## Security Requirements

**Frontend Security:**

**CSP Headers:**

```
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data: https:; 
  font-src 'self' data:
```

**Note:** `'unsafe-inline'` and `'unsafe-eval'` required for Framer Motion in MVP. Post-MVP: migrate to nonce-based CSP.

**XSS Prevention:**

- React automatically escapes JSX content
- Markdown sanitization with `disallowedElements: ['script', 'iframe']`
- Input validation for task titles/descriptions

**Secure Storage:**

LocalStorage data NOT encrypted in MVP (no sensitive data). Tasks are user's personal todos only.

## Performance Optimization

**Bundle Size Target:** <500KB uncompressed, <150KB gzipped

**Current Estimate:** ~738KB uncompressed (~220KB gzipped)

**Optimization Strategy:**
- Tree-shake Framer Motion (use only needed features)
- Replace react-markdown with lighter alternative if needed
- Convert sprites to WebP (90% size reduction)
- Aggressive code splitting via Vite

**Loading Strategy:**

```typescript
// Critical: Load immediately
import { TaskList } from '@/components/task/TaskList';
import { GameArea } from '@/components/game/GameArea';
import { XPProgressBar } from '@/components/player/XPProgressBar';

// Non-critical: Lazy load
const DocPreviewPane = lazy(() => import('@/components/docs/DocPreviewPane'));
const LevelUpCelebration = lazy(() => import('@/components/player/LevelUpCelebration'));
```

**React Optimization:**

```typescript
// Memoization for list items
export const TaskCard = React.memo(({ task }) => {
  // Component logic
});

// useCallback for event handlers
const handleComplete = useCallback(() => {
  updateTaskStatus(task.id, 'done');
}, [task.id, updateTaskStatus]);

// useMemo for expensive computations
const sortedTasks = useMemo(() => {
  return tasks.sort((a, b) => b.createdAt - a.createdAt);
}, [tasks]);
```

**Animation Optimization:**

Only animate GPU-accelerated properties (`transform`, `opacity`). Never animate `width`, `height`, `top`, `left` as they trigger layout reflows.

## Performance Monitoring Targets

**Web Vitals:**
- **LCP:** <2.5s
- **FID:** <100ms
- **CLS:** <0.1
- **FCP:** <1.8s
- **TTI:** <3.8s

**Animation Performance:**
- **Frame Rate:** 60fps sustained
- **Battle Duration:** 4s (dragon), 2.5s (goblin)
- **Jank Events:** <5 per minute

