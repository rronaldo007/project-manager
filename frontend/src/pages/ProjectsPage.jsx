import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

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

  // Handle project card click - call the parent's onProjectSelect
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

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusColors = {
      'planning': 'bg-blue-900/50 text-blue-300 border border-blue-700',
      'in_progress': 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
      'on_hold': 'bg-gray-600/50 text-gray-300 border border-gray-500',
      'completed': 'bg-green-900/50 text-green-300 border border-green-700',
      'cancelled': 'bg-red-900/50 text-red-300 border border-red-700',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-600/50 text-gray-300 border border-gray-500'}`}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    );
  };

  // Priority badge component
  const PriorityBadge = ({ priority }) => {
    const priorityColors = {
      'low': 'bg-gray-700 text-gray-300',
      'medium': 'bg-blue-700 text-blue-200',
      'high': 'bg-orange-700 text-orange-200',
      'urgent': 'bg-red-700 text-red-200',
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${priorityColors[priority] || 'bg-gray-700 text-gray-300'}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  // Progress bar component
  const ProgressBar = ({ percentage }) => (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div 
        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  // Create project form component
  const CreateProjectForm = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      progress_percentage: 0
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const handleSubmit = async () => {
      if (!formData.title.trim()) {
        setFormErrors({ title: 'Title is required' });
        return;
      }

      setSubmitLoading(true);
      setFormErrors({});

      const result = await createProject(formData);

      if (result.success) {
        setShowCreateForm(false);
        setFormData({
          title: '',
          description: '',
          status: 'planning',
          priority: 'medium',
          start_date: new Date().toISOString().split('T')[0],
          end_date: '',
          progress_percentage: 0
        });
        alert('Project created successfully!');
      } else {
        setFormErrors(result.errors);
      }

      setSubmitLoading(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Create New Project</h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {formErrors.general && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded">
              {formErrors.general}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project title"
              />
              {formErrors.title && <p className="text-red-400 text-sm mt-1">{formErrors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="planning">Planning</option>
                  <option value="in_progress">In Progress</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Progress Percentage (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress_percentage}
                onChange={(e) => setFormData({...formData, progress_percentage: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {submitLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Projects</p>
                  <p className="text-2xl font-semibold text-white">{stats.total_projects}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-600/20 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">In Progress</p>
                  <p className="text-2xl font-semibold text-white">{stats.by_status.in_progress}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Completed</p>
                  <p className="text-2xl font-semibold text-white">{stats.by_status.completed}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-600/20 rounded-lg">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Overdue</p>
                  <p className="text-2xl font-semibold text-white">{stats.overdue_projects}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search projects..."
                value={filter.search}
                onChange={(e) => setFilter({...filter, search: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({...filter, status: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
              <select
                value={filter.priority}
                onChange={(e) => setFilter({...filter, priority: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilter({ status: '', priority: '', search: '' })}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
            <div className="text-center text-red-400">{error}</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
            <div className="text-center text-gray-400">
              <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-300">No projects</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="bg-gray-800 border border-gray-700 rounded-lg shadow hover:shadow-lg transition-all cursor-pointer hover:border-gray-600 hover:scale-105"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white truncate pr-2">{project.title}</h3>
                    <div className="flex flex-col space-y-2">
                      <StatusBadge status={project.status} />
                      <PriorityBadge priority={project.priority} />
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 h-12 overflow-hidden">
                    {project.description || 'No description provided'}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{project.progress_percentage}%</span>
                    </div>
                    <ProgressBar percentage={project.progress_percentage} />
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Owner: {project.owner.first_name} {project.owner.last_name}</span>
                    {project.end_date && (
                      <span className={project.is_overdue ? 'text-red-400' : 'text-gray-400'}>
                        Due: {new Date(project.end_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  {project.is_overdue && (
                    <div className="mt-2 text-xs text-red-400 font-medium">
                      Overdue by {Math.abs(project.days_remaining)} days
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateForm && <CreateProjectForm />}
    </div>
  );
};

export default ProjectsPage;
