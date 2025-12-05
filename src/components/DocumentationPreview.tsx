import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XP_REWARDS } from '../utils/constants';

type DocumentType = 'brief' | 'prd' | 'architecture' | 'stories';

interface DocumentConfig {
  title: string;
  description: string;
  icon: string;
  content: string;
}

const DOCUMENTS: Record<DocumentType, DocumentConfig> = {
  brief: {
    title: 'Project Brief',
    description: 'High-level project overview and objectives',
    icon: '📋',
    content: `# Quest Knight - Project Brief

## Overview
Quest Knight is a gamified task management application that transforms everyday productivity into an epic adventure.

## Core Concept
- **Tasks become quests** - Your to-do items spawn enemies in a fantasy world
- **Completion equals victory** - Finishing tasks triggers epic battle animations
- **Progress feels rewarding** - XP system and level progression keep you motivated

## Key Features
- Urgent tasks spawn powerful dragons (${XP_REWARDS.URGENT_TASK} XP)
- Normal tasks spawn goblins (${XP_REWARDS.NORMAL_TASK} XP)
- Interactive knight character with personality
- Smooth battle animations and celebrations
- Local storage persistence across sessions

## Tech Stack
- React + TypeScript for type-safe UI
- Framer Motion for fluid animations
- Zustand for state management
- Tailwind CSS for styling
- Vite for fast development
`,
  },
  prd: {
    title: 'Product Requirements',
    description: 'Detailed feature specifications and acceptance criteria',
    icon: '📖',
    content: `# Product Requirements Document

## Epic 1: Foundation & Core Gameplay Loop
Built the foundational task management system with dragon enemies, XP progression, and battle animations.

**Completed Stories:**
- ✅ Project setup and architecture
- ✅ Task creation and display
- ✅ LocalStorage persistence
- ✅ Dragon enemy spawning for urgent tasks
- ✅ XP and level progression system
- ✅ Battle animations with victory celebrations

## Epic 2: Visual Polish & Enemy Variety
Enhancing the experience with goblins, interactive characters, and demo readiness.

**Stories:**
- ✅ Goblin enemies for non-urgent tasks
- ✅ Interactive knight character with click animations
- ✅ Enhanced idle animation suite
- 📋 UI/UX layout polish
- 📋 Performance optimization (60fps target)
- 📋 Demo quick start experience

## User Experience Goals
1. **Immediate Engagement** - Users should feel excited within 90 seconds
2. **Satisfying Feedback** - Every action should have clear visual response
3. **Progressive Enhancement** - Core features work without fancy animations
4. **Professional Polish** - Smooth 60fps animations on modern hardware

## Target Audience
- Productivity enthusiasts looking for motivation
- Gamification fans who enjoy RPG mechanics

`,
  },
  architecture: {
    title: 'Architecture Overview',
    description: 'System design and technical implementation details',
    icon: '🏗️',
    content: `# Architecture Overview

## System Design

### Frontend Architecture
**Component Structure:**
- \`App.tsx\` - Main layout and orchestration
- \`gameStore.ts\` - Zustand state management
- \`components/\` - Reusable UI components
  - Task management (TaskForm, TaskList, TaskCard)
  - Game elements (Knight, Dragon, Goblin)
  - Animations (BattleAnimation, XPAwardAnimation)
  - UI feedback (PlayerStatus, LevelUpNotification)

### State Management (Zustand)
\`\`\`typescript
interface GameState {
  tasks: Task[];           // User's to-do items
  player: Player;          // Level and XP tracking
  enemies: Enemy[];        // Dragons and goblins in game area
  battle: BattleState;     // Active battle orchestration
}
\`\`\`

### Data Flow
1. **Task Creation** → Spawns enemy (dragon/goblin)
2. **Task Completion** → Marks enemy as defeatable
3. **Enemy Click** → Triggers battle animation
4. **Battle Complete** → Awards XP, checks for level-up
5. **State Sync** → LocalStorage persistence

### Animation System
- **Framer Motion** for declarative animations
- **requestAnimationFrame** timing for smooth 60fps
- **Phase-based battles** (enter → attack → defeat → victory → XP)
- **Reduced motion support** via prefers-reduced-motion

### Performance Optimizations
- Zustand selectors to prevent unnecessary re-renders
- Optimized animation keyframes
- Lazy-loaded assets (when applicable)
- Grid-based enemy positioning to prevent overlap

### Persistence Strategy
- LocalStorage for client-side data
- JSON serialization with version migration
- Orphaned enemy cleanup on load
- Cross-tab synchronization via storage events

## Tech Stack Justification
- **React**: Industry-standard, great ecosystem
- **TypeScript**: Type safety prevents runtime errors
- **Zustand**: Lightweight, no boilerplate
- **Framer Motion**: Best-in-class animations
- **Tailwind**: Rapid styling, consistent design
- **Vite**: Lightning-fast development

`,
  },
  stories: {
    title: 'User Stories',
    description: 'Detailed story breakdowns and implementation guides',
    icon: '📚',
    content: `# User Stories

## Story 2.1: Goblin Enemies ✅
**As a** user, **I want** non-urgent tasks to spawn goblins, **so that** I can visually distinguish task urgency.

**Implementation:**
- Created Goblin component (smaller, green theme)
- Updated gameStore to spawn goblins for normal tasks
- Modified battle system for ${XP_REWARDS.NORMAL_TASK} XP rewards
- Added visual distinction in TaskCard component

## Story 2.2: Interactive Knight ✅
**As a** user, **I want** to click my knight and see animations, **so that** the game feels interactive.

**Implementation:**
- Added click handlers to Knight component
- Three interaction types: wave, jump, flourish
- Hover state with "Click me!" tooltip
- Animation queue to prevent spam

## Story 2.3: Enhanced Idle Animations ✅
**As a** user, **I want** varied idle animations, **so that** my character feels alive.

**Implementation:**
- Four idle states: breathing, sharpening, map, armor
- Random cycling every 5-10 seconds
- Each animation lasts 2-4 seconds
- Visual indicators (sword, map, shield icons)

`,
  },
};

/**
 * Helper function to parse bold text markers (**)
 * Moved outside component to avoid recreation on every render
 */
const parseBoldText = (text: string) => {
  if (!text.includes('**')) {
    return text;
  }
  const parts = text.split('**');
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-dark-100">
        {part}
      </strong>
    ) : (
      part
    )
  );
};

export const DocumentationPreview: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [activeDoc, setActiveDoc] = React.useState<DocumentType>('brief');
  const [isMinimized, setIsMinimized] = React.useState(false);

  const currentDoc = DOCUMENTS[activeDoc];

  return (
    <>
      {/* Toggle Button */}
      {!isVisible && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 right-4 z-30 rounded-lg bg-primary-600 px-4 py-2 font-fantasy text-sm font-semibold text-white shadow-lg hover:bg-primary-700"
        >
          📖 Show Quest Knight Docs
        </motion.button>
      )}

      {/* Documentation Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 z-40 flex h-screen w-full flex-col bg-dark-900 shadow-2xl sm:w-96"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-primary-500 bg-dark-800 p-4">
              <div>
                <h2 className="font-fantasy text-xl font-bold text-primary-400">
                  Documentation
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-dark-300 hover:text-dark-100"
                  aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  {isMinimized ? '📖' : '📕'}
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-dark-300 hover:text-dark-100"
                  aria-label="Close documentation"
                >
                  ✕
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Navigation Tabs */}
                <div className="grid grid-cols-4 border-b border-dark-700 bg-dark-850">
                  {(Object.keys(DOCUMENTS) as DocumentType[]).map((docType) => {
                    const doc = DOCUMENTS[docType];
                    return (
                      <button
                        key={docType}
                        onClick={() => setActiveDoc(docType)}
                        className={`flex flex-col items-center gap-1 p-3 transition-colors ${
                          activeDoc === docType
                            ? 'bg-dark-800 text-primary-400'
                            : 'text-dark-400 hover:bg-dark-800 hover:text-dark-200'
                        }`}
                        title={doc.title}
                      >
                        <span className="text-2xl">{doc.icon}</span>
                        <span className="text-xs font-medium">
                          {docType === 'brief'
                            ? 'Brief'
                            : docType === 'prd'
                            ? 'PRD'
                            : docType === 'architecture'
                            ? 'Arch'
                            : 'Stories'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-dark-900 p-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeDoc}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="prose prose-invert prose-sm max-w-none"
                    >
                      {/* Document Header */}
                      <div className="mb-4 rounded-lg border-2 border-primary-900 bg-primary-950 bg-opacity-20 p-3">
                        <h3 className="mb-1 font-fantasy text-lg font-bold text-primary-400">
                          {currentDoc.icon} {currentDoc.title}
                        </h3>
                        <p className="text-xs text-dark-300">{currentDoc.description}</p>
                      </div>

                      {/* Document Content - Simple formatting */}
                      <div className="space-y-3 text-sm text-dark-200">
                        {currentDoc.content.split('\n').map((line, index) => {
                          // Headers
                          if (line.startsWith('# ')) {
                            return (
                              <h1
                                key={index}
                                className="mb-2 mt-4 font-fantasy text-2xl font-bold text-primary-400"
                              >
                                {line.substring(2)}
                              </h1>
                            );
                          }
                          if (line.startsWith('## ')) {
                            return (
                              <h2
                                key={index}
                                className="mb-2 mt-3 font-fantasy text-xl font-semibold text-primary-400"
                              >
                                {line.substring(3)}
                              </h2>
                            );
                          }
                          if (line.startsWith('### ')) {
                            return (
                              <h3 key={index} className="mb-1 mt-2 font-semibold text-dark-100">
                                {line.substring(4)}
                              </h3>
                            );
                          }
                          // Lists
                          if (line.startsWith('- ')) {
                            return (
                              <li key={index} className="ml-4 text-dark-200">
                                {parseBoldText(line.substring(2))}
                              </li>
                            );
                          }
                          // Code blocks (simple detection)
                          if (line.startsWith('```')) {
                            return null; // Skip code fence markers
                          }
                          // Bold text (simple)
                          if (line.includes('**')) {
                            return (
                              <p key={index} className="text-dark-200">
                                {parseBoldText(line)}
                              </p>
                            );
                          }
                          // Empty lines
                          if (line.trim() === '') {
                            return <div key={index} className="h-2" />;
                          }
                          // Regular paragraphs
                          return (
                            <p key={index} className="text-dark-200">
                              {line}
                            </p>
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </>
            )}

            {/* Minimized State */}
            {isMinimized && (
              <div className="flex items-center justify-center p-8">
                <p className="text-center text-sm text-dark-400">
                  Click 📖 to expand documentation
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

