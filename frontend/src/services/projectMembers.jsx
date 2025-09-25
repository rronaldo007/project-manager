const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const projectMembersService = {
  // Get project members
  getMembers: async (projectId) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/members/`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch members');
    return response.json();
  },

  // Add member to project
  addMember: async (projectId, userEmail, role) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/members/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: userEmail, role }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add member');
    }
    return response.json();
  },

  // Update member role
  updateMemberRole: async (projectId, membershipId, role) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/members/${membershipId}/`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error('Failed to update member role');
    return response.json();
  },

  // Remove member from project
  removeMember: async (projectId, membershipId) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/members/${membershipId}/`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to remove member');
  },

  // Search users
  searchUsers: async (query) => {
    const response = await fetch(`${API_BASE_URL}/api/projects/users/search/?q=${encodeURIComponent(query)}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to search users');
    return response.json();
  },
};
