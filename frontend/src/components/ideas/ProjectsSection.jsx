import React from 'react';

const ProjectsSection = ({ idea, onUnlinkProject, onShowCreateProject, onShowLinkProject, userPermissions }) => {
  const getStatusColor = (status) => {
    const colors = {
      'draft': 'bg-gray-500/20 text-gray-400',
      'concept': 'bg-yellow-500/20 text-yellow-400',
      'in_development': 'bg-blue-500/20 text-blue-400',
      'implemented': 'bg-green-500/20 text-green-400',
      'on_hold': 'bg-orange-500/20 text-orange-400',
      'cancelled': 'bg-red-500/20 text-red-400',
      'planning': 'bg-purple-500/20 text-purple-400',
      'in_progress': 'bg-blue-500/20 text-blue-400',
      'completed': 'bg-green-500/20 text-green-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const canManageProjects = userPermissions?.can_edit;

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Projects ({idea.projects?.length || 0})</h2>
        {canManageProjects && (
          <div className="flex space-x-2">
            <button
              onClick={onShowCreateProject}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Project</span>
            </button>
            <button
              onClick={onShowLinkProject}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Link Project</span>
            </button>
          </div>
        )}
      </div>
      <div className="space-y-3">
        {idea.projects && idea.projects.length > 0 ? (
          idea.projects.map((project) => (
            <div key={project.id} className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-white">{project.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              {canManageProjects && (
                <button
                  onClick={() => onUnlinkProject(project.id)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  title="Unlink project"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-400 mb-4">No projects associated with this idea</p>
            {canManageProjects && (
              <div className="flex justify-center space-x-3">
                <button
                  onClick={onShowCreateProject}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                >
                  Create First Project
                </button>
                <button
                  onClick={onShowLinkProject}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  Link Existing Project
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection;
