import React, { useState, useEffect } from 'react';

const MemberManagementModal = ({ isOpen, onClose, ideaId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    user_email: '',
    role: 'viewer'
  });

  const API_BASE = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    if (isOpen && ideaId) {
      fetchMembers();
    }
  }, [isOpen, ideaId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE}/api/ideas/${ideaId}/members/`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        setError('Failed to load members');
      }
    } catch (error) {
      setError('Failed to load members');
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE}/api/ideas/${ideaId}/members/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember),
      });

      if (response.ok) {
        await fetchMembers();
        setNewMember({ user_email: '', role: 'viewer' });
        setShowAddForm(false);
      } else {
        const errorData = await response.json();
        setError(errorData.user_email?.[0] || errorData.detail || 'Failed to add member');
      }
    } catch (error) {
      setError('Failed to add member');
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/ideas/${ideaId}/members/${userId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await fetchMembers();
      } else {
        setError('Failed to remove member');
      }
    } catch (error) {
      setError('Failed to remove member');
      console.error('Error removing member:', error);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      'viewer': 'bg-gray-500/20 text-gray-400',
      'contributor': 'bg-blue-500/20 text-blue-400',
      'editor': 'bg-green-500/20 text-green-400'
    };
    return colors[role] || 'bg-gray-500/20 text-gray-400';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Manage Members</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">
            Team Members ({members.length})
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>{showAddForm ? 'Cancel' : 'Add Member'}</span>
          </button>
        </div>

        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-700/30 rounded-lg">
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newMember.user_email}
                    onChange={(e) => setNewMember({...newMember, user_email: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Role
                  </label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="contributor">Contributor</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors text-sm"
              >
                Add Member
              </button>
            </form>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-700/30 rounded-lg p-4 animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="w-32 h-4 bg-gray-600 rounded mb-2"></div>
                      <div className="w-48 h-3 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : members.length > 0 ? (
            <div className="space-y-3">
              {members.map((membership) => (
                <div key={membership.id} className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {membership.user?.first_name?.[0]}{membership.user?.last_name?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {membership.user?.first_name} {membership.user?.last_name}
                      </p>
                      <p className="text-gray-400 text-sm">{membership.user?.email}</p>
                      <p className="text-gray-500 text-xs">
                        Added {new Date(membership.created_at).toLocaleDateString()} by {membership.added_by?.first_name} {membership.added_by?.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(membership.role)}`}>
                      {membership.role}
                    </span>
                    <button
                      onClick={() => handleRemoveMember(membership.user.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      title="Remove member"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-400 mb-4">No team members yet</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                Add First Member
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-400">
              <p><strong className="text-gray-300">Viewer:</strong> Can view the idea</p>
              <p><strong className="text-gray-300">Contributor:</strong> Can add notes/resources</p>
              <p><strong className="text-gray-300">Editor:</strong> Can edit and manage members</p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberManagementModal;
