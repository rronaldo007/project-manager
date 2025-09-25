import React from 'react';

const SidebarNav = ({ isOpen, activeTab, onTabChange, onLogout }) => {
  const navItems = [
    {
      id : "dashboard",
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2-2m-2 2l-7 7-7-7M1 10a2 2 0 002-2h14a2 2 0 002 2M9 8h3l-3 3m3-3H9" />
        </svg>
      ),
      badge: null
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      badge: null
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      badge: '5' // Example notification badge
    }
  ];

  return (
    <nav className="space-y-2">
      {navItems.map(item => {
        const isActive = activeTab === item.id || (item.id === 'projects' && activeTab === 'project-detail');
        
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`relative w-full flex items-center ${isOpen ? 'justify-between' : 'justify-center'} px-4 py-3 rounded-xl transition-all duration-200 group ${
              isActive
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:border-gray-600/50'
            } ${!isActive && 'border border-transparent'}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors`}>
                {item.icon}
              </div>
              {isOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </div>
            
            {/* Badge for notifications */}
            {item.badge && isOpen && (
              <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                {item.badge}
              </span>
            )}
            
            {/* Active indicator dot when collapsed */}
            {isActive && !isOpen && (
              <div className="absolute right-1 w-1.5 h-8 bg-white rounded-full"></div>
            )}
          </button>
        );
      })}

      {/* Additional nav items */}
      <div className="pt-4 space-y-2">
        <button
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {isOpen && <span className="font-medium">Settings</span>}
        </button>
      </div>

      {/* Logout button */}
      <div className="pt-4 mt-4 border-t border-gray-700/30">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-200 group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </nav>
  );
};

export default SidebarNav;