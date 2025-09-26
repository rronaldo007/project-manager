import React, { useState, useEffect } from 'react';

const MembersSection = ({ idea, onShowAddMember, canManageMembers }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (idea?.id) {
      fetchMembers();
    }
  }, [idea?.id]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/ideas/${idea.id}/members/`, {
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

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/ideas/${idea.id}/members/${userId}/`, {
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
      'editor': 'bg-green-500/20 text-green-400',
      'owner': 'bg-purple-500/20 text-purple-400'
    };
    return colors[role] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          Members ({members.length + 1}) {/* +1 for owner */}
        </h2>
        {canManageMembers && (
          <button
            onClick={onShowAddMember}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Member</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {/* Owner */}
        <div className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {idea.owner?.first_name?.[0]}{idea.owner?.last_name?.[0]}
              </span>
            </div>
            <div>
              <p className="font-medium text-white">
                {idea.owner?.first_name} {idea.owner?.last_name}
              </p>
              <p className="text-gray-400 text-sm">{idea.owner?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
              Owner
            </span>
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>

        {/* Members */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-700/30 rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="w-32 h-4 bg-gray-600 rounded mb-1"></div>
                    <div className="w-48 h-3 bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : members.length > 0 ? (
          members.map((membership) => (
            <div key={membership.id} className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {membership.user?.first_name?.[0]}{membership.user?.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-white">
                    {membership.user?.first_name} {membership.user?.last_name}
                  </p>
                  <p className="text-gray-400 text-sm">{membership.user?.email}</p>
                  <p className="text-gray-500 text-xs">
                    Added by {membership.added_by?.first_name} {membership.added_by?.last_name} • {new Date(membership.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(membership.role)}`}>
                  {membership.role}
                </span>
                {canManageMembers && (
                  <button
                    onClick={() => handleRemoveMember(membership.user.id)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    title="Remove member"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-400 mb-4">No additional members yet</p>
            {canManageMembers && (
              <button
                onClick={onShowAddMember}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                Add First Member
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersSection;
