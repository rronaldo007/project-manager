import React from 'react';
import Welcomepage from './Welcomepage';
import UserProfile from './UserProfile';
import ProjectsPage from '../../pages/ProjectsPage';
import IdeasPage from '../../pages/IdeasPage';
import ProjectPage from '../../pages/ProjectPage';

const DashboardContent = ({ 
  activeTab, 
  selectedProjectId,
  onProjectSelect, 
  onBackToProjects,
  onLogout  // Add logout prop
}) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Welcomepage />;
        
      case 'ideas':
        return <IdeasPage />;
        
      case 'projects':
        return (
          <ProjectsPage 
            onProjectSelect={onProjectSelect}
          />
        );
        
      case 'profile':
        return <UserProfile onLogout={onLogout} />;  // Pass logout to profile
        
      case 'logout':  // Add logout case
        onLogout();
        return <div>Logging out...</div>;
        
      case 'project-detail':
        if (selectedProjectId) {
          return (
            <ProjectPage
              projectId={selectedProjectId}
              onBack={onBackToProjects}
            />
          );
        }
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