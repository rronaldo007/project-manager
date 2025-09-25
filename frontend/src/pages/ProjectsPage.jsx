import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProjectStats from '../components/project/ProjectStats';
import ProjectFilters from '../components/project/ProjectFilters';
import ProjectsGrid from '../components/project/ProjectsGrid';
import CreateProjectModal from '../components/project/CreateProjectModal';

const ProjectsPage = ({ onProjectSelect }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState({ status: '', priority: '', search: '' });
  const [stats, setStats] = useState(null);

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.priority) params.append('priority', filter.priority);
      if (filter.search) params.append('search', filter.search);
      
      const url = `http://localhost:8000/api/projects/${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        setError('');
      } else {
        setError('Failed to fetch projects');
      }
    } catch (err) {
      setError('Network error while fetching projects');
    } finally {
      setLoading(false);
    }
  };

  // Fetch project statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/projects/stats/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, [filter]);

  const handleProjectClick = (projectId) => {
    if (onProjectSelect) {
      onProjectSelect(projectId);
    }
  };

  const createProject = async (formData) => {
    try {
      const response = await fetch('http://localhost:8000/api/projects/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setProjects([data, ...projects]);
        fetchStats();
        return { success: true };
      } else {
        return { success: false, errors: data };
      }
    } catch (err) {
      return { success: false, errors: { general: 'Network error while creating project' } };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                  Projects Dashboard
                </h1>
                <p className="text-gray-300 text-lg">
                  Track, manage and collaborate on all your projects
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-semibold">Create New Project</span>
              </button>
            </div>
          </div>

          {/* Enhanced Statistics */}
          <div className="mb-8">
            <ProjectStats stats={stats} />
          </div>

          {/* Enhanced Filters */}
          <div className="mb-8">
            <ProjectFilters filter={filter} onFilterChange={setFilter} />
          </div>

          {/* Projects Grid with enhanced styling */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
                Active Projects
              </h2>
              <span className="text-sm text-gray-400">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'} found
              </span>
            </div>
            
            <ProjectsGrid 
              projects={projects}
              loading={loading}
              error={error}
              onProjectClick={handleProjectClick}
            />
          </div>

          {/* Create Project Modal */}
          <CreateProjectModal 
            isOpen={showCreateForm}
            onClose={() => setShowCreateForm(false)}
            onCreateProject={createProject}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;