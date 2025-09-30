import React, { useState, useEffect } from 'react';

const ProjectUsersManagement = ({ projectId, project, isOwner, onClose }) => {
  const [members, setMembers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('viewer');
  const API_BASE = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/members/`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        throw new Error('Failed to fetch members');
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const response = await fetch(`${API_BASE}/api/projects/users/search/?q=${encodeURIComponent(query)}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter out users who are already members or the owner
        const filteredResults = data.filter(user => 
          user.id !== project.owner.id && 
          !members.some(member => member.user.id === user.id)
        );
        setSearchResults(filteredResults);
      }
    } catch (error) {
      console.error('Failed to search users:', error);
    } finally {
      setSearching(false);
    }
  };

  const addMember = async (userEmail) => {
    console.log('Adding member:', userEmail, 'with role:', selectedRole);
    console.log('Project ID:', projectId);
    
    try {
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/members/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: userEmail,
          role: selectedRole,
        }),
      });

      console.log('Add member response status:', response.status);
      console.log('Add member response headers:', [...response.headers.entries()]);
      
      const responseData = await response.json();
      console.log('Add member response data:', responseData);

      if (response.ok) {
        await fetchMembers();
        setSearchQuery('');
        setSearchResults([]);
        setError('');
      } else {
        setError(responseData.user_email?.[0] || responseData.error || 'Failed to add member');
      }
    } catch (error) {
      console.error('Add member error:', error);
      setError('Failed to add member');
    }
  };

  const updateMemberRole = async (memberId, newRole) => {
    try {
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/members/${memberId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        await fetchMembers();
      }
    } catch (error) {
      console.error('Failed to update member role:', error);
    }
  };

  const removeMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/members/${memberId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await fetchMembers();
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">Manage Team</h3>
              <p className="text-blue-100/80 mt-1">Add and manage project team members</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Add Member Section */}
          {isOwner && (
            <div className="mb-8 p-6 bg-gray-700/30 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-4">Add New Member</h4>
              
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Search users by name or email..."
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  
                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="mt-2 bg-gray-700 border border-gray-600 rounded-lg shadow-lg">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-600/50 transition-colors border-b border-gray-600 last:border-b-0"
                        >
                          <div>
                            <p className="text-white font-medium">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                          </div>
                          <button
                            onClick={() => addMember(user.email)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {searching && (
                    <div className="mt-2 p-3 text-center text-gray-400">
                      <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      Searching users...
                    </div>
                  )}
                </div>
                
                <div>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Current Members */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Current Team Members</h4>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
                    <div className="w-12 h-12 bg-gray-600/50 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="w-32 h-4 bg-gray-600/50 rounded mb-2"></div>
                      <div className="w-48 h-3 bg-gray-600/30 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Project Owner */}
                <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {project.owner.first_name?.charAt(0) || project.owner.email.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {project.owner.first_name} {project.owner.last_name}
                      </p>
                      <p className="text-gray-400 text-sm">{project.owner.email}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                    Owner
                  </span>
                </div>

                {/* Team Members */}
                {members.map((membership) => (
                  <div
                    key={membership.id}
                    className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {membership.user.first_name?.charAt(0) || membership.user.email.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {membership.user.first_name} {membership.user.last_name}
                        </p>
                        <p className="text-gray-400 text-sm">{membership.user.email}</p>
                        <p className="text-gray-500 text-xs">
                          Added {new Date(membership.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {isOwner ? (
                        <>
                          <select
                            value={membership.role}
                            onChange={(e) => updateMemberRole(membership.id, e.target.value)}
                            className="px-3 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                          >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                          </select>
                          <button
                            onClick={() => removeMember(membership.id)}
                            className="p-2 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                            title="Remove member"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                          {membership.role}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {members.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="text-gray-400 font-medium mb-2">No team members yet</h3>
                    <p className="text-gray-500 text-sm">
                      {isOwner ? 'Search and add team members to start collaborating' : 'The project owner hasn\'t added any team members yet'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectUsersManagement;
