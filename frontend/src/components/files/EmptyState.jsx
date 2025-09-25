import React from 'react';

const EmptyState = ({ canEdit, onFileSelect }) => {
  return (
    <div className="text-center py-20">
      <div className="relative">
        <svg className="w-24 h-24 text-gray-500 mx-auto mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">No files uploaded yet</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        {canEdit 
          ? "Upload files to share with your team. You can drag and drop files or click the upload button."
          : "No files have been shared in this project yet."
        }
      </p>
      {canEdit && (
        <label
          htmlFor="file-upload"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-xl transition-colors cursor-pointer border-2 border-dashed border-gray-600 hover:border-gray-500"
          onClick={onFileSelect}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Choose files to upload</span>
        </label>
      )}
    </div>
  );
};

export default EmptyState;
