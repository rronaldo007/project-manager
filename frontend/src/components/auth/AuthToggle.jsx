import React from 'react';

const AuthToggle = ({ isLogin, onToggle }) => {
  return (
    <div className="flex bg-gray-700/50 rounded-lg p-1 mb-6">
      <button
        onClick={() => onToggle(true)}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
          isLogin 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Sign In
      </button>
      <button
        onClick={() => onToggle(false)}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
          !isLogin 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthToggle;
