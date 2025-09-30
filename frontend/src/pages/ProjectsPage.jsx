import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProjectStats from '../components/projects/ProjectStats';
import ProjectsGrid from '../components/projects/ProjectsGrid';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import EditProjectModal from '../components/projects/EditProjectModal';

const ProjectsPage = ({ onProjectSelect }) => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const { user } = useAuth();

  const API_BASE = import.meta.env.VITE_API_URL || '/api';

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/projects/`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Authentication required - please login');
      }
      
      if (response.ok) {
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch(`${API_BASE}/api/projects/stats/`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setStats({
          totalProjects: projects.length,
          activeProjects: projects.filter(p => p.status === 'in_progress').length,
          completedTasks: 0,
          pendingTasks: 0,
        });
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setStats({
          totalProjects: projects.length,
          activeProjects: projects.filter(p => p.status === 'in_progress').length,
          completedTasks: 0,
          pendingTasks: 0,
        });
      }
    } catch (error) {
      setStats({
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'in_progress').length,
        completedTasks: 0,
        pendingTasks: 0,
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const response = await fetch(`${API_BASE}/api/projects/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        await fetchProjects();
        await fetchStats();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create project');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleEditProject = async (projectId, projectData) => {
    try {
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        await fetchProjects();
        await fetchStats();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update project');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchStats();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
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
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Projects</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => {
              setError('');
              fetchProjects();
              fetchStats();
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            My Projects
          </h1>
          <p className="text-gray-400 text-lg">
            Manage and track your project portfolio
          </p>
        </div>

        <ProjectStats stats={stats} loading={statsLoading} />
        
        <ProjectsGrid 
          projects={projects} 
          loading={loading}
          onProjectSelect={onProjectSelect}
          onCreateProject={() => setShowCreateModal(true)}
          onEditProject={handleEditClick}
        />

        {/* Create Project Modal */}
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProject}
        />

        {/* Edit Project Modal */}
        <EditProjectModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProject(null);
          }}
          onSubmit={handleEditProject}
          project={selectedProject}
        />
      </div>
    </div>
  );
};

export default ProjectsPage;
