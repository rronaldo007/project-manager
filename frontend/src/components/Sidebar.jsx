import React from 'react';

const Sidebar = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'ideas', label: 'Ideas', icon: '💡' },
    { id: 'tasks', label: 'Tasks', icon: '✓' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  const handleLogout = async () => {
    try {
      // Call logout API
      const response = await fetch('/api/auth/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Clear local storage regardless of response
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to auth page
      window.location.href = '/auth';
    } catch (err) {
      console.error('Logout error:', err);
      // Still redirect even if logout call fails
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/auth';
    }
  };

  return (
    <div className="w-64 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700/50 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">Project Manager</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id || 
              (activeTab === 'project-detail' && item.id === 'projects') ||
              (activeTab === 'idea-detail' && item.id === 'ideas') ||
              (activeTab === 'task-detail' && item.id === 'tasks')
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700/50">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
