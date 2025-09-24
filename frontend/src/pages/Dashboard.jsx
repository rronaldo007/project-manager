import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardContent from '../components/dashboard/DashboardContent';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout, getUserInitials } = useAuth();

  const handleLogout = async () => {
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
    setSelectedProjectId(null);
  };

  return (
    <DashboardLayout
      isSidebarOpen={isSidebarOpen}
      onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
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
