import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminTopbar } from '@/components/layout/AdminTopbar';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto bg-dark-950">
          <div className="p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
