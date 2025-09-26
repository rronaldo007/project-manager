import { useState, useEffect } from 'react';

export const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Could not load persisted state for key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`Could not persist state for key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};

// Hook for dashboard-specific state persistence
export const useDashboardState = () => {
  const [activeTab, setActiveTab] = usePersistedState('dashboardActiveTab', 'overview');
  const [sidebarCollapsed, setSidebarCollapsed] = usePersistedState('sidebarCollapsed', false);
  const [activeProject, setActiveProject] = usePersistedState('activeProject', null);
  
  return {
    activeTab,
    setActiveTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    activeProject,
    setActiveProject
  };
};
