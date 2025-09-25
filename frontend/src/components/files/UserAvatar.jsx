import React from 'react';

const UserAvatar = ({ user, size = 'sm' }) => {
  if (!user) return null;

  const sizeClasses = {
    xs: 'w-4 h-4 text-[8px]',
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg'
  };

  const getInitial = () => {
    if (user.first_name) return user.first_name.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold`}>
      {getInitial()}
    </div>
  );
};

export default UserAvatar;
