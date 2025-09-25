import React from 'react';
import SidebarLogo from './SidebarLogo';
import SidebarUserInfo from './SidebarUserInfo';
import SidebarNav from './SidebarNav';
import SidebarToggle from './SidebarToggle';

const Sidebar = ({ 
  isOpen, 
  onToggle, 
  activeTab, 
  onTabChange, 
  user, 
  getUserInitials, 
  onLogout 
}) => {
  return (
    <div className={`relative bg-gradient-to-b from-gray-900 via-gray-800/95 to-gray-900 backdrop-blur-md border-r border-gray-700/50 transition-all duration-300 shadow-2xl ${
      isOpen ? 'w-72' : 'w-20'
    }`}>
      {/* Animated gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-purple-600/5 to-transparent pointer-events-none"></div>
      
      {/* Main content */}
      <div className="relative h-full flex flex-col">
        <div className="flex-1 p-5 space-y-6">
          {/* Logo Section */}
          <div className="pb-6 border-b border-gray-700/30">
            <SidebarLogo isOpen={isOpen} />
          </div>
          
          {/* User Info Section */}
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30 backdrop-blur-sm">
            <SidebarUserInfo 
              isOpen={isOpen}
              user={user}
              getUserInitials={getUserInitials}
            />
          </div>
          
          {/* Navigation Section */}
          <div className="flex-1">
            <SidebarNav
              isOpen={isOpen}
              activeTab={activeTab}
              onTabChange={onTabChange}
              onLogout={onLogout}
            />
          </div>
        </div>
        
        {/* Toggle Button - positioned at bottom */}
        <div className="p-5 pt-0">
          <div className="pt-5 border-t border-gray-700/30">
            <SidebarToggle isOpen={isOpen} onToggle={onToggle} />
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      {isOpen && (
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-600/10 to-transparent pointer-events-none"></div>
      )}
    </div>
  );
};

export default Sidebar;