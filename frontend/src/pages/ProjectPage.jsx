import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProjectHeader from '../components/project/ProjectHeader';
import ProjectOverview from '../components/project/ProjectOverview';
import ProjectEditForm from '../components/project/ProjectEditForm';
import ProjectFiles from '../components/files/ProjectFiles';
import ProjectLinks from '../components/links/ProjectLinks';
import ProjectActivity from '../components/project/ProjectActivity';
import TeamMembers from '../components/project/TeamMembers';
import ProjectUsersManagement from '../components/project/ProjectUsersManagement';
import ProjectTopics from '../components/topics/ProjectTopics';

const ProjectPage = ({ projectId, onBack }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else if (response.status === 403) {
        setError('You do not have permission to view this project');
      } else if (response.status === 404) {
        setError('Project not found');
      } else {
        setError('Failed to load project');
      }
    } catch (error) {
      setError('Failed to load project');
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProject(updatedProject);
        setIsEditing(false);
      } else {
        throw new Error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/projects/${projectId}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        onBack(); // Navigate back to projects list
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project');
    }
  };

  const isOwner = project?.owner?.id === user?.id;
  const canEdit = project?.user_role === 'owner' || project?.user_role === 'editor';

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'topics',
      label: 'Topics',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      count: project?.topics_count || 0
    },
    {
      id: 'team',
      label: 'Team',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      count: (project?.memberships?.length || 0) + 1
    },
    {
      id: 'files',
      label: 'Files',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      count: 0 // Will be updated by ProjectFiles component
    },
    {
      id: 'links',
      label: 'Links',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      count: 0 // Will be updated by ProjectLinks component
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading project...</p>
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
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <ProjectHeader 
        project={project}
        onBack={onBack}
        onEdit={() => setIsEditing(!isEditing)}
        onDelete={handleDelete}
        onManageUsers={() => setShowUsersModal(true)}
        canEdit={canEdit}
        isOwner={isOwner}
        isEditing={isEditing}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isEditing ? (
          <ProjectEditForm 
            project={project}
            onSave={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-8 p-1 bg-gray-800/50 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="px-2 py-0.5 bg-gray-600 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="fade-in">
              {activeTab === 'overview' && (
                <ProjectOverview project={project} />
              )}
              {activeTab === 'topics' && (
                <ProjectTopics 
                  projectId={projectId}
                  canEdit={canEdit}
                  onTopicsChange={fetchProject}
                />
              )}
              {activeTab === 'team' && (
                <TeamMembers 
                  project={project}
                  isOwner={isOwner}
                  onManageTeam={() => setShowUsersModal(true)}
                />
              )}
              {activeTab === 'files' && (
                <ProjectFiles 
                  projectId={projectId}
                  canEdit={canEdit}
                />
              )}
              {activeTab === 'links' && (
                <ProjectLinks 
                  projectId={projectId}
                  canEdit={canEdit}
                />
              )}
              {activeTab === 'activity' && (
                <ProjectActivity 
                  projectId={projectId}
                  canEdit={canEdit}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Users Management Modal */}
      {showUsersModal && (
        <ProjectUsersManagement
          projectId={projectId}
          project={project}
          isOwner={isOwner}
          onClose={() => setShowUsersModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectPage;