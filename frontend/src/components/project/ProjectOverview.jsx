import React from 'react';

const ProjectOverview = ({ project }) => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Project Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-700/30 rounded-xl p-4">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Status</h3>
          <p className="text-white text-lg capitalize">{project?.status?.replace('_', ' ')}</p>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-4">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Priority</h3>
          <p className="text-white text-lg capitalize">{project?.priority}</p>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-4">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Progress</h3>
          <p className="text-white text-lg">{project?.progress || 0}%</p>
        </div>
      </div>

      {project?.description && (
        <div className="mb-6">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Description</h3>
          <p className="text-white">{project.description}</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>Overall Progress</span>
          <span>{project?.progress || 0}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
            style={{ width: `${project?.progress || 0}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
