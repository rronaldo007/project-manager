import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useRouteMemory = () => {
  const location = useLocation();

  // Save current route to localStorage
  useEffect(() => {
    // Don't save auth or landing pages
    if (location.pathname !== '/auth' && location.pathname !== '/') {
      localStorage.setItem('lastRoute', location.pathname);
    }
  }, [location.pathname]);

  // Function to get the last saved route
  const getLastRoute = () => {
    return localStorage.getItem('lastRoute') || '/dashboard';
  };

  // Function to navigate to last route
  const goToLastRoute = () => {
    const lastRoute = getLastRoute();
    window.location.href = lastRoute;
  };

  return { getLastRoute, goToLastRoute };
};
