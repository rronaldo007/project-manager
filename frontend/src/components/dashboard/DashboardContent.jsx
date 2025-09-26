import React from 'react';
import Welcomepage from './Welcomepage';
import UserProfile from './UserProfile';
import ProjectsPage from '../../pages/ProjectsPage';
import ProjectPage from '../../pages/ProjectPage';

const DashboardContent = ({ 
  activeTab, 
  selectedProjectId, 
  onProjectSelect, 
  onBackToProjects 
}) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Welcomepage />;
        
      case 'profile':
        return <UserProfile />;
        
      case 'projects':
        return (
          <ProjectsPage 
            onProjectSelect={onProjectSelect}
          />
        );
        
      case 'project-detail':
        if (selectedProjectId) {
          return (
            <ProjectPage
              projectId={selectedProjectId}
              onBack={onBackToProjects}
            />
          );
        }
        // If no project selected but tab is project-detail, go back to projects
        setTimeout(() => onBackToProjects(), 0);
        return <div>Loading...</div>;
        
      default:
        return <Welcomepage />;
    }
  };

  return (
    <div className="h-full">
      {renderContent()}
    </div>
  );
};

export default DashboardContent;
