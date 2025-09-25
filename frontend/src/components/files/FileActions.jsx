import React from 'react';

const FileActions = ({ file, canEdit, onDelete, API_BASE }) => {
  return (
    <div className="flex items-center space-x-2">
      
       <a href={`${API_BASE}${file.file}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
        title="Download file"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </a>
      {canEdit && (
        <button
          onClick={() => onDelete(file.id)}
          className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
          title="Delete file"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default FileActions;
