import React, { useState, useEffect } from 'react';
import TopicNotes from './TopicNotes';
import TopicLinks from './TopicLinks';
import TopicMedia from './TopicMedia';
import TopicComments from './TopicComments';
import TopicTags from './TopicTags';
import EditTopicModal from './EditTopicModal';

const TopicDetailModal = ({ topic, projectId, canEdit, onClose, onUpdate, onDelete }) => {
  const [activeTab, setActiveTab] = useState('notes');
  const [detailedTopic, setDetailedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    fetchTopicDetails();
  }, [topic.id]);

  const fetchTopicDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/topics/${topic.id}/`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setDetailedTopic(data);
      }
    } catch (error) {
      console.error('Error fetching topic details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updates) => {
    await onUpdate(topic.id, updates);
    await fetchTopicDetails();
  };

  const handleDelete = async () => {
    await onDelete(topic.id);
  };

  const tabs = [
    {
      id: 'notes',
      label: 'Notes',
      count: detailedTopic?.notes_count || 0,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'links',
      label: 'Links',
      count: detailedTopic?.links_count || 0,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    },
    {
      id: 'media',
      label: 'Media',
      count: detailedTopic?.media_count || 0,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'comments',
      label: 'Comments',
      count: detailedTopic?.comments_count || 0,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: topic.color }}
            ></div>
            <div>
              <h2 className="text-xl font-semibold text-white">{topic.title}</h2>
              <p className="text-gray-400 text-sm">{topic.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {canEdit && (
              <>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  title="Edit Topic"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete Topic"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-700/50'
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
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading topic details...</p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto">
              {activeTab === 'notes' && (
                <TopicNotes 
                  topic={detailedTopic}
                  projectId={projectId}
                  canEdit={canEdit}
                  onRefresh={fetchTopicDetails}
                />
              )}
              {activeTab === 'links' && (
                <TopicLinks 
                  topic={detailedTopic}
                  projectId={projectId}
                  canEdit={canEdit}
                  onRefresh={fetchTopicDetails}
                />
              )}
              {activeTab === 'media' && (
                <TopicMedia 
                  topic={detailedTopic}
                  projectId={projectId}
                  canEdit={canEdit}
                  onRefresh={fetchTopicDetails}
                />
              )}
              {activeTab === 'comments' && (
                <TopicComments 
                  topic={detailedTopic}
                  projectId={projectId}
                  canEdit={canEdit}
                  onRefresh={fetchTopicDetails}
                />
              )}
            </div>
          )}
        </div>

        {/* Tags Footer */}
        <div className="border-t border-gray-700 p-4">
          <TopicTags 
            topic={detailedTopic}
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

export default TopicDetailModal;
