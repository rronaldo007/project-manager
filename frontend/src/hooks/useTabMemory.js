import { useState, useEffect } from 'react';

export const useTabMemory = (defaultTab = 'dashboard') => {
  // Active tab memory
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const savedTab = localStorage.getItem('dashboardActiveTab');
      return savedTab || defaultTab;
    } catch (error) {
      return defaultTab;
    }
  });

  // Selected project memory
  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    try {
      const savedProjectId = localStorage.getItem('selectedProjectId');
      return savedProjectId ? parseInt(savedProjectId) : null;
    } catch (error) {
      return null;
    }
  });

  // Sidebar state memory
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebarOpen');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Set tab with memory
  const setTabWithMemory = (tab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem('dashboardActiveTab', tab);
    } catch (error) {
      console.warn('Could not save tab to localStorage:', error);
    }
  };

  // Set project with memory
  const setProjectWithMemory = (projectId) => {
    setSelectedProjectId(projectId);
    try {
      if (projectId) {
        localStorage.setItem('selectedProjectId', projectId.toString());
      } else {
        localStorage.removeItem('selectedProjectId');
      }
    } catch (error) {
      console.warn('Could not save project ID to localStorage:', error);
    }
  };

  // Set sidebar with memory
  const setSidebarWithMemory = (isOpen) => {
    setIsSidebarOpen(isOpen);
    try {
      localStorage.setItem('sidebarOpen', JSON.stringify(isOpen));
    } catch (error) {
      console.warn('Could not save sidebar state:', error);
    }
  };

  // Clear all memory (for logout)
  const clearMemory = () => {
    try {
      localStorage.removeItem('dashboardActiveTab');
      localStorage.removeItem('selectedProjectId');
      localStorage.removeItem('sidebarOpen');
      localStorage.removeItem('projectTabMemory');
      localStorage.removeItem('topicViewMode');
    } catch (error) {
      console.warn('Could not clear memory:', error);
    }
  };

  return {
    activeTab,
    setActiveTab: setTabWithMemory,
    selectedProjectId,
    setSelectedProjectId: setProjectWithMemory,
    isSidebarOpen,
    setIsSidebarOpen: setSidebarWithMemory,
    clearMemory
  };
};

// Hook for project page tab memory
export const useProjectTabMemory = (projectId, defaultTab = 'overview') => {
  const memoryKey = `projectTab_${projectId}`;
  
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem(memoryKey);
      return saved || defaultTab;
    } catch (error) {
      return defaultTab;
    }
  });

  const setTabWithMemory = (tab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem(memoryKey, tab);
    } catch (error) {
      console.warn('Could not save project tab:', error);
    }
  };

  return [activeTab, setTabWithMemory];
};

// Hook for topic view mode memory
export const useTopicViewMemory = (defaultView = 'grid') => {
  const [viewMode, setViewMode] = useState(() => {
    try {
      const saved = localStorage.getItem('topicViewMode');
      return saved || defaultView;
    } catch (error) {
      return defaultView;
    }
  });

  const setViewWithMemory = (view) => {
    setViewMode(view);
    try {
      localStorage.setItem('topicViewMode', view);
    } catch (error) {
      console.warn('Could not save topic view mode:', error);
    }
  };

  return [viewMode, setViewWithMemory];
};
