import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProjectHeader from '../components/project/ProjectHeader';
import ProjectEditForm from '../components/project/ProjectEditForm';
import ProjectOverview from '../components/project/ProjectOverview';
import ActivityTimeline from '../components/project/ActivityTimeline';
import ProjectLinks from '../components/project/ProjectLinks';

const ProjectPage = ({ projectId, onBack }) => {
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch project details
  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProject(data);
        setError('');
      } else {
        setError('Failed to fetch project details');
      }
    } catch (err) {
      setError('Network error while fetching project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  // Update project
  const updateProject = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        setProject(data);
        setIsEditing(false);
        alert('Project updated successfully!');
        return true;
      } else {
        setError('Failed to update project');
        return false;
      }
    } catch (err) {
      setError('Network error while updating project');
      return false;
    }
  };

  // Delete project
  const deleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        alert('Project deleted successfully!');
        onBack ? onBack() : window.history.back();
      } else {
        setError('Failed to delete project');
      }
    } catch (err) {
      setError('Network error while deleting project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center bg-gray-800/50 p-8 rounded-xl border border-gray-700/50">
          <div className="text-red-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => onBack ? onBack() : window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const canEdit = project.owner.id === user?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <ProjectHeader 
        project={project}
        onBack={onBack}
        onEdit={() => setIsEditing(true)}
        onDelete={deleteProject}
        canEdit={canEdit}
        isEditing={isEditing}
      />

      {/* Tabs */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('links')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                activeTab === 'links'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              🔗 Links
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                activeTab === 'activity'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              📈 Activity
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          isEditing ? (
            <ProjectEditForm 
              project={project}
              onSave={updateProject}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProjectOverview project={project} />
          )
        )}
        {activeTab === 'links' && <ProjectLinks projectId={projectId} />}
        {activeTab === 'activity' && <ActivityTimeline projectId={projectId} />}
      </div>
    </div>
  );
};

export default ProjectPage;
