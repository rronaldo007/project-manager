import React from 'react';

const ProjectCard = ({ project, onClick }) => {
  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusColors = {
      'planning': 'bg-blue-900/50 text-blue-300 border border-blue-700',
      'in_progress': 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
      'on_hold': 'bg-gray-600/50 text-gray-300 border border-gray-500',
      'completed': 'bg-green-900/50 text-green-300 border border-green-700',
      'cancelled': 'bg-red-900/50 text-red-300 border border-red-700',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-600/50 text-gray-300 border border-gray-500'}`}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    );
  };

  // Priority badge component
  const PriorityBadge = ({ priority }) => {
    const priorityColors = {
      'low': 'bg-gray-700 text-gray-300',
      'medium': 'bg-blue-700 text-blue-200',
      'high': 'bg-orange-700 text-orange-200',
      'urgent': 'bg-red-700 text-red-200',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${priorityColors[priority] || 'bg-gray-700 text-gray-300'}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  // Progress bar component
  const ProgressBar = ({ percentage }) => (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div 
        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  return (
    <div 
      className="bg-gray-800 border border-gray-700 rounded-lg shadow hover:shadow-lg transition-all cursor-pointer hover:border-gray-600 hover:scale-105"
      onClick={() => onClick(project.id)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-white truncate pr-2">{project.title}</h3>
          <div className="flex flex-col space-y-2">
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-4 h-12 overflow-hidden">
          {project.description || 'No description provided'}
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Progress</span>
            <span>{project.progress_percentage}%</span>
          </div>
          <ProgressBar percentage={project.progress_percentage} />
        </div>
        
        <div className="flex justify-between text-sm text-gray-500">
          <span>Owner: {project.owner.first_name} {project.owner.last_name}</span>
          {project.end_date && (
            <span className={project.is_overdue ? 'text-red-400' : 'text-gray-400'}>
              Due: {new Date(project.end_date).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {project.is_overdue && (
          <div className="mt-2 text-xs text-red-400 font-medium">
            Overdue by {Math.abs(project.days_remaining)} days
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
