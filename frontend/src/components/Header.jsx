import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-gray-800/50 border-b border-gray-700/50 h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-white text-lg font-medium ml-4 lg:ml-0">
          Welcome back, {user?.first_name}
        </h2>
      </div>
    </header>
  );
};

export default Header;
