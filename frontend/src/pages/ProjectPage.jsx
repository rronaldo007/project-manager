import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProjectHeader from '../components/project/ProjectHeader';
import ProjectEditForm from '../components/project/ProjectEditForm';
import ProjectOverview from '../components/project/ProjectOverview';
import ActivityTimeline from '../components/project/ActivityTimeline';
import ProjectLinks from '../components/project/ProjectLinks';
import ProjectFiles from '../components/project/ProjectFiles';

const ProjectPage = ({ projectId, onBack }) => {
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError('');
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

  const updateProject = async (updatedData) => {
    try {
      setIsUpdating(true);
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
        // Success notification would go here
        return true;
      } else {
        setError('Failed to update project');
        return false;
      }
    } catch (err) {
      setError('Network error while updating project');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteProject = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        onBack ? onBack() : window.history.back();
      } else {
        setError('Failed to delete project');
      }
    } catch (err) {
      setError('Network error while deleting project');
    }
  };

  // Enhanced loading state with skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header Skeleton */}
        <div className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-700/50 rounded-lg animate-pulse"></div>
                <div className="w-64 h-8 bg-gray-700/50 rounded-xl animate-pulse"></div>
              </div>
              <div className="flex space-x-3">
                <div className="w-20 h-10 bg-gray-700/50 rounded-xl animate-pulse"></div>
                <div className="w-20 h-10 bg-gray-700/50 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs Skeleton */}
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="py-4">
                  <div className="w-20 h-6 bg-gray-700/50 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <div className="w-48 h-6 bg-gray-700/50 rounded animate-pulse mb-4"></div>
                  <div className="space-y-3">
                    <div className="w-full h-4 bg-gray-700/30 rounded animate-pulse"></div>
                    <div className="w-3/4 h-4 bg-gray-700/30 rounded animate-pulse"></div>
                    <div className="w-1/2 h-4 bg-gray-700/30 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                <div className="w-32 h-6 bg-gray-700/50 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  <div className="w-full h-4 bg-gray-700/30 rounded animate-pulse"></div>
                  <div className="w-2/3 h-4 bg-gray-700/30 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Error Card */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center shadow-xl">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-3">Something went wrong</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">{error}</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={fetchProject}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => onBack ? onBack() : window.history.back()}
                className="flex-1 px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-200 font-medium"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const canEdit = project.owner?.id === user?.id;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊', count: null },
    { id: 'files', label: 'Files', icon: '📁', count: project.files?.length || 0 },
    { id: 'links', label: 'Links', icon: '🔗', count: project.links?.length || 0 },
    { id: 'activity', label: 'Activity', icon: '📈', count: null }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Enhanced Project Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        <div className="relative bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/50">
          <ProjectHeader 
            project={project}
            onBack={onBack}
            onEdit={() => setIsEditing(true)}
            onDelete={deleteProject}
            canEdit={canEdit}
            isEditing={isEditing}
            isUpdating={isUpdating}
          />
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative py-4 px-6 rounded-t-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gray-900/50 text-blue-400 border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== null && tab.count > 0 && (
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </div>
                
                {/* Hover indicator */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform origin-left transition-transform duration-200 ${
                  activeTab === tab.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area with Enhanced Transitions */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="min-h-[60vh]">
          {/* Loading overlay for updates */}
          {isUpdating && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-8 h-8 border-4 border-gray-600 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                  </div>
                  <span className="text-white font-medium">Updating project...</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="transition-all duration-300 ease-in-out">
            {activeTab === 'overview' && (
              <div className="animate-fade-in">
                {isEditing ? (
                  <ProjectEditForm 
                    project={project}
                    onSave={updateProject}
                    onCancel={() => setIsEditing(false)}
                    isUpdating={isUpdating}
                  />
                ) : (
                  <ProjectOverview project={project} />
                )}
              </div>
            )}
            
            {activeTab === 'files' && (
              <div className="animate-fade-in">
                <ProjectFiles projectId={projectId} />
              </div>
            )}
            
            {activeTab === 'links' && (
              <div className="animate-fade-in">
                <ProjectLinks projectId={projectId} />
              </div>
            )}
            
            {activeTab === 'activity' && (
              <div className="animate-fade-in">
                <ActivityTimeline projectId={projectId} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add custom CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProjectPage;