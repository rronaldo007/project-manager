import React from 'react';
import FileIcon from './FileIcon';
import UserAvatar from './UserAvatar';
import FileActions from './FileActions';

const FileListItem = ({ file, canEdit, onDelete, API_BASE, formatFileSize }) => {
  return (
    <div className="group flex items-center justify-between p-4 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl hover:bg-gray-800/50 hover:border-gray-600/50 transition-all duration-200">
      <div className="flex items-center space-x-4 min-w-0 flex-1">
        <FileIcon fileType={file.file_type} fileName={file.title} />
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-medium truncate" title={file.title}>
            {file.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
            <span>{formatFileSize(file.file_size)}</span>
            <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
            {file.uploaded_by && (
              <div className="flex items-center space-x-1">
                <span className="text-xs">by {file.uploaded_by.first_name || file.uploaded_by.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-4">
        <FileActions 
          file={file}
          canEdit={canEdit}
          onDelete={onDelete}
          API_BASE={API_BASE}
        />
      </div>
    </div>
  );
};

export default FileListItem;
