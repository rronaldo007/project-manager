import React from 'react';
import UserAvatar from './UserAvatar';
import FileActions from './FileActions';
import FileIcon from './FileIcon';

const FilePreviewModal = ({ file, isOpen, onClose, canEdit, onDelete, API_BASE, formatFileSize }) => {
  if (!isOpen || !file) return null;

  const isImage = file.file_type?.includes('image') || 
    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(
      file.title?.split('.').pop()?.toLowerCase()
    );

  const isPDF = file.file_type?.includes('pdf') || 
    file.title?.split('.').pop()?.toLowerCase() === 'pdf';

  const isText = ['txt', 'md', 'json', 'csv'].includes(
    file.title?.split('.').pop()?.toLowerCase()
  );

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-4xl bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-4">
            <FileIcon fileType={file.file_type} fileName={file.title} size="md" />
            <div>
              <h3 className="text-xl font-bold text-white">{file.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                <span>{formatFileSize(file.file_size)}</span>
                <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
                {file.uploaded_by && (
                  <div className="flex items-center space-x-2">
                    <UserAvatar user={file.uploaded_by} size="xs" />
                    <span>by {file.uploaded_by.first_name || file.uploaded_by.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <FileActions 
              file={file}
              canEdit={canEdit}
              onDelete={onDelete}
              API_BASE={API_BASE}
            />
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* File Preview */}
          <div className="mb-6">
            {isImage ? (
              <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                <img 
                  src={`${API_BASE}${file.file}`}
                  alt={file.title}
                  className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden">
                  <div className="text-gray-400 text-center py-8">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Image preview not available</p>
                  </div>
                </div>
              </div>
            ) : isPDF ? (
              <div className="bg-gray-900/50 rounded-xl p-8 text-center">
                <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h4 className="text-white font-medium mb-2">PDF Document</h4>
                <p className="text-gray-400 mb-4">Click download to view this PDF file</p>
                
                <a  href={`${API_BASE}${file.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Open PDF</span>
                </a>
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-xl p-8 text-center">
                <div className="mb-4">
                  <FileIcon fileType={file.file_type} fileName={file.title} size="lg" />
                </div>
                <h4 className="text-white font-medium mb-2">File Preview</h4>
                <p className="text-gray-400 mb-4">
                  {isText ? 'Text file preview not available in this view' : 'Preview not available for this file type'}
                </p>
                
                <a  href={`${API_BASE}${file.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download File</span>
                </a>
              </div>
            )}
          </div>

          {/* File Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Information */}
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">File Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">File Name:</span>
                  <span className="text-white font-medium">{file.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">File Size:</span>
                  <span className="text-white">{formatFileSize(file.file_size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">File Type:</span>
                  <span className="text-white">{file.file_type || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Uploaded:</span>
                  <span className="text-white">{new Date(file.uploaded_at).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Upload Information */}
            {file.uploaded_by && (
              <div className="bg-gray-700/30 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Upload Details</h4>
                <div className="flex items-center space-x-3 mb-4">
                  <UserAvatar user={file.uploaded_by} size="md" />
                  <div>
                    <p className="text-white font-medium">
                      {file.uploaded_by.first_name} {file.uploaded_by.last_name}
                    </p>
                    <p className="text-gray-400 text-sm">{file.uploaded_by.email}</p>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">
                  Uploaded on {new Date(file.uploaded_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {file.description && (
            <div className="mt-6 bg-gray-700/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
              <p className="text-gray-300 leading-relaxed">{file.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
