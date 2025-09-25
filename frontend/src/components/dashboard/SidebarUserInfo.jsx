import React from 'react';

const SidebarUserInfo = ({ isOpen, user, getUserInitials }) => {
  return (
    <div className="relative group">
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300"></div>
      
      {/* Main container */}
      <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 transition-all duration-300 group-hover:border-gray-600/50">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105">
              <span className="text-white text-sm font-bold">
                {getUserInitials()}
              </span>
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
          </div>
          
          {/* User details */}
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-gray-400 text-xs truncate">{user?.email}</p>
              <div className="flex items-center mt-1 space-x-2">
                <span className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                  <span className="text-xs text-green-400">Active</span>
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Quick stats when expanded */}
        {isOpen && (
          <div className="mt-3 pt-3 border-t border-gray-700/30 flex items-center justify-between">
            <div className="text-center">
              <p className="text-xs text-gray-500">Projects</p>
              <p className="text-sm font-semibold text-gray-300">12</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Tasks</p>
              <p className="text-sm font-semibold text-gray-300">34</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Team</p>
              <p className="text-sm font-semibold text-gray-300">5</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarUserInfo;