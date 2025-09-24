import React from 'react';

const AuthHeader = ({ isLogin }) => {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7L12 2z"/>
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">
        {isLogin ? 'Welcome back' : 'Create your account'}
      </h2>
      <p className="text-gray-400">
        {isLogin 
          ? 'Sign in to access your project management dashboard' 
          : 'Join us and start managing your projects efficiently'
        }
      </p>
    </div>
  );
};

export default AuthHeader;
