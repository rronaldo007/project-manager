import React from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = ({ 
  children,
  isSidebarOpen,
  onSidebarToggle,
  activeTab,
  onTabChange,
  user,
  getUserInitials,
  onLogout
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={onSidebarToggle}
        activeTab={activeTab}
        onTabChange={onTabChange}
        user={user}
        getUserInitials={getUserInitials}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader activeTab={activeTab} user={user} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
