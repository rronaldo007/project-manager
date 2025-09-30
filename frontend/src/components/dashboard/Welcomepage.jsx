import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const Welcomepage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    planningProjects: 0,
    onHoldProjects: 0,
    completedTasks: 0,
    pendingTasks: 0,
    averageProgress: 0,
    projectsByPriority: { high: 0, medium: 0, low: 0 }
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const statsResponse = await fetch(`${API_BASE}/api/projects/stats/`, {
        credentials: 'include',
      });

      const recentResponse = await fetch(`${API_BASE}/api/projects/recent/?limit=4`, {
        credentials: 'include',
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      } else {
        const projectsResponse = await fetch(`${API_BASE}/api/projects/`, {
          credentials: 'include',
        });

        if (projectsResponse.ok) {
          const projects = await projectsResponse.json();
          calculateStatsFromProjects(projects);
        }
      }

      if (recentResponse.ok) {
        const recentData = await recentResponse.json();
        setRecentProjects(recentData);
      } else {
        const projectsResponse = await fetch(`${API_BASE}/api/projects/`, {
          credentials: 'include',
        });

        if (projectsResponse.ok) {
          const projects = await projectsResponse.json();
          const sortedProjects = projects
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 4);
          setRecentProjects(sortedProjects);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStatsFromProjects = (projects) => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'in_progress').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const planningProjects = projects.filter(p => p.status === 'planning').length;
    const onHoldProjects = projects.filter(p => p.status === 'on_hold').length;
    
    const totalProgress = projects.reduce((sum, p) => sum + (p.progress || 0), 0);
    const averageProgress = totalProjects > 0 ? Math.round(totalProgress / totalProjects) : 0;
    
    const projectsByPriority = {
      high: projects.filter(p => p.priority === 'high').length,
      medium: projects.filter(p => p.priority === 'medium').length,
      low: projects.filter(p => p.priority === 'low').length
    };

    setStats({
      totalProjects,
      activeProjects,
      completedProjects,
      planningProjects,
      onHoldProjects,
      completedTasks: completedProjects * 8,
      pendingTasks: (activeProjects + planningProjects) * 5,
      averageProgress,
      projectsByPriority
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_progress':
        return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>;
      case 'completed':
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      case 'planning':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>;
      case 'on_hold':
        return <div className="w-3 h-3 bg-gray-500 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
    }
  };

  const formatDateSimple = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="space-y-12">
          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="w-80 h-10 bg-gray-700/30 rounded animate-pulse"></div>
            <div className="w-64 h-6 bg-gray-700/20 rounded animate-pulse"></div>
          </div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-6">
                <div className="w-32 h-6 bg-gray-700/30 rounded animate-pulse"></div>
                <div className="w-20 h-12 bg-gray-700/20 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-light text-white tracking-tight">
              Hello, {user?.first_name}
            </h1>
            <p className="text-xl text-gray-400 font-light">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
              <p className="text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* Stats Grid - Minimalist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-3">
            <h2 className="text-gray-400 text-sm uppercase tracking-wider font-medium">
              Active Work
            </h2>
            <div className="space-y-1">
              <p className="text-4xl font-light text-white">{stats.activeProjects}</p>
              <p className="text-gray-500 text-sm">projects in progress</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-gray-400 text-sm uppercase tracking-wider font-medium">
              Completed
            </h2>
            <div className="space-y-1">
              <p className="text-4xl font-light text-white">{stats.completedProjects}</p>
              <p className="text-gray-500 text-sm">projects finished</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-gray-400 text-sm uppercase tracking-wider font-medium">
              Overall Progress
            </h2>
            <div className="space-y-1">
              <p className="text-4xl font-light text-white">{stats.averageProgress}%</p>
              <p className="text-gray-500 text-sm">average completion</p>
            </div>
          </div>
        </div>

        {/* Recent Projects - Card Layout */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light text-white">Recent Activity</h2>
            {recentProjects.length > 0 && (
              <button className="text-gray-400 hover:text-white transition-colors text-sm">
                View all projects
              </button>
            )}
          </div>

          {recentProjects.length === 0 ? (
            <div className="border-2 border-dashed border-gray-700 rounded-2xl p-16 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white">Start your first project</h3>
                  <p className="text-gray-400 max-w-sm mx-auto">
                    Create a project to organize your work and collaborate with your team
                  </p>
                </div>
                <button className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>New Project</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="group bg-gray-900/40 border border-gray-800 rounded-2xl p-6 hover:bg-gray-900/60 hover:border-gray-700 transition-all duration-300 cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h3 className="text-white font-medium group-hover:text-blue-300 transition-colors">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-gray-400 text-sm line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {getStatusIcon(project.status)}
                        <span className="text-xs text-gray-400 capitalize">
                          {project.status?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{project.progress || 0}% complete</span>
                        <span className="text-gray-500">{formatDateSimple(project.updated_at)}</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full transition-all duration-1000"
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {stats.totalProjects > 0 && (
          <div className="border-t border-gray-800 pt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center space-y-1">
                <p className="text-2xl font-light text-white">{stats.totalProjects}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wide">Total</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-light text-yellow-400">{stats.planningProjects}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wide">Planning</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-light text-gray-400">{stats.onHoldProjects}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wide">On Hold</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-light text-blue-400">{stats.projectsByPriority?.high || 0}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wide">High Priority</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcomepage;