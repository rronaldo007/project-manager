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
        return '';
    }
  };

  return (
    <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 px-8 py-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {getTitle()}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {getDescription()}
          </p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-gray-300 bg-gray-800/50 px-4 py-2 rounded-xl">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Welcome back, {user?.first_name}!</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
