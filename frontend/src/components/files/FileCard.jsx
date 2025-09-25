import React from 'react';
import FileIcon from './FileIcon';
import UserAvatar from './UserAvatar';
import FileActions from './FileActions';

const FileCard = ({ file, canEdit, onDelete, onPreview, API_BASE, formatFileSize }) => {
  const handleCardClick = (e) => {
    // Don't trigger preview if clicking on action buttons
    if (e.target.closest('.file-actions')) {
      return;
    }
    onPreview(file);
  };

  return (
    <div 
      className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/70 hover:border-gray-600/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-4">
        <FileIcon fileType={file.file_type} fileName={file.title} />
        <div className="file-actions opacity-0 group-hover:opacity-100 transition-opacity">
          <FileActions 
            file={file}
            canEdit={canEdit}
            onDelete={onDelete}
            API_BASE={API_BASE}
          />
        </div>
      </div>
      
      <h3 className="text-white font-semibold text-lg mb-2 truncate" title={file.title}>
        {file.title}
      </h3>
      
      <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
        <span className="font-medium">{formatFileSize(file.file_size)}</span>
        <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
      </div>
      
      {file.uploaded_by && (
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <UserAvatar user={file.uploaded_by} size="sm" />
          <span>by {file.uploaded_by.first_name || file.uploaded_by.email}</span>
        </div>
      )}
      
      {file.description && (
        <p className="text-gray-400 text-sm mt-3 line-clamp-2">{file.description}</p>
      )}

      {/* Click hint overlay */}
      <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none">
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-blue-600/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity delay-200">
            Click to preview file
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
