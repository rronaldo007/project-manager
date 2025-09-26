import React from 'react';

const IdeaSidebar = ({ idea, onShowAddResource }) => {
  return (
    <div className="space-y-6">
      {/* Meta Info */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-400">Owner:</span>
            <span className="text-white ml-2">{idea.owner?.first_name} {idea.owner?.last_name}</span>
          </div>
          <div>
            <span className="text-gray-400">Created:</span>
            <span className="text-white ml-2">{new Date(idea.created_at).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-400">Updated:</span>
            <span className="text-white ml-2">{new Date(idea.updated_at).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-400">Projects:</span>
            <span className="text-white ml-2">{idea.projects_count}</span>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Resources ({idea.resources?.length || 0})</h3>
          <button
            onClick={onShowAddResource}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add</span>
          </button>
        </div>
        <div className="space-y-3">
          {idea.resources && idea.resources.length > 0 ? (
            idea.resources.map((resource) => (
              <div key={resource.id} className="bg-gray-700/30 rounded-lg p-3">
                
                <a  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-400 hover:text-blue-300 text-sm"
                >
                  {resource.title}
                </a>
                <div className="text-xs text-gray-400 mt-1">
                  {resource.resource_type} • {new Date(resource.created_at).toLocaleDateString()}
                </div>
                {resource.description && (
                  <p className="text-gray-300 text-xs mt-2">{resource.description}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4 text-sm">No resources yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaSidebar;
