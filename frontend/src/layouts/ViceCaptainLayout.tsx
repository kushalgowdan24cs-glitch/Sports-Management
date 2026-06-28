import React from 'react';
import { Outlet } from 'react-router-dom';
import { ViceCaptainSidebar } from '@/components/vice-captain/ViceCaptainSidebar';
import { ViceCaptainTopbar } from '@/components/vice-captain/ViceCaptainTopbar';

export const ViceCaptainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      {/* Sidebar */}
      <ViceCaptainSidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <ViceCaptainTopbar />
        <main className="flex-1 overflow-y-auto bg-dark-950">
          <div className="p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
