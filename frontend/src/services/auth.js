const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Get CSRF token from cookies
const getCsrfToken = () => {
  const name = 'csrftoken';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Initialize CSRF token by making a GET request to any endpoint
const initializeCsrfToken = async () => {
  try {
    await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'GET',
      credentials: 'include',
    });
  } catch (error) {
    console.warn('Could not initialize CSRF token:', error);
  }
};

export const authService = {
  // Check if user is authenticated and get user data
  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Not authenticated');
      return response.json();
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    await initializeCsrfToken();
    const csrfToken = getCsrfToken();
    
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json',
        ...(csrfToken && { 'X-CSRFToken': csrfToken })
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.non_field_errors?.[0] || error.message || 'Login failed');
    }
    
    return response.json();
  },

  // Register user
  register: async (userData) => {
    await initializeCsrfToken();
    const csrfToken = getCsrfToken();
    
    const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json',
        ...(csrfToken && { 'X-CSRFToken': csrfToken })
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.email?.[0] || error.non_field_errors?.[0] || error.message || 'Registration failed';
      throw new Error(errorMessage);
    }
    
    return response.json();
  },

  // Logout user
  logout: async () => {
    const csrfToken = getCsrfToken();
    const response = await fetch(`${API_BASE_URL}/api/auth/logout/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...(csrfToken && { 'X-CSRFToken': csrfToken })
      },
    });
    
    if (!response.ok) throw new Error('Logout failed');
    return response.json();
  },
};
