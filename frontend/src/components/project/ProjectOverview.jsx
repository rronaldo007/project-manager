import React from 'react';

const ProjectOverview = ({ project }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'planning': 'text-yellow-400',
      'in_progress': 'text-blue-400',
      'on_hold': 'text-orange-400',
      'completed': 'text-green-400'
    };
    return colors[status] || 'text-gray-400';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'text-green-400',
      'medium': 'text-yellow-400',
      'high': 'text-red-400'
    };
    return colors[priority] || 'text-gray-400';
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { days: Math.abs(diffDays), status: 'overdue' };
    if (diffDays === 0) return { days: 0, status: 'due-today' };
    if (diffDays <= 7) return { days: diffDays, status: 'due-soon' };
    return { days: diffDays, status: 'on-track' };
  };

  const dueDateInfo = getDaysUntilDue(project?.due_date);

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 space-y-8">
      <h2 className="text-2xl font-bold text-white mb-6">Project Overview</h2>
      
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-700/30 rounded-xl p-4">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Status</h3>
          <p className={`text-lg font-semibold capitalize ${getStatusColor(project?.status)}`}>
            {project?.status?.replace('_', ' ') || 'Not set'}
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-4">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Priority</h3>
          <p className={`text-lg font-semibold capitalize ${getPriorityColor(project?.priority)}`}>
            {project?.priority || 'Not set'}
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-4">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Progress</h3>
          <p className="text-white text-lg font-semibold">{project?.progress || 0}%</p>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-4">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Team Size</h3>
          <p className="text-white text-lg font-semibold">{(project?.memberships?.length || 0) + 1} members</p>
        </div>
      </div>

      {/* Description */}
      {project?.description && (
        <div className="mb-8">
          <h3 className="text-gray-400 text-sm font-medium mb-3">Description</h3>
          <div className="bg-gray-700/30 rounded-lg p-4">
            <p className="text-white leading-relaxed">{project.description}</p>
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-2">Created</h3>
          <p className="text-white">{formatDate(project?.created_at)}</p>
        </div>
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-2">Last Updated</h3>
          <p className="text-white">{formatDate(project?.updated_at)}</p>
        </div>
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-2">Due Date</h3>
          <div className="flex items-center space-x-2">
            <p className="text-white">{formatDate(project?.due_date)}</p>
            {dueDateInfo && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                dueDateInfo.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                dueDateInfo.status === 'due-today' ? 'bg-yellow-500/20 text-yellow-400' :
                dueDateInfo.status === 'due-soon' ? 'bg-orange-500/20 text-orange-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {dueDateInfo.status === 'overdue' ? `${dueDateInfo.days} days overdue` :
                 dueDateInfo.status === 'due-today' ? 'Due today' :
                 dueDateInfo.status === 'due-soon' ? `${dueDateInfo.days} days left` :
                 `${dueDateInfo.days} days left`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Project Owner */}
      <div className="mb-8">
        <h3 className="text-gray-400 text-sm font-medium mb-3">Project Owner</h3>
        <div className="flex items-center space-x-3 bg-gray-700/30 rounded-lg p-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {project?.owner?.first_name?.[0]}{project?.owner?.last_name?.[0]}
            </span>
          </div>
          <div>
            <p className="text-white font-medium">
              {project?.owner?.first_name} {project?.owner?.last_name}
            </p>
            <p className="text-gray-400 text-sm">{project?.owner?.email}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <span>Overall Progress</span>
          <span>{project?.progress || 0}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
            style={{ width: `${project?.progress || 0}%` }}
          />
        </div>
      </div>

      {/* Content Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-700/30">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{project?.topics?.length || 0}</div>
          <div className="text-gray-400 text-sm">Topics</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{project?.files?.length || 0}</div>
          <div className="text-gray-400 text-sm">Files</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{project?.links?.length || 0}</div>
          <div className="text-gray-400 text-sm">Links</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{project?.activities?.length || 0}</div>
          <div className="text-gray-400 text-sm">Activities</div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;