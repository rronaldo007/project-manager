import React from 'react';

const SidebarLogo = ({ isOpen }) => {
  return (
    <div className="flex items-center space-x-3 mb-10">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
        <span className="text-white font-bold text-lg">PM</span>
      </div>
      {isOpen && (
        <span className="text-white text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          ProjectManager
        </span>
      )}
    </div>
  );
};

export default SidebarLogo;
