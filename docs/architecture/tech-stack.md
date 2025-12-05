# Tech Stack

This table is the **single source of truth** for all technology choices. Every development decision must reference this section.

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| **Frontend Language** | TypeScript | 5.3+ | Type-safe React development | Strong type safety prevents runtime errors, excellent IDE support, enables shared type definitions for future backend integration |
| **Frontend Framework** | React | 18.2+ | UI component framework | Industry standard, excellent performance with concurrent rendering, huge ecosystem, strong AI coding assistant support |
| **UI Component Library** | Custom Components | Built-in | Form inputs and game UI | Simple requirements (task form, buttons) don't warrant dependency. Custom ARIA labels for WCAG AA compliance |
| **State Management** | Zustand | 4.4+ | Global state (tasks, player, game) | Selector-based subscriptions prevent re-renders during 60fps animations. Minimal API (<1KB), zero boilerplate. Critical for NFR1 performance target |
| **Backend Language** | N/A (MVP) | - | Not applicable for MVP | Client-only architecture, deferred to post-MVP |
| **Backend Framework** | N/A (MVP) | - | Not applicable for MVP | No backend required for LocalStorage-based MVP |
| **API Style** | N/A (MVP) | - | Not applicable for MVP | Post-MVP will evaluate REST vs tRPC based on future integration needs |
| **Database** | Browser LocalStorage | Native API | Client-side task/state persistence | Zero setup, synchronous API, sufficient for MVP scope (<50 tasks), eliminates deployment complexity |
| **Cache** | Browser Memory | Native | In-memory state caching | Zustand provides efficient state caching, no additional layer needed |
| **File Storage** | Vercel CDN | Native | Sprite assets, static files | Integrated with hosting platform, global distribution, automatic cache invalidation |
| **Authentication** | N/A (MVP) | - | Not required for MVP | Single-user local application, deferred to post-MVP |
| **Frontend Testing** | Vitest | 1.0+ | Unit and component tests | Fast, Vite-native, Jest-compatible API, excellent TypeScript support. Focus for MVP per PRD testing strategy |
| **Backend Testing** | N/A (MVP) | - | Not applicable for MVP | Deferred to post-MVP |
| **E2E Testing** | Deferred (Post-MVP) | - | Future end-to-end testing | Playwright planned for post-MVP. MVP focuses on unit/component tests per PRD timeline constraints |
| **Build Tool** | Vite | 5.0+ | Dev server and production builds | Lightning-fast HMR (<50ms), optimized builds, native ESM, perfect for React + TypeScript |
| **Bundler** | Rollup (via Vite) | 4.0+ | Production bundling | Vite uses Rollup internally, excellent tree-shaking, optimal bundle sizes |
| **IaC Tool** | N/A (MVP) | - | Not required for static site | Vercel handles infrastructure, no IaC needed for MVP |
| **CI/CD** | GitHub Actions + Vercel | Native | Automated testing and deployment | Free for public repos, Vercel GitHub integration auto-deploys on push, run Vitest tests pre-deploy |
| **Monitoring** | Vercel Analytics | Native | Web Vitals, performance metrics | Built-in, zero-config, captures Core Web Vitals for NFR monitoring |
| **Logging** | Browser Console + Vercel Logs | Native | Error tracking and debugging | Console for development, Vercel captures production errors, upgrade to Sentry post-MVP if needed |
| **CSS Framework** | Tailwind CSS | 3.4+ | Utility-first styling | Rapid UI development, excellent DX, tree-shaking removes unused styles, easy to create fantasy theme with custom config |
| **Animation Library** | Framer Motion | 10.16+ | Battle animations, UI transitions | Declarative API, excellent performance with GPU acceleration, spring physics, gesture support. Best React animation library for complex sequences |
| **Code Quality** | ESLint + Prettier | ESLint 8+, Prettier 3+ | Linting and formatting | TypeScript ESLint, React hooks rules, Prettier Tailwind plugin for class sorting. Pre-commit hooks enforce consistency |
| **Performance Profiling** | React DevTools Profiler + Chrome Performance | Built-in | Animation frame rate monitoring | Required for NFR1 (60fps) validation. DevTools tracks render performance, Chrome Performance tracks frame timing |
| **Package Manager** | pnpm | 8.0+ | Dependency management | Faster than npm, efficient disk usage, strict by default (prevents phantom dependencies) |

