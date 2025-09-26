import React, { createContext, useContext, useState, useEffect } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [navigationHistory, setNavigationHistory] = useState(() => {
    try {
      const saved = sessionStorage.getItem('navigationHistory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentView, setCurrentView] = useState(() => {
    try {
      const saved = sessionStorage.getItem('currentView');
      return saved ? JSON.parse(saved) : { type: 'ideas', data: {} };
    } catch {
      return { type: 'ideas', data: {} };
    }
  });

  useEffect(() => {
    sessionStorage.setItem('navigationHistory', JSON.stringify(navigationHistory));
  }, [navigationHistory]);

  useEffect(() => {
    sessionStorage.setItem('currentView', JSON.stringify(currentView));
  }, [currentView]);

  const pushNavigation = (view) => {
    setNavigationHistory(prev => {
      const newHistory = [...prev, currentView];
      // Keep only last 10 items to prevent memory bloat
      return newHistory.slice(-10);
    });
    setCurrentView(view);
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const previous = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentView(previous);
      return previous;
    }
    return null;
  };

  const canGoBack = navigationHistory.length > 0;

  const navigateToIdea = (ideaId, ideaTitle = '') => {
    pushNavigation({
      type: 'idea',
      data: { ideaId, ideaTitle }
    });
  };

  const navigateToIdeas = (filters = {}) => {
    pushNavigation({
      type: 'ideas',
      data: { filters }
    });
  };

  const navigateToProjects = (filters = {}) => {
    pushNavigation({
      type: 'projects',
      data: { filters }
    });
  };

  return (
    <NavigationContext.Provider value={{
      currentView,
      navigationHistory,
      pushNavigation,
      goBack,
      canGoBack,
      navigateToIdea,
      navigateToIdeas,
      navigateToProjects,
      setCurrentView
    }}>
      {children}
    </NavigationContext.Provider>
  );
};
