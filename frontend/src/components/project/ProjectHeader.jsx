import React from 'react';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';

const ProjectHeader = ({ project, onBack, onEdit, onDelete, canEdit, isEditing }) => (
  <div className="bg-gradient-to-r from-gray-800 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-sm sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={onBack}
            className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <div className="p-2 rounded-lg bg-gray-700/50 group-hover:bg-gray-600/50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-sm">Back to Projects</span>
          </button>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">{project.title}</h1>
            <div className="flex items-center space-x-4">
              <StatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
            </div>
          </div>
        </div>
        
        {canEdit && (
          <div className="flex items-center space-x-3">
            {!isEditing && (
              <>
                <button
                  onClick={onEdit}
                  className="group flex items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  onClick={onDelete}
                  className="group flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-300 hover:text-red-200 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ProjectHeader;
