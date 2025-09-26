import React from 'react';

const IdeaHeader = ({ idea, onBack, isEditing, onToggleEdit, userPermissions, userRole, onShowMemberManagement }) => {
  const getStatusColor = (status) => {
    const colors = {
      'draft': 'bg-gray-500/20 text-gray-400',
      'concept': 'bg-yellow-500/20 text-yellow-400',
      'in_development': 'bg-blue-500/20 text-blue-400',
      'implemented': 'bg-green-500/20 text-green-400',
      'on_hold': 'bg-orange-500/20 text-orange-400',
      'cancelled': 'bg-red-500/20 text-red-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'bg-green-500/20 text-green-400',
      'medium': 'bg-yellow-500/20 text-yellow-400',
      'high': 'bg-red-500/20 text-red-400',
      'critical': 'bg-purple-500/20 text-purple-400'
    };
    return colors[priority] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Back to Ideas"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-white">{idea.title}</h1>
            {userRole && userRole !== 'owner' && (
              <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded border border-gray-600">
                {userRole === 'viewer' && 'Read Only'}
                {userRole === 'contributor' && 'Contributor'}
                {userRole === 'editor' && 'Editor'}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3 mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(idea.status)}`}>
              {idea.status.replace('_', ' ')}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(idea.priority)}`}>
              {idea.priority}
            </span>
            {idea.tag_list && idea.tag_list.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {idea.tag_list.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {userPermissions?.can_manage_members && (
          <button
            onClick={onShowMemberManagement}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            title="Manage Members"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Members</span>
          </button>
        )}
        {userPermissions?.can_edit && (
          <button
            onClick={onToggleEdit}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Idea'}
          </button>
        )}
      </div>
    </div>
  );
};

export default IdeaHeader;
