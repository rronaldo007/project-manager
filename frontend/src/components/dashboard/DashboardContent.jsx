import React from 'react';
import Welcomepage from './Welcomepage';
import UserProfile from './UserProfile';
import ProjectsPage from '../../pages/ProjectsPage';
import IdeasPage from '../../pages/IdeasPage';
import IdeaPage from '../../pages/IdeaPage';
import ProjectPage from '../../pages/ProjectPage';

const DashboardContent = ({ 
  activeTab, 
  selectedProjectId,
  selectedIdeaId,
  onProjectSelect, 
  onIdeaSelect,
  onBackToProjects,
  onBackToIdeas
}) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Welcomepage />;
        
      case 'ideas':
        return (
          <IdeasPage 
            onIdeaSelect={onIdeaSelect}
          />
        );
        
      case 'idea-detail':
        if (selectedIdeaId) {
          return (
            <IdeaPage
              ideaId={selectedIdeaId}
              onBack={onBackToIdeas}
            />
          );
        }
        setTimeout(() => onBackToIdeas(), 0);
        return <div>Loading...</div>;
        
      case 'projects':
        return (
          <ProjectsPage 
            onProjectSelect={onProjectSelect}
          />
        );
        
      case 'profile':
        return <UserProfile />;
        
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
