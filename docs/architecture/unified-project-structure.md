# Unified Project Structure

```
quest-knight/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Run tests on PR
│       └── deploy.yml                # Deploy to Vercel on merge
│
├── frontend/                         # React application (MVP focus)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # Reusable UI components
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── ProgressBar/
│   │   │   │   ├── Modal/
│   │   │   │   ├── Badge/
│   │   │   │   └── Tooltip/
│   │   │   ├── task/                 # Task management
│   │   │   ├── game/                 # Game world
│   │   │   └── player/               # Player progression
│   │   ├── layouts/
│   │   │   └── MainLayout/           # Three-panel desktop layout
│   │   ├── store/                    # Zustand state management
│   │   │   ├── index.ts
│   │   │   ├── slices/
│   │   │   └── middleware/
│   │   ├── services/                 # Business logic services
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── types/                    # TypeScript definitions
│   │   ├── utils/                    # Utility functions
│   │   ├── styles/                   # Global styles
│   │   ├── assets/                   # Static assets
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── public/
│   │   ├── favicon.ico
│   │   └── robots.txt
│   ├── tests/
│   │   ├── unit/
│   │   ├── component/
│   │   └── setup.ts
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── README.md
│
├── backend/                          # Future: Serverless functions (Post-MVP)
│
├── docs/                             # Project documentation
│   ├── brief.md
│   ├── prd.md
│   ├── architecture.md               # This document
│   └── front-end-spec.md
│
├── .cursor/                          # Cursor IDE rules
├── .gitignore
├── package.json
├── README.md
└── vercel.json                       # Vercel deployment config
```

**File Naming Conventions:**

| File Type | Convention | Example |
|-----------|-----------|---------|
| React Component | PascalCase | `TaskCard.tsx` |
| Component Styles | ComponentName.module.css | `TaskCard.module.css` |
| Component Tests | ComponentName.test.tsx | `TaskCard.test.tsx` |
| Hooks | camelCase with 'use' prefix | `useStore.ts` |
| Services | camelCase | `animationController.ts` |
| Types | camelCase | `models.ts` |
| Utils | camelCase | `validators.ts` |
| Constants | SCREAMING_SNAKE_CASE | `XP_REWARDS` |

