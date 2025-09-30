import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import IdeaHeader from '../components/ideas/IdeaHeader';
import IdeaEditForm from '../components/ideas/IdeaEditForm';
import IdeaContent from '../components/ideas/IdeaContent';
import IdeaSidebar from '../components/ideas/IdeaSidebar';
import CreateProjectModal from '../components/ideas/CreateProjectModal';
import LinkProjectModal from '../components/ideas/LinkProjectModal';
import AddNoteModal from '../components/ideas/AddNoteModal';
import AddResourceModal from '../components/ideas/AddResourceModal';
import MemberManagementModal from '../components/ideas/MemberManagementModal';

const IdeaPage = ({ ideaId, onBack }) => {
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [permissionError, setPermissionError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showLinkProject, setShowLinkProject] = useState(false);
  const [showMemberManagement, setShowMemberManagement] = useState(false);
  const [availableProjects, setAvailableProjects] = useState([]);

  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || '/api';

  // Get user permissions from the idea data
  const userPermissions = idea?.user_permissions || {};
  const userRole = idea?.user_role;
  const isOwner = userRole === 'owner';

  useEffect(() => {
    if (ideaId) {
      fetchIdea();
      fetchAvailableProjects();
    }
  }, [ideaId]);

  const fetchIdea = async () => {
    try {
      setLoading(true);
      setError('');
      setPermissionError(false);
      
      const response = await fetch(`${API_BASE}/api/ideas/${ideaId}/`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setIdea(data);
      } else if (response.status === 403) {
        setPermissionError(true);
        setError('You do not have permission to view this idea');
      } else if (response.status === 404) {
        setPermissionError(true);
        setError('Idea not found or you do not have access to it');
      } else {
        setError('Failed to load idea');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error fetching idea:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableProjects = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/projects/`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setAvailableProjects(data);
      }
    } catch (error) {
      console.error('Error fetching available projects:', error);
    }
  };

  const handleCreateProject = async (projectData) => {
    if (!userPermissions.can_edit) {
      setError('You do not have permission to create projects for this idea');
      return;
    }

    try {
      const projectResponse = await fetch(`${API_BASE}/api/projects/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (projectResponse.ok) {
        const newProject = await projectResponse.json();
        
        const updateResponse = await fetch(`${API_BASE}/api/ideas/${ideaId}/`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            project_ids: [...(idea.projects?.map(p => p.id) || []), newProject.id]
          }),
        });

        if (updateResponse.ok) {
          await fetchIdea();
          await fetchAvailableProjects();
          setShowCreateProject(false);
        } else if (updateResponse.status === 403) {
          setError('You do not have permission to modify this idea');
        } else {
          throw new Error('Failed to associate project with idea');
        }
      } else if (projectResponse.status === 403) {
        setError('You do not have permission to create projects');
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project');
    }
  };

  const handleLinkProject = async (projectId) => {
    if (!userPermissions.can_edit) {
      setError('You do not have permission to link projects');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/ideas/${ideaId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          project_ids: [...(idea.projects?.map(p => p.id) || []), projectId]
        }),
      });

      if (response.ok) {
        await fetchIdea();
        setShowLinkProject(false);
      } else if (response.status === 403) {
        setError('You do not have permission to modify this idea or link this project');
      } else {
        throw new Error('Failed to link project');
      }
    } catch (error) {
      console.error('Error linking project:', error);
      setError('Failed to link project');
    }
  };

  const handleUnlinkProject = async (projectId) => {
    if (!userPermissions.can_edit) {
      setError('You do not have permission to unlink projects');
      return;
    }

    try {
      const updatedProjectIds = idea.projects
        ?.filter(p => p.id !== projectId)
        ?.map(p => p.id) || [];
      
      const response = await fetch(`${API_BASE}/api/ideas/${ideaId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project_ids: updatedProjectIds }),
      });

      if (response.ok) {
        await fetchIdea();
      } else if (response.status === 403) {
        setError('You do not have permission to modify this idea');
      } else {
        throw new Error('Failed to unlink project');
      }
    } catch (error) {
      console.error('Error unlinking project:', error);
      setError('Failed to unlink project');
    }
  };

  const handleUpdateIdea = async (updatedData) => {
    if (!userPermissions.can_edit) {
      setError('You do not have permission to edit this idea');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/ideas/${ideaId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        setIdea(data);
        setIsEditing(false);
      } else if (response.status === 403) {
        setError('You do not have permission to edit this idea');
      } else {
        throw new Error('Failed to update idea');
      }
    } catch (error) {
      console.error('Error updating idea:', error);
      setError('Failed to update idea');
    }
  };

  const handleAddNote = async (noteData) => {
    if (!userPermissions.can_contribute) {
      setError('You do not have permission to add notes');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/ideas/${ideaId}/notes/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        await fetchIdea();
        setShowAddNote(false);
      } else if (response.status === 403) {
        setError('You do not have permission to add notes to this idea');
      } else {
        throw new Error('Failed to add note');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      setError('Failed to add note');
    }
  };

  const handleAddResource = async (resourceData) => {
    if (!userPermissions.can_contribute) {
      setError('You do not have permission to add resources');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/ideas/${ideaId}/resources/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resourceData),
      });

      if (response.ok) {
        await fetchIdea();
        setShowAddResource(false);
      } else if (response.status === 403) {
        setError('You do not have permission to add resources to this idea');
      } else {
        throw new Error('Failed to add resource');
      }
    } catch (error) {
      console.error('Error adding resource:', error);
      setError('Failed to add resource');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-700/50 rounded"></div>
            <div className="w-2/3 h-8 bg-gray-700/50 rounded"></div>
          </div>
          <div className="w-full h-32 bg-gray-700/50 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full h-24 bg-gray-700/50 rounded"></div>
            <div className="w-full h-24 bg-gray-700/50 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && permissionError) {
    return (
      <div className="p-8">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-yellow-400">{error}</p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Ideas
          </button>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="p-8">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
          <p className="text-yellow-400">Idea not found</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Ideas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <IdeaHeader 
        idea={idea}
        onBack={onBack}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onShowMemberManagement={() => setShowMemberManagement(true)}
        userPermissions={userPermissions}
        userRole={userRole}
      />

      {error && !permissionError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {isEditing ? (
        <IdeaEditForm
          idea={idea}
          onSave={handleUpdateIdea}
          onCancel={() => setIsEditing(false)}
          userPermissions={userPermissions}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <IdeaContent
            idea={idea}
            onUnlinkProject={handleUnlinkProject}
            onShowCreateProject={() => setShowCreateProject(true)}
            onShowLinkProject={() => setShowLinkProject(true)}
            onShowAddNote={() => setShowAddNote(true)}
            userPermissions={userPermissions}
          />
          <IdeaSidebar
            idea={idea}
            onShowAddResource={() => setShowAddResource(true)}
            userPermissions={userPermissions}
          />
        </div>
      )}

      {/* Member Management Modal */}
      <MemberManagementModal
        isOpen={showMemberManagement}
        onClose={() => setShowMemberManagement(false)}
        ideaId={ideaId}
      />

      {/* Other Modals - Only show if user has permissions */}
      {userPermissions.can_edit && (
        <>
          <CreateProjectModal
            isOpen={showCreateProject}
            onClose={() => setShowCreateProject(false)}
            onSubmit={handleCreateProject}
          />

          <LinkProjectModal
            isOpen={showLinkProject}
            onClose={() => setShowLinkProject(false)}
            onSubmit={handleLinkProject}
            availableProjects={availableProjects}
            idea={idea}
          />
        </>
      )}

      {userPermissions.can_contribute && (
        <>
          <AddNoteModal
            isOpen={showAddNote}
            onClose={() => setShowAddNote(false)}
            onSubmit={handleAddNote}
          />

          <AddResourceModal
            isOpen={showAddResource}
            onClose={() => setShowAddResource(false)}
            onSubmit={handleAddResource}
          />
        </>
      )}
    </div>
  );
};

export default IdeaPage;
