import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { 
    user, 
    isAuthenticated, 
    loading, 
    logout, 
    getUserInitials, 
    getUserDisplayName 
  } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <span className="text-white text-xl font-semibold">ProjectManager</span>
            </div>
            <div className="animate-pulse bg-gray-700 h-10 w-24 rounded-lg"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PM</span>
            </div>
            <a href="/" className="text-white text-xl font-semibold hover:text-gray-200 transition-colors">
              ProjectManager
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* User Profile Section */}
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300 text-sm">
                    Hi, {getUserDisplayName()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {getUserInitials()}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-1 rounded-md text-sm transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <a 
                href="/auth" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Sign In
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-700 pt-4">
            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center space-x-3 px-3 py-2 bg-gray-700/50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {getUserInitials()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-300 hover:text-white hover:bg-gray-700/50 px-3 py-2 rounded-lg transition-all border-t border-gray-600 mt-2 pt-4"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a 
                  href="/auth" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium w-fit transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;