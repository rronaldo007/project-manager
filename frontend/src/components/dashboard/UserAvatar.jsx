// frontend/src/components/dashboard/UserAvatar.jsx
import React from 'react';

const UserAvatar = ({ initials, size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-10 h-10 text-sm',
    large: 'w-20 h-20 text-2xl'
  };

  return (
    <div className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <span className="text-white font-semibold">
        {initials}
      </span>
    </div>
  );
};

export default UserAvatar;