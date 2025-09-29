import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import DashboardHeader from './DashboardHeader';
import DashboardContent from './DashboardContent';

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'dashboard';
  });
  
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    setActiveTab('project-detail');
  };

  const handleIdeaSelect = (ideaId) => {
    setSelectedIdeaId(ideaId);
    setActiveTab('idea-detail');
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTaskId(taskId);
    setActiveTab('task-detail');
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setActiveTab('projects');
  };

  const handleBackToIdeas = () => {
    setSelectedIdeaId(null);
    setActiveTab('ideas');
  };

  const handleBackToTasks = () => {
    setSelectedTaskId(null);
    setActiveTab('tasks');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <DashboardContent
            activeTab={activeTab}
            selectedProjectId={selectedProjectId}
            selectedIdeaId={selectedIdeaId}
            selectedTaskId={selectedTaskId}
            onProjectSelect={handleProjectSelect}
            onIdeaSelect={handleIdeaSelect}
            onTaskSelect={handleTaskSelect}
            onBackToProjects={handleBackToProjects}
            onBackToIdeas={handleBackToIdeas}
            onBackToTasks={handleBackToTasks}
          />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
