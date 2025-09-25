import React from 'react';

const DashboardHeader = ({ activeTab, user }) => {
  const getTitle = () => {
    switch(activeTab) {
      case 'profile':
        return 'User Profile';
      case 'projects':
        return 'Projects';
      case 'project-detail':
        return 'Project Details';
      default:
        return 'Dashboard';
    }
  };

  const getDescription = () => {
    switch(activeTab) {
      case 'profile':
        return 'Manage your personal information';
      case 'projects':
        return 'View and manage all your projects';
      case 'project-detail':
        return 'Project overview and details';
      default:
        return 'Welcome to your workspace';
    }
  };

  const getIcon = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'projects':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
    }
  };

  return (
    <header className="bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-md border-b border-gray-700/50">
      <div className="px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Icon with gradient background */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-gray-700/50">
              <div className="text-blue-400">
                {getIcon()}
              </div>
            </div>
            
            {/* Title and description */}
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                {getTitle()}
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">
                {getDescription()}
              </p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Quick actions */}
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>

            {/* User welcome badge */}
            <div className="flex items-center space-x-3 px-4 py-2.5 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
              <div className="relative">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <span className="text-sm text-gray-300">Welcome back,</span>
              <span className="text-sm font-semibold text-white">{user?.first_name}!</span>
            </div>

            {/* Time display */}
            <div className="hidden lg:flex items-center space-x-2 text-gray-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Breadcrumb for project details */}
        {activeTab === 'project-detail' && (
          <div className="mt-4 flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Projects</span>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-300">Project Name</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;