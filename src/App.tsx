import React from 'react';
import { Header } from './components/Header';
import { TaskListArea } from './components/TaskListArea';
import { GameArea } from './components/GameArea';
import { DebugControls } from './components/DebugControls';
import { LevelUpNotification } from './components/LevelUpNotification';
import { BattleAnimation } from './components/BattleAnimation';
import { DocumentationPreview } from './components/DocumentationPreview';
import { WelcomeModal } from './components/WelcomeModal';
import { ScreenReaderAnnouncer } from './components/ScreenReaderAnnouncer';
import { useStorageSync } from './hooks/useStorageSync';
import { useGameStore } from './store/gameStore';

function App() {
  // Enable cross-tab synchronization
  useStorageSync();

  // Group all state and context at the top (Tip #14)
  const battle = useGameStore((state) => state.battle);
  const endBattle = useGameStore((state) => state.endBattle);
  const enemies = useGameStore((state) => state.enemies);
  
  // Get enemy position for battle animation - use memoization for derived value
  const battleEnemy = React.useMemo(() => 
    battle.enemyId !== null 
      ? enemies.find((e) => e.id === battle.enemyId) ?? null
      : null,
    [battle.enemyId, enemies]
  );

  return (
    <div className="min-h-screen bg-dark-900 text-dark-50" role="application" aria-label="Quest Knight Task Management Game">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8" role="main">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Task List Area */}
          <TaskListArea />

          {/* Game Area */}
          <GameArea />
        </div>
      </main>

      {/* Debug Controls (Ctrl+Shift+D to toggle) */}
      <DebugControls />

      {/* Level Up Notification */}
      <LevelUpNotification />

      {/* Battle Animation */}
      <BattleAnimation
        isActive={battle.isActive}
        enemyId={battle.enemyId}
        enemyPosition={battleEnemy?.position || null}
        xpAwarded={battle.xpAwarded}
        onBattleComplete={endBattle}
      />

      <DocumentationPreview />

      {/* Welcome Modal for first-time users */}
      <WelcomeModal />

      {/* Screen Reader Announcements */}
      <ScreenReaderAnnouncer />
    </div>
  );
}

export default App;
