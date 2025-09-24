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

  // Handle project card click
  const handleProjectClick = (projectId) => {
    if (onProjectSelect) {
      onProjectSelect(projectId);
    }
  };

  // Create project functionality
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
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Projects</h1>
              <p className="text-gray-400 mt-1">Manage and track your projects</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <ProjectStats stats={stats} />

        {/* Filters */}
        <ProjectFilters filter={filter} onFilterChange={setFilter} />

        {/* Projects Grid */}
        <ProjectsGrid 
          projects={projects}
          loading={loading}
          error={error}
          onProjectClick={handleProjectClick}
        />

        {/* Create Project Modal */}
        <CreateProjectModal 
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onCreateProject={createProject}
        />
      </div>
    </div>
  );
};

export default ProjectsPage;
