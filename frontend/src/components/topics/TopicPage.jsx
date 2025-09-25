import React, { useState, useEffect } from 'react';
import TopicNotes from './TopicNotes';
import TopicLinks from './TopicLinks';
import TopicMedia from './TopicMedia';
import TopicComments from './TopicComments';
import TopicTags from './TopicTags';
import EditTopicModal from './EditTopicModal';

const TopicPage = ({ topicId, projectId, canEdit, onBack, onUpdate, onDelete }) => {
  const [topic, setTopic] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (topicId) {
      fetchTopicDetails();
    }
  }, [topicId]);

  const fetchTopicDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/topics/${topicId}/`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setTopic(data);
      } else if (response.status === 404) {
        setError('Topic not found');
      } else {
        setError('Failed to load topic');
      }
    } catch (error) {
      console.error('Error fetching topic details:', error);
      setError('Failed to load topic');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updates) => {
    try {
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/topics/${topicId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await fetchTopicDetails();
        onUpdate?.();
      } else {
        throw new Error('Failed to update topic');
      }
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this topic? All associated content will be permanently removed.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/topics/${topicId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        onDelete?.();
        onBack();
      } else {
        throw new Error('Failed to delete topic');
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const tabs = [
    {
      id: 'notes',
      label: 'Notes',
      count: topic?.notes_count || 0,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'links',
      label: 'Links',
      count: topic?.links_count || 0,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    },
    {
      id: 'media',
      label: 'Media',
      count: topic?.media_count || 0,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'comments',
      label: 'Comments',
      count: topic?.comments_count || 0,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading topic...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: topic?.color }}
              ></div>
              <div>
                <h1 className="text-2xl font-bold text-white">{topic?.title}</h1>
                <p className="text-gray-400">{topic?.description}</p>
              </div>
            </div>
            
            {canEdit && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 p-1 bg-gray-800/50 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className="px-2 py-0.5 bg-gray-600 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
          {activeTab === 'notes' && (
            <TopicNotes 
              topic={topic}
              projectId={projectId}
              canEdit={canEdit}
              onRefresh={fetchTopicDetails}
            />
          )}
          {activeTab === 'links' && (
            <TopicLinks 
              topic={topic}
              projectId={projectId}
              canEdit={canEdit}
              onRefresh={fetchTopicDetails}
            />
          )}
          {activeTab === 'media' && (
            <TopicMedia 
              topic={topic}
              projectId={projectId}
              canEdit={canEdit}
              onRefresh={fetchTopicDetails}
            />
          )}
          {activeTab === 'comments' && (
            <TopicComments 
              topic={topic}
              projectId={projectId}
              canEdit={canEdit}
              onRefresh={fetchTopicDetails}
            />
          )}
        </div>

        {/* Tags Footer */}
        <div className="mt-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <TopicTags 
            topic={topic}
            projectId={projectId}
            canEdit={canEdit}
            onRefresh={fetchTopicDetails}
          />
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditTopicModal
          topic={topic}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};

export default TopicPage;
