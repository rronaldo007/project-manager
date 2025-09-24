import React from 'react';

const UserAvatar = ({ user, showRole = false, role = null }) => {
  const getInitials = () => {
    if (!user || !user.first_name || !user.last_name) return 'U';
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-sm font-bold">{getInitials()}</span>
        </div>
        {showRole && role === 'owner' && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-xs">👑</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-white text-sm font-semibold">
          {user.first_name} {user.last_name}
        </p>
        <p className="text-gray-400 text-xs">{user.email}</p>
        {showRole && (
          <p className="text-blue-400 text-xs font-medium">
            {role === 'owner' ? '👑 Project Owner' : 'Team Member'}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserAvatar;
