# Monitoring and Observability

## Monitoring Stack

**Frontend Monitoring:**
- **Vercel Analytics:** Web Vitals, Core Web Vitals, geographic distribution
- **React DevTools Profiler:** Component render performance (development)
- **Browser Console:** LocalStorage inspection, custom metrics (development)
- **Future (Post-MVP):** Sentry for error tracking

**Key Metrics:**

**Core Web Vitals (Automatic via Vercel):**
- LCP (Largest Contentful Paint): Target <2.5s
- FID (First Input Delay): Target <100ms
- CLS (Cumulative Layout Shift): Target <0.1

**Custom Application Metrics:**

```typescript
// Track animation performance
export const trackAnimationMetrics = () => {
  let frameCount = 0;
  let fps = 60;
  
  const measureFPS = () => {
    // Measure FPS and log if <30
  };
  
  requestAnimationFrame(measureFPS);
};

// Track LocalStorage usage
export const trackStorageUsage = () => {
  let totalSize = 0;
  for (const key in localStorage) {
    totalSize += localStorage[key].length + key.length;
  }
  const sizeKB = totalSize / 1024;
  
  if (sizeKB > 4000) { // Warn at 80% of 5MB limit
    console.warn(`LocalStorage usage: ${sizeKB.toFixed(2)} KB`);
  }
};
```

## Performance Monitoring Tools

**React Profiler Integration:**

```typescript
const onRenderCallback = (id, phase, actualDuration) => {
  if (actualDuration > 16) { // 60fps = 16.67ms per frame
    console.warn(`Slow render: ${id} took ${actualDuration}ms`);
  }
};

<Profiler id="BattleAnimation" onRender={onRenderCallback}>
  <BattleAnimation />
</Profiler>
```

**Performance Observer API:**

```typescript
// Observe long tasks (>50ms)
const longTaskObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 50) {
      console.warn('Long task:', entry.name, entry.duration);
    }
  }
});

longTaskObserver.observe({ entryTypes: ['longtask'] });
```

## Debugging Tools

**Development Debug Panel:**

```typescript
// Expose store to window for debugging
if (import.meta.env.DEV) {
  (window as any).__QUEST_KNIGHT_STORE__ = useStore;
}

// Usage in console:
// window.__QUEST_KNIGHT_STORE__.getState()
```

