import React, { useState, useEffect } from 'react';
import { useTopicViewMemory } from '../../hooks/useTabMemory';
import FileCard from './FileCard';
import FileListItem from './FileListItem';
import DragDropOverlay from './DragDropOverlay';
import UploadButton from './UploadButton';
import ViewToggle from './ViewToggle';
import EmptyState from './EmptyState';
import FilePreviewModal from './FilePreviewModal';

const ProjectFiles = ({ projectId, canEdit }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [viewMode, setViewMode] = useTopicViewMemory('grid'); // Use memory hook instead of useState
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    fetchFiles();
  }, [projectId]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/files/`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      formData.append('description', '');

      const response = await fetch(`${API_BASE}/api/projects/${projectId}/files/`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        await fetchFiles();
      } else {
        setError('Failed to upload file');
      }
    } catch (error) {
      setError('Failed to upload file');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0] && canEdit) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const deleteFile = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/files/${fileId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await fetchFiles();
        // Close modal if deleted file was being previewed
        if (selectedFile && selectedFile.id === fileId) {
          setShowPreviewModal(false);
          setSelectedFile(null);
        }
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleFilePreview = (file) => {
    setSelectedFile(file);
    setShowPreviewModal(true);
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setSelectedFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const LoadingSkeleton = () => (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="w-48 h-8 bg-gray-700/50 rounded"></div>
          <div className="w-32 h-10 bg-gray-700/50 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-700/30 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gray-600/50 rounded-xl mb-4"></div>
              <div className="w-3/4 h-6 bg-gray-600/50 rounded mb-2"></div>
              <div className="w-1/2 h-4 bg-gray-600/30 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-300 text-sm">{message}</p>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <div 
        className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Project Files
            </h2>
            <div className="bg-gray-700/50 px-3 py-1 rounded-full">
              <span className="text-gray-300 text-sm font-medium">{files.length} files</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            {canEdit && (
              <UploadButton 
                uploading={uploading}
                onFileSelect={handleFileUpload}
              />
            )}
          </div>
        </div>

        <DragDropOverlay isActive={dragActive && canEdit} />

        {error && <ErrorMessage message={error} />}

        {files.length === 0 ? (
          <EmptyState canEdit={canEdit} />
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {files.map((file) => (
                  <FileCard 
                    key={file.id} 
                    file={file}
                    canEdit={canEdit}
                    onDelete={deleteFile}
                    onPreview={handleFilePreview}
                    API_BASE={API_BASE}
                    formatFileSize={formatFileSize}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <FileListItem 
                    key={file.id} 
                    file={file}
                    canEdit={canEdit}
                    onDelete={deleteFile}
                    onPreview={handleFilePreview}
                    API_BASE={API_BASE}
                    formatFileSize={formatFileSize}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <FilePreviewModal 
        file={selectedFile}
        isOpen={showPreviewModal}
        onClose={handleClosePreview}
        canEdit={canEdit}
        onDelete={deleteFile}
        API_BASE={API_BASE}
        formatFileSize={formatFileSize}
      />
    </>
  );
};

export default ProjectFiles;
