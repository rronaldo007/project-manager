import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useRouteMemory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Save current route when authenticated and on a protected page
  useEffect(() => {
    if (isAuthenticated && location.pathname !== '/auth' && location.pathname !== '/') {
      localStorage.setItem('lastRoute', location.pathname);
    }
  }, [location.pathname, isAuthenticated]);

  // Restore route when auth state is restored
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        const lastRoute = localStorage.getItem('lastRoute');
        // If user is on landing page but is authenticated, redirect to last route or dashboard
        if (location.pathname === '/') {
          navigate(lastRoute || '/dashboard', { replace: true });
        }
      }
    }
  }, [isAuthenticated, loading, navigate, location.pathname]);

  return { lastRoute: localStorage.getItem('lastRoute') };
};
