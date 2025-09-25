import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const UserAvatar = ({ className = '' }) => {
  const { user, getUserInitials } = useAuth();

  // Provide fallback if user is not loaded yet
  if (!user) {
    return (
      <div className={`w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center ${className}`}>
        <span className="text-white font-medium text-sm">U</span>
      </div>
    );
  }

  return (
    <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center ${className}`}>
      <span className="text-white font-medium text-sm">
        {getUserInitials()}
      </span>
    </div>
  );
};

export default UserAvatar;
