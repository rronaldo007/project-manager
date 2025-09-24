import React from 'react';

const SidebarUserInfo = ({ isOpen, user, getUserInitials }) => {
  return (
    <div className="mb-10 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white text-sm font-bold">
            {getUserInitials()}
          </span>
        </div>
        {isOpen && (
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarUserInfo;
