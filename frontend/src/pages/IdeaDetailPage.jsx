import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const IdeaDetailPage = ({ ideaId, onBack }) => {
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);

  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    if (ideaId) {
      fetchIdea();
    }
  }, [ideaId]);

  const fetchIdea = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE}/api/ideas/${ideaId}/`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setIdea(data);
      } else {
        setError('Failed to load idea');
      }
    } catch (error) {
      setError('Failed to load idea');
      console.error('Error fetching idea:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIdea = async (updatedData) => {
    try {
      const response = await fetch(`${API_BASE}/api/ideas/${ideaId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        setIdea(data);
        setIsEditing(false);
      } else {
        throw new Error('Failed to update idea');
      }
    } catch (error) {
      console.error('Error updating idea:', error);
      setError('Failed to update idea');
    }
  };

  const handleAddNote = async (noteData) => {
    try {
      const response = await fetch(`${API_BASE}/api/ideas/${ideaId}/notes/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        await fetchIdea(); // Refresh to get updated notes
        setShowAddNote(false);
      } else {
        throw new Error('Failed to add note');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      setError('Failed to add note');
    }
  };

  const handleAddResource = async (resourceData) => {
    try {
      const response = await fetch(`${API_BASE}/api/ideas/${ideaId}/resources/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resourceData),
      });

      if (response.ok) {
        await fetchIdea(); // Refresh to get updated resources
        setShowAddResource(false);
      } else {
        throw new Error('Failed to add resource');
      }
    } catch (error) {
      console.error('Error adding resource:', error);
      setError('Failed to add resource');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'draft': 'bg-gray-500/20 text-gray-400',
      'concept': 'bg-yellow-500/20 text-yellow-400',
      'in_development': 'bg-blue-500/20 text-blue-400',
      'implemented': 'bg-green-500/20 text-green-400',
      'on_hold': 'bg-orange-500/20 text-orange-400',
      'cancelled': 'bg-red-500/20 text-red-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'bg-green-500/20 text-green-400',
      'medium': 'bg-yellow-500/20 text-yellow-400',
      'high': 'bg-red-500/20 text-red-400',
      'critical': 'bg-purple-500/20 text-purple-400'
    };
    return colors[priority] || 'bg-gray-500/20 text-gray-400';
  };

  const EditForm = ({ idea, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      title: idea.title,
      description: idea.description,
      problem_statement: idea.problem_statement || '',
      solution_overview: idea.solution_overview || '',
      target_audience: idea.target_audience || '',
      market_potential: idea.market_potential || '',
      revenue_model: idea.revenue_model || '',
      competition_analysis: idea.competition_analysis || '',
      technical_requirements: idea.technical_requirements || '',
      estimated_effort: idea.estimated_effort || '',
      priority: idea.priority,
      status: idea.status,
      tags: idea.tags || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="Comma-separated tags"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="draft">Draft</option>
              <option value="concept">Concept</option>
              <option value="in_development">In Development</option>
              <option value="implemented">Implemented</option>
              <option value="on_hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  const AddNoteModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
      title: '',
      content: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
      setFormData({ title: '', content: '' });
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Add Note</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-32"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
              >
                Add Note
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AddResourceModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
      title: '',
      url: '',
      description: '',
      resource_type: 'reference'
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
      setFormData({ title: '', url: '', description: '', resource_type: 'reference' });
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Add Resource</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Type</label>
              <select
                value={formData.resource_type}
                onChange={(e) => setFormData({...formData, resource_type: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="research">Research</option>
                <option value="reference">Reference</option>
                <option value="inspiration">Inspiration</option>
                <option value="competitor">Competitor</option>
                <option value="tool">Tool</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-20"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
              >
                Add Resource
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="w-2/3 h-8 bg-gray-700/50 rounded"></div>
          <div className="w-full h-32 bg-gray-700/50 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full h-24 bg-gray-700/50 rounded"></div>
            <div className="w-full h-24 bg-gray-700/50 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
          <p className="text-red-400">{error}</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Ideas
          </button>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="p-8">
        <p className="text-gray-400">Idea not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Ideas
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Back to Ideas"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{idea.title}</h1>
            <div className="flex items-center space-x-3 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(idea.status)}`}>
                {idea.status.replace('_', ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(idea.priority)}`}>
                {idea.priority}
              </span>
              {idea.tag_list && idea.tag_list.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {idea.tag_list.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Idea'}
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <EditForm
            idea={idea}
            onSave={handleUpdateIdea}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <p className="text-gray-300">{idea.description}</p>
            </div>

            {idea.problem_statement && (
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Problem Statement</h2>
                <p className="text-gray-300">{idea.problem_statement}</p>
              </div>
            )}

            {idea.solution_overview && (
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Solution Overview</h2>
                <p className="text-gray-300">{idea.solution_overview}</p>
              </div>
            )}

            {/* Notes Section */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Notes ({idea.notes?.length || 0})</h2>
                <button
                  onClick={() => setShowAddNote(true)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  Add Note
                </button>
              </div>
              <div className="space-y-3">
                {idea.notes && idea.notes.length > 0 ? (
                  idea.notes.map((note) => (
                    <div key={note.id} className="bg-gray-700/30 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-2">{note.title}</h3>
                      <p className="text-gray-300 text-sm">{note.content}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        by {note.author.first_name} {note.author.last_name} • {new Date(note.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No notes yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Meta Info */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Owner:</span>
                  <span className="text-white ml-2">{idea.owner?.first_name} {idea.owner?.last_name}</span>
                </div>
                <div>
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white ml-2">{new Date(idea.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-400">Updated:</span>
                  <span className="text-white ml-2">{new Date(idea.updated_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-400">Projects:</span>
                  <span className="text-white ml-2">{idea.projects_count}</span>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Resources ({idea.resources?.length || 0})</h3>
                <button
                  onClick={() => setShowAddResource(true)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {idea.resources && idea.resources.length > 0 ? (
                  idea.resources.map((resource) => (
                    <div key={resource.id} className="bg-gray-700/30 rounded-lg p-3">
                      
                      <a  href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-400 hover:text-blue-300 text-sm"
                      >
                        {resource.title}
                      </a>
                      <div className="text-xs text-gray-400 mt-1">
                        {resource.resource_type} • {new Date(resource.created_at).toLocaleDateString()}
                      </div>
                      {resource.description && (
                        <p className="text-gray-300 text-xs mt-2">{resource.description}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4 text-sm">No resources yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddNoteModal
        isOpen={showAddNote}
        onClose={() => setShowAddNote(false)}
        onSubmit={handleAddNote}
      />

      <AddResourceModal
        isOpen={showAddResource}
        onClose={() => setShowAddResource(false)}
        onSubmit={handleAddResource}
      />
    </div>
  );
};

export default IdeaDetailPage;
