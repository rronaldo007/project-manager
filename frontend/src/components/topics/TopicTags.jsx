import React, { useState } from 'react';

const TopicTags = ({ topic, projectId, canEdit, onRefresh }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', color: '#3B82F6' });
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL || '/api';

  const colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Gray', value: '#6B7280' }
  ];

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/topics/${topic.id}/tags/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', color: '#3B82F6' });
        setShowCreateForm(false);
        onRefresh();
      }
    } catch (error) {
      console.error('Error creating tag:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (tagId) => {
    try {
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/topics/${topic.id}/tags/${tagId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-300">Tags</h4>
        {canEdit && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            Add Tag
          </button>
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-gray-700 rounded-lg p-3 mb-4">
          <form onSubmit={handleCreateTag} className="space-y-3">
            <input
              type="text"
              placeholder="Tag name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none text-sm"
              required
            />
            <div className="flex space-x-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-6 h-6 rounded-full transition-all duration-200 ${
                    formData.color === color.value
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-700'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-3 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
              >
                {loading ? 'Adding...' : 'Add Tag'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tags List */}
      {topic?.tags && topic.tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {topic.tags.map((tag) => (
            <div
              key={tag.id}
              className="group flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium text-white transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: tag.color + '40', borderColor: tag.color, color: tag.color }}
            >
              <span>{tag.name}</span>
              {canEdit && (
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="opacity-0 group-hover:opacity-100 text-white hover:text-red-300 transition-all duration-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No tags yet</p>
          {canEdit && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              Add first tag
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TopicTags;
