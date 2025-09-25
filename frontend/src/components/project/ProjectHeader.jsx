import React, { useState } from 'react';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';

const ProjectHeader = ({ 
  project, 
  onBack, 
  onEdit, 
  onDelete, 
  canEdit, 
  isEditing, 
  isUpdating 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete();
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Section - Navigation & Project Info */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 space-y-4 lg:space-y-0">
              {/* Back Button */}
              <button
                onClick={onBack}
                className="group flex items-center space-x-3 text-gray-400 hover:text-white transition-all duration-200 self-start"
              >
                <div className="p-2.5 rounded-xl bg-gray-700/30 group-hover:bg-gray-600/50 backdrop-blur-sm border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-200">
                  <svg className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <span className="text-sm font-medium"></span>
              </button>
              
              {/* Project Info */}
              <div className="space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-2 lg:space-y-0">
                  <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-300">
                    {project.title}
                  </h1>
                  {isUpdating && (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                      <div className="w-3 h-3 border border-blue-400 rounded-full animate-spin border-t-transparent"></div>
                      <span>Updating...</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={project.status} />
                  <PriorityBadge priority={project.priority} />
                  
                  {/* Additional Project Meta */}
                  {project.owner && (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-gray-700/30 rounded-full text-sm text-gray-300">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {project.owner.first_name?.[0]}{project.owner.last_name?.[0]}
                      </div>
                      <span>{project.owner.first_name} {project.owner.last_name}</span>
                    </div>
                  )}
                  
                  {project.created_at && (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-gray-700/30 rounded-full text-sm text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Section - Actions */}
            {canEdit && (
              <div className="flex items-center space-x-3">
                {!isEditing && (
                  <>
                    {/* Edit Button */}
                    <button
                      onClick={onEdit}
                      disabled={isUpdating}
                      className="group flex items-center space-x-2 px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-400/50 rounded-xl text-blue-300 hover:text-blue-200 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="font-medium">Edit</span>
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={handleDeleteClick}
                      disabled={isUpdating}
                      className="group flex items-center space-x-2 px-6 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-400/50 rounded-xl text-red-300 hover:text-red-200 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="font-medium">Delete</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="w-full max-w-md">
            <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Delete Project</h3>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="p-6">
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Are you sure you want to delete <span className="font-semibold text-white">"{project.title}"</span>? 
                  This action cannot be undone and will permanently remove all project data, files, and links.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                  >
                    Yes, Delete Project
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className="flex-1 px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectHeader;