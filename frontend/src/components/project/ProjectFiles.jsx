import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import UserAvatar from '../ui/UserAvatar';

const ProjectFiles = ({ projectId }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingFile, setEditingFile] = useState(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/files/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Files API response:", data);
        setFiles(data);
        setError('');
      } else {
        setError('Failed to fetch files');
      }
    } catch (err) {
      setError('Network error while fetching files');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchFiles();
    }
  }, [projectId]);

  const getFileIcon = (fileType, extension) => {
    if (fileType === 'document') {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  const getFileTypeColor = (fileType) => {
    const colors = {
      'document': 'bg-blue-600 text-white',
      'image': 'bg-green-600 text-white',
      'video': 'bg-purple-600 text-white',
      'audio': 'bg-yellow-600 text-white',
      'archive': 'bg-gray-600 text-white',
      'code': 'bg-red-600 text-white',
      'other': 'bg-gray-500 text-white',
    };
    return colors[fileType] || colors.other;
  };

  const FileUploadForm = ({ file = null, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      title: file?.title || '',
      description: file?.description || '',
      file_type: file?.file_type || 'document',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        if (!formData.title) {
          setFormData({...formData, title: file.name});
        }
      }
    };

    const handleSubmit = async () => {
      if (!formData.title.trim() || (!selectedFile && !file)) {
        setErrors({
          title: !formData.title.trim() ? 'Title is required' : '',
          file: !selectedFile && !file ? 'File is required' : '',
        });
        return;
      }

      setUploading(true);
      setErrors({});

      try {
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title.trim());
        formDataToSend.append('description', formData.description.trim());
        formDataToSend.append('file_type', formData.file_type);
        
        if (selectedFile) {
          formDataToSend.append('file', selectedFile);
        }

        const url = file 
          ? `http://localhost:8000/api/projects/${projectId}/files/${file.id}/`
          : `http://localhost:8000/api/projects/${projectId}/files/`;
        
        const method = file ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          credentials: 'include',
          body: formDataToSend,
        });

        if (response.ok) {
          onSave();
          fetchFiles();
        } else {
          const data = await response.json();
          setErrors(data);
        }
      } catch (err) {
        setErrors({ general: 'Network error while uploading file' });
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
        <h4 className="text-lg font-bold text-white mb-4">
          {file ? 'Edit File' : 'Upload New File'}
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="File title"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          {!file && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">File</label>
              <input
                type="file"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {errors.file && <p className="text-red-400 text-sm mt-1">{errors.file}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
            <select
              value={formData.file_type}
              onChange={(e) => setFormData({...formData, file_type: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="document">Document</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="archive">Archive</option>
              <option value="code">Code</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={2}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional description..."
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {uploading ? 'Uploading...' : (file ? 'Update File' : 'Upload File')}
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const deleteFile = async (fileId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/files/${fileId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setFiles(files.filter(file => file.id !== fileId));
      } else {
        setError('Failed to delete file');
      }
    } catch (err) {
      setError('Network error while deleting file');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white flex items-center">
          <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Project Files
        </h3>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>Upload File</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      {showUploadForm && (
        <FileUploadForm
          onSave={() => setShowUploadForm(false)}
          onCancel={() => setShowUploadForm(false)}
        />
      )}

      {editingFile && (
        <FileUploadForm
          file={editingFile}
          onSave={() => setEditingFile(null)}
          onCancel={() => setEditingFile(null)}
        />
      )}

      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        {files.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h4 className="text-lg font-medium text-gray-300 mb-2">No files uploaded yet</h4>
            <p className="text-gray-400">Upload documents, images, and other files related to this project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file) => (
              <div key={file.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30 group hover:bg-gray-700/40 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getFileTypeColor(file.file_type)}`}>
                      {getFileIcon(file.file_type, file.file_extension)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{file.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>{file.file_type}</span>
                        <span>•</span>
                        <span>{file.formatted_file_size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingFile(file)}
                      className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteFile(file.id, file.title)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {file.description && (
                  <p className="text-gray-300 text-sm mb-3">{file.description}</p>
                )}

                <div className="flex items-center justify-between">
                  
                  <a  href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1 transition-colors"
                  >
                    <span>Download</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </a>
                  
                  <div className="flex items-center space-x-2">
                    <UserAvatar user={file.uploaded_by} />
                    <span className="text-xs text-gray-400">
                      {new Date(file.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectFiles;
