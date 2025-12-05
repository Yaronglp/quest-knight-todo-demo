# Development Workflow

## Local Development Setup

**Prerequisites:**

```bash
# Node.js 18+ LTS
node --version  # Should be v18.0.0 or higher

# pnpm 8+
npm install -g pnpm@8

# Git
git --version
```

**Initial Setup:**

```bash
# Clone repository
git clone https://github.com/your-org/quest-knight.git
cd quest-knight

# Install dependencies
cd frontend
pnpm install

# Start dev server
pnpm run dev  # Opens http://localhost:5173
```

**Development Commands:**

```bash
# Start dev server with HMR
pnpm run dev

# Run tests
pnpm run test          # Run once
pnpm run test:watch    # Watch mode
pnpm run test:coverage # Generate coverage report

# Linting and formatting
pnpm run lint          # Run ESLint
pnpm run lint:fix      # Auto-fix issues
pnpm run format        # Run Prettier
pnpm run typecheck     # Run TypeScript compiler

# Build for production
pnpm run build         # Creates optimized build in dist/
pnpm run preview       # Preview production build locally
```

## Environment Configuration

```bash
# frontend/.env.local (created by developer, gitignored)

# Application settings
VITE_APP_NAME="Quest Knight"
VITE_APP_VERSION="1.0.0"

# Feature flags
VITE_ENABLE_DEBUG_MODE=true           # Show FPS counter, debug panel
VITE_STORAGE_KEY="quest-knight-state"
VITE_STORAGE_VERSION=1

# Future: Backend API (Post-MVP)
# VITE_API_BASE_URL=http://localhost:3000
```

## Code Quality Tools

**ESLint Configuration:**

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "plugins": ["@typescript-eslint", "react", "react-hooks", "jsx-a11y"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "jsx-a11y/click-events-have-key-events": "error"
  }
}
```

**Performance Monitoring During Development:**

```typescript
// FPS Counter (Debug Mode)
import { useEffect, useState } from 'react';

export const FPSCounter = () => {
  const [fps, setFps] = useState(60);
  
  useEffect(() => {
    if (!import.meta.env.VITE_ENABLE_DEBUG_MODE) return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }, []);
  
  if (!import.meta.env.VITE_ENABLE_DEBUG_MODE) return null;
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      background: fps < 30 ? 'red' : 'green',
      color: 'white',
      padding: '4px 8px'
    }}>
      {fps} FPS
    </div>
  );
};
```

