import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const ProjectLinks = ({ projectId }) => {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/links/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLinks(data);
        setError('');
      } else {
        setError('Failed to fetch links');
      }
    } catch (err) {
      setError('Network error while fetching links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchLinks();
    }
  }, [projectId]);

  const getLinkIcon = (linkType) => {
    if (linkType === 'github') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      );
    }
    
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    );
  };

  const getLinkTypeColor = (linkType) => {
    const colors = {
      'github': 'bg-gray-700 text-white',
      'documentation': 'bg-green-600 text-white',
      'deployment': 'bg-purple-600 text-white',
    };
    return colors[linkType] || 'bg-gray-600 text-white';
  };

  const LinkForm = ({ link = null, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      title: link?.title || '',
      url: link?.url || '',
      link_type: link?.link_type || 'github',
      description: link?.description || '',
    });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async () => {
      if (!formData.title.trim() || !formData.url.trim()) {
        setErrors({
          title: !formData.title.trim() ? 'Title is required' : '',
          url: !formData.url.trim() ? 'URL is required' : '',
        });
        return;
      }

      setSaving(true);
      setErrors({});

      try {
        const url = link 
          ? `http://localhost:8000/api/projects/${projectId}/links/${link.id}/`
          : `http://localhost:8000/api/projects/${projectId}/links/`;
        
        const method = link ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          onSave();
          fetchLinks();
        } else {
          const data = await response.json();
          setErrors(data);
        }
      } catch (err) {
        setErrors({ general: 'Network error while saving link' });
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
        <h4 className="text-lg font-bold text-white mb-4">
          {link ? 'Edit Link' : 'Add New Link'}
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Main Repository"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/username/repository"
            />
            {errors.url && <p className="text-red-400 text-sm mt-1">{errors.url}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
            <select
              value={formData.link_type}
              onChange={(e) => setFormData({...formData, link_type: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="github">GitHub Repository</option>
              <option value="documentation">Documentation</option>
              <option value="deployment">Live Deployment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {saving ? 'Saving...' : (link ? 'Update Link' : 'Add Link')}
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

  const deleteLink = async (linkId, linkTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${linkTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/links/${linkId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setLinks(links.filter(link => link.id !== linkId));
      } else {
        setError('Failed to delete link');
      }
    } catch (err) {
      setError('Network error while deleting link');
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Project Links
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Link</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      {showAddForm && (
        <LinkForm
          onSave={() => setShowAddForm(false)}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingLink && (
        <LinkForm
          link={editingLink}
          onSave={() => setEditingLink(null)}
          onCancel={() => setEditingLink(null)}
        />
      )}

      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        {links.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <h4 className="text-lg font-medium text-gray-300 mb-2">No links added yet</h4>
            <p className="text-gray-400">Add links to repositories, documentation, and other resources.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {links.map((link) => (
              <div key={link.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30 group hover:bg-gray-700/40 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getLinkTypeColor(link.link_type)}`}>
                      {getLinkIcon(link.link_type)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{link.title}</h4>
                      <span className="text-xs text-gray-400">{link.link_type_display || link.link_type}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingLink(link)}
                      className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteLink(link.id, link.title)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  
                   <a href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1 transition-colors"
                  >
                    <span>Open Link</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  
                  <span className="text-xs text-gray-400">
                    {new Date(link.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectLinks;
