import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const saveUserToMemory = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('isAuthenticated', 'true');
    } catch (error) {
      console.warn('Failed to save to sessionStorage:', error);
    }
  };

  const clearUserFromMemory = () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('isAuthenticated');
    } catch (error) {
      console.warn('Failed to clear sessionStorage:', error);
    }
  };

  const loadUserFromMemory = () => {
    try {
      const savedUser = sessionStorage.getItem('user');
      const savedAuthStatus = sessionStorage.getItem('isAuthenticated');
      
      if (savedUser && savedAuthStatus === 'true') {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        return userData;
      }
    } catch (error) {
      console.warn('Failed to load from sessionStorage:', error);
    }
    return null;
  };

  const checkAuthStatus = async () => {
    setLoading(true);
    
    const savedUser = loadUserFromMemory();
    
    try {
      const response = await fetch('/api/api/auth/profile/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        saveUserToMemory(userData);
      } else if (response.status === 403 || response.status === 401) {
        clearUserFromMemory();
      } else {
        console.error('Unexpected response status:', response.status);
        clearUserFromMemory();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      if (!savedUser) {
        clearUserFromMemory();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch('/api/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        saveUserToMemory(data.user);
        return { success: true, data };
      } else {
        return { success: false, errors: data };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        errors: { general: 'Network error. Please try again.' }
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('/api/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        saveUserToMemory(data.user);
        return { success: true, data };
      } else {
        return { success: false, errors: data };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        errors: { general: 'Network error. Please try again.' }
      };
    }
  };

  const logout = async () => {
    console.log('Logout function called');
    try {
      const response = await fetch('/api/api/auth/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Logout response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Logout response:', data);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      console.log('Clearing user from memory');
      clearUserFromMemory();
    }
  };

  // Add the updateUser function that was missing
  const updateUser = (userData) => {
    saveUserToMemory(userData);
  };

  const getUserInitials = () => {
    if (!user || !user.first_name || !user.last_name) return 'U';
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.first_name || user.email || 'User';
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    getUserInitials,
    getUserDisplayName,
    checkAuthStatus,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};
