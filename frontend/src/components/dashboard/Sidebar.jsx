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
    <div className={`bg-gray-900/95 backdrop-blur-md border-r border-gray-700/50 transition-all duration-300 shadow-2xl ${
      isOpen ? 'w-72' : 'w-20'
    }`}>
      <div className="p-5">
        <SidebarLogo isOpen={isOpen} />
        <SidebarUserInfo 
          isOpen={isOpen}
          user={user}
          getUserInitials={getUserInitials}
        />
        <SidebarNav
          isOpen={isOpen}
          activeTab={activeTab}
          onTabChange={onTabChange}
          onLogout={onLogout}
        />
      </div>
      <SidebarToggle isOpen={isOpen} onToggle={onToggle} />
    </div>
  );
};

export default Sidebar;
