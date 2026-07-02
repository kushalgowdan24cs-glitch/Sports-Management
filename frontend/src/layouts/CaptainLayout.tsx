import React from 'react';
import { Outlet } from 'react-router-dom';
import { CaptainSidebar } from '@/components/captain/CaptainSidebar';
import { CaptainTopbar } from '@/components/captain/CaptainTopbar';

export const CaptainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      {/* Sidebar */}
      <CaptainSidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <CaptainTopbar />
        <main className="flex-1 overflow-y-auto bg-dark-950">
          <div className="p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
