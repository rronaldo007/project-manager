const API_URL = 'http://localhost:8000/api/auth';

class AuthService {
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for session cookies
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for session cookies
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      const response = await fetch(`${API_URL}/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      return { message: 'Logout successful' };
    } catch (error) {
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await fetch(`${API_URL}/profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get profile');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
