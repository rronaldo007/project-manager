import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTabMemory } from '../hooks/useTabMemory';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardContent from '../components/dashboard/DashboardContent';

const Dashboard = () => {
  const {
    activeTab,
    setActiveTab,
    selectedProjectId,
    setSelectedProjectId,
    isSidebarOpen,
    setIsSidebarOpen,
    clearMemory
  } = useTabMemory('dashboard');

  const { user, logout, getUserInitials } = useAuth();

  const handleLogout = async () => {
    clearMemory(); // Clear all memory on logout
    await logout();
    window.location.href = '/';
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    setActiveTab('project-detail');
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setActiveTab('projects');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== 'project-detail') {
      setSelectedProjectId(null);
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <DashboardLayout
      isSidebarOpen={isSidebarOpen}
      onSidebarToggle={handleSidebarToggle}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      user={user}
      getUserInitials={getUserInitials}
      onLogout={handleLogout}
    >
      <DashboardContent
        activeTab={activeTab}
        selectedProjectId={selectedProjectId}
        onProjectSelect={handleProjectSelect}
        onBackToProjects={handleBackToProjects}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
