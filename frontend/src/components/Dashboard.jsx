import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from './dashboard/DashboardLayout';
import DashboardContent from './dashboard/DashboardContent';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const { user, logout, getUserInitials } = useAuth();

  // Update breadcrumbs based on active tab and selected project
  useEffect(() => {
    const updateBreadcrumbs = () => {
      switch (activeTab) {
        case 'dashboard':
          setBreadcrumbs([{ label: 'Dashboard', active: true }]);
          break;
        case 'projects':
          setBreadcrumbs([
            { label: 'Dashboard', onClick: () => handleTabChange('dashboard') },
            { label: 'Projects', active: true }
          ]);
          break;
        case 'project-detail':
          setBreadcrumbs([
            { label: 'Dashboard', onClick: () => handleTabChange('dashboard') },
            { label: 'Projects', onClick: () => handleTabChange('projects') },
            { label: 'Project Details', active: true }
          ]);
          break;
        case 'profile':
          setBreadcrumbs([
            { label: 'Dashboard', onClick: () => handleTabChange('dashboard') },
            { label: 'Profile', active: true }
          ]);
          break;
        default:
          setBreadcrumbs([{ label: 'Dashboard', active: true }]);
      }
    };

    updateBreadcrumbs();
  }, [activeTab, selectedProjectId]);

  // Enhanced logout with confirmation
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      // Redirect will be handled by auth context
    } catch (error) {
      setError('Failed to logout. Please try again.');
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    setActiveTab('project-detail');
    setError(''); // Clear any previous errors
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setActiveTab('projects');
  };

  const handleTabChange = (tab) => {
    // Don't change tabs if currently loading
    if (isLoading) return;
    
    setActiveTab(tab);
    setSelectedProjectId(null);
    setError(''); // Clear errors when switching tabs
  };

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Error notification component
  const ErrorNotification = () => {
    if (!error) return null;

    return (
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <div className="bg-red-600/90 backdrop-blur-sm border border-red-500/50 rounded-xl p-4 shadow-2xl">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-200 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-200 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading overlay for global loading states
  const LoadingOverlay = () => {
    if (!isLoading) return null;

    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-8 h-8 border-4 border-gray-600 rounded-full"></div>
              <div className="absolute top-0 left-0 w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <span className="text-white font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  };

  // Don't render if user is not available
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardLayout
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={user}
        getUserInitials={getUserInitials}
        onLogout={handleLogout}
        breadcrumbs={breadcrumbs}
        isLoading={isLoading}
      >
        <DashboardContent
          activeTab={activeTab}
          selectedProjectId={selectedProjectId}
          onProjectSelect={handleProjectSelect}
          onBackToProjects={handleBackToProjects}
          onError={setError}
          onLoadingChange={setIsLoading}
        />
      </DashboardLayout>

      <ErrorNotification />
      <LoadingOverlay />
    </>
  );
};

export default Dashboard;
