import React from 'react';

const SidebarLogo = ({ isOpen }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative group">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-50 blur-lg transition-all duration-300"></div>
        
        {/* Logo container */}
        <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
          <div className="w-10 h-10 bg-gray-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">PM</span>
          </div>
        </div>
        
        {/* Decorative dot */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>
      
      {isOpen && (
        <div className="overflow-hidden">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-in slide-in-from-left duration-300">
            ProjectManager
          </h1>
          <p className="text-xs text-gray-500 -mt-1">Workspace</p>
        </div>
      )}
    </div>
  );
};

export default SidebarLogo;