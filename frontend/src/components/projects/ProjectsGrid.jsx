import React, { useState } from 'react';

const ProjectsGrid = ({ projects, loading, onProjectSelect, onCreateProject, onEditProject }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated');

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'planning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'on_hold': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'planning': return 'Planning';
      case 'completed': return 'Completed';
      case 'on_hold': return 'On Hold';
      default: return status;
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'updated':
        return new Date(b.updated_at) - new Date(a.updated_at);
      case 'created':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'name':
        return a.title.localeCompare(b.title);
      case 'priority':
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div>
        {/* Header with Create Button Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-8 bg-gray-700/30 rounded animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-700/30 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Filter and Sort Controls Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="w-48 h-10 bg-gray-700/30 rounded animate-pulse"></div>
          <div className="w-32 h-10 bg-gray-700/30 rounded animate-pulse"></div>
        </div>

        {/* Projects Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 animate-pulse">
              <div className="w-full h-6 bg-gray-700/50 rounded mb-4"></div>
              <div className="w-3/4 h-4 bg-gray-700/30 rounded mb-4"></div>
              <div className="flex space-x-2 mb-4">
                <div className="w-16 h-6 bg-gray-700/30 rounded-full"></div>
                <div className="w-16 h-6 bg-gray-700/30 rounded-full"></div>
              </div>
              <div className="w-full h-2 bg-gray-700/30 rounded mb-2"></div>
              <div className="flex justify-between">
                <div className="w-12 h-4 bg-gray-700/30 rounded"></div>
                <div className="w-16 h-4 bg-gray-700/30 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <button
            onClick={() => onCreateProject && onCreateProject()}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Projects' },
            { key: 'in_progress', label: 'Active' },
            { key: 'planning', label: 'Planning' },
            { key: 'completed', label: 'Completed' },
            { key: 'on_hold', label: 'On Hold' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-gray-400 text-sm">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="updated">Last Updated</option>
            <option value="created">Date Created</option>
            <option value="name">Name</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {sortedProjects.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-20 h-20 text-gray-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14-7l2 2-2 2M5 13l-2-2 2-2m0 8h14v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z" />
          </svg>
          <h3 className="text-2xl font-semibold text-white mb-3">
            {filter === 'all' ? 'No projects yet' : `No ${filter.replace('_', ' ')} projects`}
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            {filter === 'all' 
              ? 'Start building your project portfolio by creating your first project.'
              : `You don't have any projects with ${filter.replace('_', ' ')} status.`
            }
          </p>
          <button 
            onClick={() => onCreateProject && onCreateProject()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Create New Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 hover:border-gray-600/50 transition-all duration-200 transform hover:scale-105"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg cursor-pointer"
                  onClick={() => onProjectSelect(project.id)}
                >
                  {project.title.charAt(0)}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                  {/* Edit Button - Now always visible with better styling */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProject && onEditProject(project);
                    }}
                    className="flex items-center space-x-1 px-2 py-1 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200 text-xs opacity-70 hover:opacity-100"
                    title="Edit project"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              {/* Project Info - Clickable Area */}
              <div 
                className="mb-4 cursor-pointer"
                onClick={() => onProjectSelect(project.id)}
              >
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {project.description}
                  </p>
                )}
              </div>

              {/* Progress Bar - Clickable Area */}
              <div 
                className="mb-4 cursor-pointer"
                onClick={() => onProjectSelect(project.id)}
              >
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{project.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Project Footer - Clickable Area */}
              <div 
                className="flex items-center justify-between text-sm text-gray-500 cursor-pointer"
                onClick={() => onProjectSelect(project.id)}
              >
                <span>Updated</span>
                <span>{new Date(project.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects Count */}
      <div className="mt-8 text-center">
        <p className="text-gray-400">
          Showing {sortedProjects.length} of {projects.length} projects
        </p>
      </div>
    </div>
  );
};

export default ProjectsGrid;
