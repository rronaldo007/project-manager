import React, { useState, useEffect } from 'react';
import TopicCard from './TopicCard';
import TopicListItem from './TopicListItem';
import CreateTopicModal from './CreateTopicModal';
import ViewToggle from './ViewToggle';
import UploadButton from './UploadButton';

const ProjectTopics = ({ projectId, canEdit, onTopicsChange, onNavigateToTopic }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [uploading, setUploading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (projectId) {
      fetchTopics();
    }
  }, [projectId]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/topics/`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setTopics(data);
      } else {
        throw new Error('Failed to fetch topics');
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      setError('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (topicData) => {
    try {
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/topics/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(topicData),
      });

      if (response.ok) {
        await fetchTopics();
        onTopicsChange?.();
        setShowCreateModal(false);
      } else {
        throw new Error('Failed to create topic');
      }
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!confirm('Are you sure you want to delete this topic? All associated content will be permanently removed.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/topics/${topicId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await fetchTopics();
        onTopicsChange?.();
      } else {
        throw new Error('Failed to delete topic');
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
      throw error;
    }
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // Create a topic for uploaded files if needed
      let uploadTopic = topics.find(t => t.title === 'Uploaded Files');
      
      if (!uploadTopic) {
        const topicResponse = await fetch(`${API_BASE}/api/projects/${projectId}/topics/`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'Uploaded Files',
            description: 'Files uploaded directly to the project',
            color: '#6B7280'
          }),
        });

        if (topicResponse.ok) {
          uploadTopic = await topicResponse.json();
        } else {
          throw new Error('Failed to create upload topic');
        }
      }

      // Upload each file to the topic
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);
        formData.append('description', `Uploaded file: ${file.name}`);

        await fetch(`${API_BASE}/api/projects/${projectId}/topics/${uploadTopic.id}/media/`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
      }

      await fetchTopics();
      onTopicsChange?.();
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading topics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Error Loading Topics</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button 
          onClick={fetchTopics}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Topics</h2>
          <p className="text-gray-400">Organize project knowledge into focused areas</p>
        </div>
        <div className="flex items-center space-x-3">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          {canEdit && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Topic</span>
            </button>
          )}
        </div>
      </div>

      {/* Topics Display */}
      {topics.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Topics Yet</h3>
          <p className="text-gray-400 mb-6">Create your first topic to start organizing project knowledge</p>
          {canEdit && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Create First Topic
            </button>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onClick={() => onNavigateToTopic(topic)}
                  canEdit={canEdit}
                  onDelete={handleDeleteTopic}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {topics.map((topic) => (
                <TopicListItem
                  key={topic.id}
                  topic={topic}
                  onClick={() => onNavigateToTopic(topic)}
                  canEdit={canEdit}
                  onDelete={handleDeleteTopic}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Topic Modal */}
      {showCreateModal && (
        <CreateTopicModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTopic}
        />
      )}
    </div>
  );
};

export default ProjectTopics;
