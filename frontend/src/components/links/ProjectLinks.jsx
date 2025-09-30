import React, { useState, useEffect } from 'react';
import LinkCard from './LinkCard';
import LinkModal from './LinkModal';
import LinkSearch from './LinkSearch';
import AddLinkButton from './AddLinkButton';
import LinksEmptyState from './LinksEmptyState';
import LinksLoadingSkeleton from './LinksLoadingSkeleton';

const ProjectLinks = ({ projectId, canEdit }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const API_BASE = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    fetchLinks();
  }, [projectId]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/links/`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic URL validation and formatting
    let formattedUrl = formData.url.trim();
    if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    try {
      const url = editingLink 
        ? `${API_BASE}/api/projects/${projectId}/links/${editingLink.id}/`
        : `${API_BASE}/api/projects/${projectId}/links/`;
      
      const method = editingLink ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          url: formattedUrl
        }),
      });

      if (response.ok) {
        await fetchLinks();
        handleCloseModal();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to save link');
      }
    } catch (error) {
      setError('Failed to save link');
      console.error('Error saving link:', error);
    }
  };

  const deleteLink = async (linkId) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/links/${linkId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await fetchLinks();
      }
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const handleOpenAddModal = () => {
    setFormData({ title: '', url: '', description: '' });
    setEditingLink(null);
    setShowAddModal(true);
    setError('');
  };

  const handleOpenEditModal = (link) => {
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description || ''
    });
    setEditingLink(link);
    setShowAddModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingLink(null);
    setFormData({ title: '', url: '', description: '' });
    setError('');
  };

  const getFilteredLinks = () => {
    if (!searchQuery) return links;
    
    const getDomainFromUrl = (url) => {
      try {
        const domain = new URL(url).hostname;
        return domain.replace('www.', '');
      } catch {
        return url;
      }
    };

    return links.filter(link => 
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getDomainFromUrl(link.url).toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (loading) {
    return <LinksLoadingSkeleton />;
  }

  const filteredLinks = getFilteredLinks();

  return (
    <>
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Project Links
            </h2>
            <div className="bg-gray-700/50 px-3 py-1 rounded-full">
              <span className="text-gray-300 text-sm font-medium">{links.length} links</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            {links.length > 0 && (
              <LinkSearch 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder="Search links..."
              />
            )}
            
            {canEdit && (
              <AddLinkButton onClick={handleOpenAddModal} />
            )}
          </div>
        </div>

        {/* Content */}
        {links.length === 0 ? (
          <LinksEmptyState 
            canEdit={canEdit} 
            onAddLink={handleOpenAddModal}
          />
        ) : filteredLinks.length === 0 ? (
          <LinksEmptyState 
            canEdit={canEdit} 
            onAddLink={handleOpenAddModal}
            isSearching={true}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                canEdit={canEdit}
                onEdit={handleOpenEditModal}
                onDelete={deleteLink}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <LinkModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editingLink={editingLink}
        error={error}
      />
    </>
  );
};

export default ProjectLinks;
