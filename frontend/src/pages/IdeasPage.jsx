import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTopicViewMemory } from '../hooks/useTabMemory';
import IdeaPage from './IdeaPage';

const IdeasPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useTopicViewMemory('grid');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({});
  
  // Add state for individual idea view
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [showIdeaDetail, setShowIdeaDetail] = useState(false);

  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchIdeas();
    fetchStats();
  }, [filterStatus, filterPriority, searchQuery]);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterPriority) params.append('priority', filterPriority);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`${API_BASE}/api/ideas/?${params}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array
        setIdeas(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to load ideas:', response.status);
        setError('Failed to load ideas');
        setIdeas([]); // Set empty array on error
      }
    } catch (error) {
      setError('Failed to load ideas');
      setIdeas([]); // Set empty array on error
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/ideas/stats/`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Failed to load stats:', response.status);
        // Set default stats if endpoint fails
        setStats({
          total_ideas: ideas.length,
          by_status: {},
          by_priority: {}
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        total_ideas: ideas.length,
        by_status: {},
        by_priority: {}
      });
    }
  };

  const handleCreateIdea = async (ideaData) => {
    try {
      const response = await fetch(`${API_BASE}/api/ideas/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ideaData),
      });

      if (response.ok) {
        await fetchIdeas();
        await fetchStats();
        setShowCreateModal(false);
      } else {
        throw new Error('Failed to create idea');
      }
    } catch (error) {
      console.error('Error creating idea:', error);
      setError('Failed to create idea');
    }
  };

  // Handle idea selection
  const handleIdeaSelect = (ideaId) => {
    setSelectedIdeaId(ideaId);
    setShowIdeaDetail(true);
  };

  // Handle back to ideas list
  const handleBackToIdeas = () => {
    setSelectedIdeaId(null);
    setShowIdeaDetail(false);
  };

  // If showing individual idea, render IdeaPage
  if (showIdeaDetail && selectedIdeaId) {
    return (
      <IdeaPage
        ideaId={selectedIdeaId}
        onBack={handleBackToIdeas}
      />
    );
  }

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

  const ViewToggle = ({ viewMode, onViewModeChange }) => (
    <div className="flex bg-gray-700/50 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange('grid')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'grid' 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-400 hover:text-white'
        }`}
        title="Grid view"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'list' 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-400 hover:text-white'
        }`}
        title="List view"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </button>
    </div>
  );

  const IdeaCard = ({ idea }) => (
    <div 
      className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600 transition-colors cursor-pointer group"
      onClick={() => handleIdeaSelect(idea.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-300">
          {idea.title}
        </h3>
        <div className="flex items-center space-x-2 ml-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(idea.status)}`}>
            {idea.status.replace('_', ' ')}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(idea.priority)}`}>
            {idea.priority}
          </span>
        </div>
      </div>
      
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {idea.description}
      </p>
      
      {idea.tag_list && idea.tag_list.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {idea.tag_list.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
              {tag}
            </span>
          ))}
          {idea.tag_list.length > 3 && (
            <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded">
              +{idea.tag_list.length - 3}
            </span>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>{idea.notes_count || 0} notes</span>
          <span>{idea.resources_count || 0} resources</span>
          <span>{idea.projects_count || 0} projects</span>
        </div>
        <span>{new Date(idea.updated_at).toLocaleDateString()}</span>
      </div>
    </div>
  );

  const IdeaListItem = ({ idea }) => (
    <div 
      className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 hover:border-gray-600 transition-colors cursor-pointer group"
      onClick={() => handleIdeaSelect(idea.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-white font-medium group-hover:text-blue-300">
              {idea.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(idea.status)}`}>
              {idea.status.replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(idea.priority)}`}>
              {idea.priority}
            </span>
          </div>
          <p className="text-gray-400 text-sm line-clamp-1 mb-2">
            {idea.description}
          </p>
          {idea.tag_list && idea.tag_list.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {idea.tag_list.slice(0, 5).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-right text-sm text-gray-500 ml-4">
          <div className="flex items-center space-x-4 mb-1">
            <span>{idea.notes_count || 0} notes</span>
            <span>{idea.resources_count || 0} resources</span>
            <span>{idea.projects_count || 0} projects</span>
          </div>
          <div>{new Date(idea.updated_at).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );

  const CreateIdeaModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      problem_statement: '',
      solution_overview: '',
      priority: 'medium',
      status: 'draft',
      tags: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Create New Idea</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
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
              <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Problem Statement</label>
              <textarea
                value={formData.problem_statement}
                onChange={(e) => setFormData({...formData, problem_statement: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-20"
                placeholder="What problem does this idea solve?"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Solution Overview</label>
              <textarea
                value={formData.solution_overview}
                onChange={(e) => setFormData({...formData, solution_overview: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-20"
                placeholder="High-level overview of the solution"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="Comma-separated tags (e.g., ai, automation, productivity)"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Create Idea
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
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-48 h-8 bg-gray-700/50 rounded animate-pulse"></div>
          <div className="w-32 h-10 bg-gray-700/50 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-800/30 rounded-xl p-6 animate-pulse">
              <div className="w-3/4 h-6 bg-gray-700/50 rounded mb-4"></div>
              <div className="w-full h-4 bg-gray-700/30 rounded mb-2"></div>
              <div className="w-2/3 h-4 bg-gray-700/30 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ideas</h1>
          <p className="text-gray-400">Capture and develop your innovative concepts</p>
        </div>
        <div className="flex items-center space-x-3">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Idea</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats.total_ideas > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{stats.total_ideas}</div>
            <div className="text-gray-400 text-sm">Total Ideas</div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-400">{stats.by_status?.concept || 0}</div>
            <div className="text-gray-400 text-sm">Concepts</div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400">{stats.by_status?.in_development || 0}</div>
            <div className="text-gray-400 text-sm">In Development</div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400">{stats.by_status?.implemented || 0}</div>
            <div className="text-gray-400 text-sm">Implemented</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="concept">Concept</option>
          <option value="in_development">In Development</option>
          <option value="implemented">Implemented</option>
          <option value="on_hold">On Hold</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Ideas Display */}
      {!Array.isArray(ideas) || ideas.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Ideas Yet</h3>
          <p className="text-gray-400 mb-6">Start capturing your innovative concepts and turn them into reality</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Create Your First Idea
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {ideas.map((idea) => 
            viewMode === 'grid' 
              ? <IdeaCard key={idea.id} idea={idea} />
              : <IdeaListItem key={idea.id} idea={idea} />
          )}
        </div>
      )}

      {/* Create Modal */}
      <CreateIdeaModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateIdea}
      />
    </div>
  );
};

export default IdeasPage