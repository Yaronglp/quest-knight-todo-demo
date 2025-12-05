# Technical Assumptions

## Repository Structure: Monorepo

**Decision:** Single repository with clear frontend/backend separation

**Structure:**
```
quest-knight/
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Minimal Node.js API (future use)
│   ├── src/
│   └── package.json
├── docs/              # Project documentation
└── package.json       # Root workspace configuration
```

**Rationale:** Monorepo simplifies development for small team, enables shared TypeScript types between frontend/backend, and provides clear structure. Backend directory included for post-MVP expansion but not required for MVP.

**Tools:** npm workspaces or pnpm workspaces for dependency management

## Service Architecture

**MVP Architecture:** Frontend-only SPA (Single Page Application) with client-side state management

**Components:**
- **React 18+ Application:** Core UI and game logic
- **LocalStorage Persistence Layer:** All state saved client-side
- **Animation Engine:** React Spring OR Framer Motion for battle sequences
- **Optional Canvas Layer:** Phaser.js or PixiJS if DOM animations insufficient

**Post-MVP Evolution:** 
- Lightweight Node.js backend (Express/Fastify) for future features

**Rationale:** Start simple with pure frontend to meet MVP timeline. LocalStorage eliminates authentication, database, and deployment complexity.

## Testing Requirements

**MVP Testing Strategy:** Manual testing with automated unit tests for critical logic

**Coverage:**
- **Unit Tests (Required):** XP calculation, level progression, task state management, localStorage serialization/deserialization
- **Component Tests (Recommended):** React components with React Testing Library for task list, XP bar, battle animations
- **Integration Tests (Post-MVP):** Full user flows, animation sequences
- **E2E Tests (Post-MVP):** Playwright or Cypress for complete demo scenarios
- **Manual Testing (Required):** Animation quality, performance, emotional engagement - subjective measures

**Testing Constraints:**
- Animation quality cannot be fully automated - requires human evaluation
- Performance testing across browsers needs real device testing
- Accessibility testing with screen readers and keyboard navigation

**Rationale:** Given 5-7 day MVP timeline, prioritize automated tests for logic/state (easy to break, hard to test manually) and manual testing for animations (hard to automate, easy to evaluate). Full test pyramid deferred to post-MVP.

## Additional Technical Assumptions and Requests

**Frontend Technology Stack:**
- **Framework:** React 18+ with functional components and hooks (useState, useEffect, useContext, useReducer)
- **Language:** TypeScript for type safety and developer experience
- **State Management:** React Context API for global state (tasks, user XP/level, game state) - Redux/Zustand unnecessary for MVP scope
- **Animation Library:** 
  - **Primary Choice:** Framer Motion (declarative, React-optimized, excellent for UI animations)
  - **Alternative:** React Spring (physics-based, powerful but steeper learning curve)
  - **Fallback:** Phaser.js or PixiJS if DOM animations prove insufficient for battle sequences
- **Styling:** CSS Modules or Styled Components for scoped styling, consider Tailwind for rapid UI development
- **Build Tool:** Vite (fast HMR, optimized builds) or Create React App

**Browser APIs:**
- LocalStorage for persistence (synchronous, simple, sufficient for MVP)
- Canvas API if sprite-based animations chosen (for Phaser/PixiJS)
- requestAnimationFrame for smooth 60fps animations

**Asset Management:**
- Sprite assets: Source from itch.io, OpenGameArt.org, or Kenney.nl (free/paid)
- Sprite sheets for efficient animation (reduces asset loading)
- Consider commissioned custom sprites if budget allows ($50-200)

**Performance Optimization:**
- Lazy loading for non-critical components
- Memoization (React.memo, useMemo, useCallback) for expensive renders
- Sprite sheet optimization for animation performance
- requestAnimationFrame for all animations
- Performance monitoring from day 1 (React DevTools Profiler, Chrome Performance tab)

**Development Environment:**
- Node.js 18+ LTS
- npm or pnpm for package management
- ESLint + Prettier for code quality
- Git for version control
- VS Code recommended (good React/TypeScript support)

**Hosting & Deployment (MVP):**
- Static hosting: Netlify, Vercel, or GitHub Pages
- Automatic deployments from main branch
- No backend infrastructure required for MVP
- Environment variables for configuration (if needed)

**Security Considerations:**
- Client-side only = no authentication concerns for MVP
- No sensitive data stored (tasks are user's own device)
- Consider LocalStorage encryption for sensitive task content (post-MVP)
- Standard web security: HTTPS, CSP headers, XSS prevention

**Accessibility Requirements:**
- Respect `prefers-reduced-motion` media query
- Keyboard navigation support (tab order, focus management)
- ARIA labels for game state announcements
- Color contrast meeting WCAG AA
- Consider "efficiency mode" toggle for reduced animations

**Browser Support Matrix:**
| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Primary development target |
| Firefox | 88+ | Full support |
| Safari | 14+ | Test on macOS |
| Edge | 90+ | Chromium-based, similar to Chrome |

**Explicitly Out of Scope for MVP:**
- Mobile responsive design
- Touch input support
- Progressive Web App (PWA) features
- Offline functionality beyond LocalStorage
- Backend API or database
- User authentication
- Multi-user/multiplayer features
- Sound design and audio
- Internationalization (i18n)

