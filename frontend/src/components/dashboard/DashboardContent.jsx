import React from 'react';
import Welcomepage from './Welcomepage';
import UserProfile from './UserProfile';
import ProjectsPage from '../../pages/ProjectsPage';
import IdeasPage from '../../pages/IdeasPage';
import IdeaPage from '../../pages/IdeaPage';
import ProjectPage from '../../pages/ProjectPage';
import TasksPage from '../../pages/TasksPage';
import TaskDetailPage from '../../pages/TaskDetailPage';

const DashboardContent = ({ 
  activeTab, 
  selectedProjectId,
  selectedIdeaId,
  selectedTaskId,
  onProjectSelect, 
  onIdeaSelect,
  onTaskSelect,
  onBackToProjects,
  onBackToIdeas,
  onBackToTasks
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
        
      case 'tasks':
        return (
          <TasksPage 
            onTaskSelect={onTaskSelect}
          />
        );
        
      case 'task-detail':
        if (selectedTaskId) {
          return (
            <TaskDetailPage
              taskId={selectedTaskId}
              onBack={onBackToTasks}
            />
          );
        }
        setTimeout(() => onBackToTasks(), 0);
        return <div>Loading...</div>;
        
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
