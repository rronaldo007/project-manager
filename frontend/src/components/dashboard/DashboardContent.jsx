import React from 'react';
import UserProfile from './UserProfile';
import Welcomepage from './Welcomepage';
import ProjectsPage from '../../pages/ProjectsPage';
import ProjectPage from '../../pages/ProjectPage';

const DashboardContent = ({ 
  activeTab, 
  selectedProjectId, 
  onProjectSelect, 
  onBackToProjects 
}) => {
  switch(activeTab) {
    case 'dashboard':
      return <Welcomepage />;
    case 'profile':
      return <UserProfile />;
    
    case 'projects':
      return <ProjectsPage onProjectSelect={onProjectSelect} />;
    
    case 'project-detail':
      return selectedProjectId ? (
        <ProjectPage 
          projectId={selectedProjectId} 
          onBack={onBackToProjects}
        />
      ) : null;
    
    default:
      return null;
  }
};

export default DashboardContent;
