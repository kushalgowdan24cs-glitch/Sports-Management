import React from 'react';
import { Outlet } from 'react-router-dom';
import { PlayerSidebar } from '@/components/player/PlayerSidebar';
import { PlayerTopbar } from '@/components/player/PlayerTopbar';

export const PlayerLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      {/* Sidebar */}
      <PlayerSidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <PlayerTopbar />
        <main className="flex-1 overflow-y-auto bg-dark-950">
          <div className="p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
