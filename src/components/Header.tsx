import React from 'react';
import { PlayerStatus } from './PlayerStatus';

/**
 * Application header with title and player status
 */
export const Header: React.FC = React.memo(() => {
  return (
    <header className="border-b-2 border-primary-500 bg-dark-800 shadow-lg" role="banner">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="font-fantasy text-4xl font-bold text-primary-400">Quest Knight</h1>
          
          {/* Player Status - Desktop */}
          <div className="hidden w-64 md:block">
            <PlayerStatus />
          </div>
        </div>

        {/* Player Status - Mobile */}
        <div className="mt-4 md:hidden">
          <PlayerStatus />
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

