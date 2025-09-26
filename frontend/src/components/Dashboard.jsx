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

  // Add state for selected idea
  const [selectedIdeaId, setSelectedIdeaId] = React.useState(() => {
    try {
      return localStorage.getItem('selectedIdeaId');
    } catch {
      return null;
    }
  });

  const { user, logout, getUserInitials } = useAuth();

  const handleLogout = async () => {
    clearMemory();
    localStorage.removeItem('selectedIdeaId');
    await logout();
    window.location.href = '/';
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    setActiveTab('project-detail');
  };

  const handleIdeaSelect = (ideaId) => {
    setSelectedIdeaId(ideaId);
    localStorage.setItem('selectedIdeaId', ideaId);
    setActiveTab('idea-detail');
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setActiveTab('projects');
  };

  const handleBackToIdeas = () => {
    setSelectedIdeaId(null);
    localStorage.removeItem('selectedIdeaId');
    setActiveTab('ideas');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== 'project-detail') {
      setSelectedProjectId(null);
    }
    if (tab !== 'idea-detail') {
      setSelectedIdeaId(null);
      localStorage.removeItem('selectedIdeaId');
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
        selectedIdeaId={selectedIdeaId}
        onProjectSelect={handleProjectSelect}
        onIdeaSelect={handleIdeaSelect}
        onBackToProjects={handleBackToProjects}
        onBackToIdeas={handleBackToIdeas}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
