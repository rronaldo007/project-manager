import React from 'react';

const ProjectCard = ({ project, onClick }) => {
  if (!project) return null;

  return (
    <div 
      className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-white truncate">
          {project.title || project.name || 'Untitled Project'}
        </h3>
        <span className={`px-2 py-1 text-xs rounded-full ${
          project.status === 'active' ? 'bg-green-500/20 text-green-400' :
          project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {project.status || 'Draft'}
        </span>
      </div>
      
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {project.description || 'No description available'}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {/* Mock team members */}
            <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-800"></div>
            <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-gray-800"></div>
          </div>
          <span className="text-xs text-gray-500">
            {project.team_count || 2} members
          </span>
        </div>
        
        <div className="text-xs text-gray-500">
          {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'Recently'}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
