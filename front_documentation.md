# Project Manager Frontend Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Memory System](#memory-system)
3. [Component Structure](#component-structure)
4. [State Management](#state-management)
5. [API Integration](#api-integration)
6. [Ideas System Frontend](#ideas-system-frontend)
7. [File Management System](#file-management-system)
8. [Routing & Navigation](#routing--navigation)
9. [Authentication Flow](#authentication-flow)
10. [UI Components](#ui-components)
11. [Development Setup](#development-setup)
12. [Performance Considerations](#performance-considerations)

## Architecture Overview

### Technology Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + Custom Hooks
- **Authentication**: Session-based with Django backend
- **Memory System**: localStorage with React hooks
- **Build Tool**: Vite for fast development and optimized builds

### Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/               # Authentication components
│   │   │   ├── AuthHeader.jsx
│   │   │   ├── AuthToggle.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── DashboardContent.jsx
│   │   │   ├── DashboardHeader.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   └── Welcomepage.jsx
│   │   ├── projects/           # Project management components
│   │   │   ├── CreateProjectModal.jsx
│   │   │   ├── EditProjectModal.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProjectsGrid.jsx
│   │   │   └── ProjectStats.jsx
│   │   ├── project/            # Individual project components
│   │   │   ├── ActivityTimeline.jsx
│   │   │   ├── ProjectActivity.jsx
│   │   │   ├── ProjectHeader.jsx
│   │   │   ├── ProjectOverview.jsx
│   │   │   └── TeamMembers.jsx
│   │   ├── ideas/              # Ideas system components
│   │   │   ├── AddMemberModal.jsx
│   │   │   ├── AddNoteModal.jsx
│   │   │   ├── IdeaContent.jsx
│   │   │   ├── IdeaEditForm.jsx
│   │   │   ├── IdeaHeader.jsx
│   │   │   └── IdeaSidebar.jsx
│   │   ├── files/              # File management components
│   │   │   ├── DragDropOverlay.jsx
│   │   │   ├── FileCard.jsx
│   │   │   ├── FilePreviewModal.jsx
│   │   │   ├── ProjectFiles.jsx
│   │   │   └── UploadButton.jsx
│   │   ├── topics/             # Topic system components
│   │   │   ├── CreateTopicModal.jsx
│   │   │   ├── ProjectTopics.jsx
│   │   │   ├── TopicCard.jsx
│   │   │   ├── TopicPage.jsx
│   │   │   └── TopicNotes.jsx
│   │   ├── links/              # Link management components
│   │   │   ├── AddLinkButton.jsx
│   │   │   ├── LinkCard.jsx
│   │   │   ├── LinkModal.jsx
│   │   │   └── ProjectLinks.jsx
│   │   └── ui/                 # Reusable UI components
│   │       ├── PriorityBadge.jsx
│   │       ├── ProgressBar.jsx
│   │       ├── StatusBadge.jsx
│   │       └── UserAvatar.jsx
│   ├── contexts/               # React contexts
│   │   ├── AppStateContext.jsx
│   │   ├── AuthContext.jsx
│   │   └── NavigationContext.jsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.jsx
│   │   ├── useProjects.jsx
│   │   ├── useRouteMemory.jsx
│   │   ├── useTabMemory.js
│   │   └── useUrlState.js
│   ├── pages/                  # Page components
│   │   ├── AuthPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── IdeaDetailPage.jsx
│   │   ├── IdeasPage.jsx
│   │   ├── ProjectPage.jsx
│   │   └── ProjectsPage.jsx
│   ├── services/               # API service layer
│   │   ├── api.jsx
│   │   ├── auth.jsx
│   │   ├── projects.jsx
│   │   └── projectMembers.jsx
│   └── utils/                  # Utility functions
│       ├── constants.jsx
│       ├── formatters.jsx
│       ├── helpers.jsx
│       └── navigationState.js
```

## Memory System

The memory system provides persistent state across page reloads using localStorage with React hooks.

### Core Memory Hook

```javascript
// useTabMemory.js
export const useTabMemory = (defaultTab = 'dashboard') => {
  const {
    activeTab,
    setActiveTab,
    selectedProjectId,
    setSelectedProjectId,
    selectedIdeaId,
    setSelectedIdeaId,
    isSidebarOpen,
    setIsSidebarOpen,
    clearMemory
  } = useTabMemory('dashboard');
};
```

### Memory Types

#### 1. Dashboard Memory
```javascript
// Remembers active dashboard tab
localStorage.setItem('dashboardActiveTab', 'projects');

// Remembers selected project
localStorage.setItem('selectedProjectId', '123');

// Remembers selected idea
localStorage.setItem('selectedIdeaId', '456');

// Remembers sidebar state
localStorage.setItem('sidebarOpen', 'true');
```

#### 2. Project Memory
```javascript
// Remembers active tab within each project
localStorage.setItem('projectTab_123', 'topics');

// Remembers selected topic within project
localStorage.setItem('selectedTopic_123', '{"id":1,"title":"Research"}');
```

#### 3. Ideas Memory
```javascript
// Remembers ideas page view mode
localStorage.setItem('ideasViewMode', 'grid');

// Remembers ideas filters
localStorage.setItem('ideasFilters', '{"status":"concept","priority":"high"}');

// Remembers active tab within idea details
localStorage.setItem('ideaTab_456', 'notes');
```

#### 4. View Preferences Memory
```javascript
// Remembers view mode preferences (grid/list)
localStorage.setItem('topicViewMode', 'grid');
localStorage.setItem('projectsViewMode', 'grid');
localStorage.setItem('ideasViewMode', 'list');
```

### Memory Hooks Implementation

#### useIdeaMemory Hook
```javascript
export const useIdeaMemory = (defaultView = 'grid') => {
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('ideasViewMode') || defaultView;
    } catch {
      return defaultView;
    }
  });

  const [filters, setFilters] = useState(() => {
    try {
      const saved = localStorage.getItem('ideasFilters');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const setViewWithMemory = (view) => {
    setViewMode(view);
    localStorage.setItem('ideasViewMode', view);
  };

  const setFiltersWithMemory = (newFilters) => {
    setFilters(newFilters);
    localStorage.setItem('ideasFilters', JSON.stringify(newFilters));
  };

  return {
    viewMode,
    setViewMode: setViewWithMemory,
    filters,
    setFilters: setFiltersWithMemory
  };
};
```

#### useIdeaTabMemory Hook
```javascript
export const useIdeaTabMemory = (ideaId, defaultTab = 'overview') => {
  const memoryKey = `ideaTab_${ideaId}`;
  
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem(memoryKey) || defaultTab;
    } catch {
      return defaultTab;
    }
  });

  const setTabWithMemory = (tab) => {
    setActiveTab(tab);
    localStorage.setItem(memoryKey, tab);
  };

  return [activeTab, setTabWithMemory];
};
```

## Ideas System Frontend

### Ideas Management Components

#### IdeasPage Component
```javascript
const IdeasPage = ({ onIdeaSelect }) => {
  const { viewMode, setViewMode, filters, setFilters } = useIdeaMemory();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchIdeas = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/ideas/?${params}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setIdeas(data);
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [filters]);

  return (
    <div className="space-y-6">
      <IdeasHeader
        onCreateIdea={() => setShowCreateModal(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      {viewMode === 'grid' ? (
        <IdeasGrid ideas={ideas} onIdeaSelect={onIdeaSelect} />
      ) : (
        <IdeasList ideas={ideas} onIdeaSelect={onIdeaSelect} />
      )}

      {showCreateModal && (
        <CreateIdeaModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchIdeas();
          }}
        />
      )}
    </div>
  );
};
```

#### IdeaDetailsPage Component
```javascript
const IdeaDetailsPage = ({ ideaId, onBack }) => {
  const [activeTab, setActiveTab] = useIdeaTabMemory(ideaId, 'overview');
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchIdeaDetails = async () => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/`, {
        credentials: 'include'
      });
      const data = await response.json();
      setIdea(data);
    } catch (error) {
      console.error('Failed to fetch idea details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeaDetails();
  }, [ideaId]);

  if (loading) return <LoadingSkeleton />;
  if (!idea) return <ErrorMessage onRetry={fetchIdeaDetails} />;

  return (
    <div className="h-full flex flex-col">
      <IdeaHeader idea={idea} onBack={onBack} />
      
      <IdeaTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        idea={idea}
      />
      
      <div className="flex-1 overflow-y-auto">
        <IdeaTabContent
          activeTab={activeTab}
          idea={idea}
          onIdeaUpdate={fetchIdeaDetails}
        />
      </div>
    </div>
  );
};
```

#### IdeaTabContent Component
```javascript
const IdeaTabContent = ({ activeTab, idea, onIdeaUpdate }) => {
  switch (activeTab) {
    case 'overview':
      return <IdeaOverview idea={idea} onUpdate={onIdeaUpdate} />;
    case 'notes':
      return <IdeaNotes ideaId={idea.id} />;
    case 'resources':
      return <IdeaResources ideaId={idea.id} />;
    case 'team':
      return <IdeaTeam ideaId={idea.id} idea={idea} />;
    case 'projects':
      return <IdeaProjects ideaId={idea.id} idea={idea} />;
    default:
      return <IdeaOverview idea={idea} onUpdate={onIdeaUpdate} />;
  }
};
```

### Ideas Collaboration Components

#### IdeaTeam Component
```javascript
const IdeaTeam = ({ ideaId, idea }) => {
  const [members, setMembers] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/members/`, {
        credentials: 'include'
      });
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  const addMember = async (memberData) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/members/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });

      if (response.ok) {
        fetchMembers();
        setShowAddMember(false);
      }
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const removeMember = async (userId) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/members/${userId}/`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        fetchMembers();
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [ideaId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Team Members</h3>
        {idea.user_permissions?.can_manage_members && (
          <button
            onClick={() => setShowAddMember(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Member
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {members.map(member => (
          <MemberCard
            key={member.id}
            member={member}
            canRemove={idea.user_permissions?.can_manage_members}
            onRemove={() => removeMember(member.user.id)}
          />
        ))}
      </div>

      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onAdd={addMember}
        />
      )}
    </div>
  );
};
```

### Ideas Custom Hooks

#### useIdeas Hook
```javascript
export const useIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchIdeas = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/ideas/?${params}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setIdeas(data);
      } else {
        setError('Failed to load ideas');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const createIdea = useCallback(async (ideaData) => {
    try {
      const response = await fetch('/api/ideas/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ideaData)
      });
      
      if (response.ok) {
        fetchIdeas(); // Refresh list
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, errors: errorData };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }, [fetchIdeas]);

  const updateIdea = useCallback(async (ideaId, updateData) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        fetchIdeas(); // Refresh list
        return { success: true };
      } else {
        return { success: false, error: 'Update failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }, [fetchIdeas]);

  const deleteIdea = useCallback(async (ideaId) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchIdeas(); // Refresh list
        return { success: true };
      } else {
        return { success: false, error: 'Delete failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }, [fetchIdeas]);

  return {
    ideas,
    loading,
    error,
    fetchIdeas,
    createIdea,
    updateIdea,
    deleteIdea
  };
};
```

## File Management System

### File Upload Components

#### FileUpload Component
```javascript
const FileUpload = ({ projectId, onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (files) => {
    setUploading(true);
    
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);
        formData.append('description', '');

        const response = await fetch(`/api/projects/${projectId}/files/`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        });

        if (response.ok) {
          onUploadSuccess();
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
    
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive 
          ? 'border-blue-400 bg-blue-400/10' 
          : 'border-gray-600 hover:border-gray-500'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => handleFileUpload(Array.from(e.target.files))}
        className="hidden"
      />
      
      {uploading ? (
        <div className="space-y-2">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Uploading files...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
            <UploadIcon className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="text-white mb-2">Drop files here or click to upload</p>
            <p className="text-gray-400 text-sm">Supports all file types, max 50MB per file</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Choose Files
          </button>
        </div>
      )}
    </div>
  );
};
```

#### useFileUpload Hook
```javascript
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = useCallback(async (file, endpoint, additionalData = {}) => {
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        setProgress(100);
        const result = await response.json();
        return { success: true, data: result };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData };
      }
    } catch (error) {
      return { success: false, error: 'Upload failed' };
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  const uploadMultipleFiles = useCallback(async (files, endpoint, additionalData = {}) => {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await uploadFile(file, endpoint, {
        ...additionalData,
        title: additionalData.title || file.name
      });
      results.push(result);
    }
    
    return results;
  }, [uploadFile]);

  return {
    uploading,
    progress,
    uploadFile,
    uploadMultipleFiles
  };
};
```

## Enhanced Memory System Features

### Cross-Tab Memory Synchronization
```javascript
// Enhanced memory hook with cross-tab sync
export const useSyncedMemory = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch {
          setValue(defaultValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue]);

  const setValueWithSync = useCallback((newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  }, [key]);

  return [value, setValueWithSync];
};
```

### Memory Analytics
```javascript
// Track memory usage patterns
export const useMemoryAnalytics = () => {
  const getMemoryUsage = () => {
    const keys = Object.keys(localStorage);
    const projectManagerKeys = keys.filter(key => 
      key.startsWith('dashboardActiveTab') ||
      key.startsWith('projectTab_') ||
      key.startsWith('ideaTab_') ||
      key.startsWith('selectedTopic_') ||
      key.includes('ViewMode')
    );

    const usage = projectManagerKeys.reduce((acc, key) => {
      const value = localStorage.getItem(key);
      acc[key] = {
        size: new Blob([value]).size,
        lastModified: new Date().toISOString()
      };
      return acc;
    }, {});

    return {
      totalKeys: projectManagerKeys.length,
      totalSize: Object.values(usage).reduce((sum, item) => sum + item.size, 0),
      breakdown: usage
    };
  };

  const cleanupOldMemory = (daysOld = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('projectTab_') || key.startsWith('ideaTab_')) {
        try {
          const timestamp = localStorage.getItem(`${key}_timestamp`);
          if (timestamp && new Date(timestamp) < cutoffDate) {
            localStorage.removeItem(key);
            localStorage.removeItem(`${key}_timestamp`);
          }
        } catch (error) {
          // Remove corrupted entries
          localStorage.removeItem(key);
        }
      }
    });
  };

  return { getMemoryUsage, cleanupOldMemory };
};
```

## Enhanced Navigation System

### Smart Navigation with Context
```javascript
// Enhanced navigation that maintains context
const useSmartNavigation = () => {
  const { activeTab, setActiveTab, selectedProjectId, selectedIdeaId } = useTabMemory();

  const navigateToProject = useCallback((projectId) => {
    setActiveTab('project-detail');
    setSelectedProjectId(projectId);
    
    // Clear conflicting selections
    setSelectedIdeaId(null);
  }, [setActiveTab, setSelectedProjectId, setSelectedIdeaId]);

  const navigateToIdea = useCallback((ideaId) => {
    setActiveTab('idea-detail');
    setSelectedIdeaId(ideaId);
    
    // Clear conflicting selections
    setSelectedProjectId(null);
  }, [setActiveTab, setSelectedIdeaId, setSelectedProjectId]);

  const navigateToIdeasFromProject = useCallback((projectId) => {
    // Navigate to ideas filtered by project
    setActiveTab('ideas');
    const filters = { project: projectId };
    localStorage.setItem('ideasFilters', JSON.stringify(filters));
  }, [setActiveTab]);

  const navigateBack = useCallback(() => {
    if (selectedProjectId) {
      setActiveTab('projects');
      setSelectedProjectId(null);
    } else if (selectedIdeaId) {
      setActiveTab('ideas');
      setSelectedIdeaId(null);
    } else {
      setActiveTab('dashboard');
    }
  }, [activeTab, selectedProjectId, selectedIdeaId, setActiveTab]);

  return {
    navigateToProject,
    navigateToIdea,
    navigateToIdeasFromProject,
    navigateBack,
    canGoBack: !!(selectedProjectId || selectedIdeaId)
  };
};
```

## Component Integration Examples

### Dashboard with Ideas Integration
```javascript
const Dashboard = () => {
  const { 
    activeTab, 
    setActiveTab, 
    selectedProjectId, 
    setSelectedProjectId,
    selectedIdeaId,
    setSelectedIdeaId,
    isSidebarOpen, 
    setIsSidebarOpen, 
    clearMemory 
  } = useTabMemory('dashboard');

  const { navigateToProject, navigateToIdea, navigateBack } = useSmartNavigation();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Welcomepage 
            onProjectSelect={navigateToProject}
            onIdeaSelect={navigateToIdea}
          />
        );
      case 'projects':
        return <ProjectsPage onProjectSelect={navigateToProject} />;
      case 'ideas':
        return <IdeasPage onIdeaSelect={navigateToIdea} />;
      case 'project-detail':
        return selectedProjectId ? (
          <ProjectPage
            projectId={selectedProjectId}
            onBack={navigateBack}
            onNavigateToIdeas={navigateToIdeasFromProject}
          />
        ) : null;
      case 'idea-detail':
        return selectedIdeaId ? (
          <IdeaDetailsPage
            ideaId={selectedIdeaId}
            onBack={navigateBack}
          />
        ) : null;
      default:
        return <Welcomepage />;
    }
  };

  return (
    <DashboardLayout
      isSidebarOpen={isSidebarOpen}
      onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={clearMemory}
    >
      {renderContent()}
    </DashboardLayout>
  );
};
```

### Enhanced Sidebar with Ideas Navigation
```javascript
const Sidebar = ({ isOpen, onToggle, activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'projects', label: 'Projects', icon: ProjectsIcon },
    { id: 'ideas', label: 'Ideas', icon: LightbulbIcon },
    { id: 'profile', label: 'Profile', icon: ProfileIcon }
  ];

  const { canGoBack, navigateBack } = useSmartNavigation();

  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm border-r border-gray-700/50 transition-all duration-300 ${
      isOpen ? 'w-72' : 'w-20'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          {isOpen && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Project Manager
            </h1>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {canGoBack && (
        <div className="px-6 mb-4">
          <button
            onClick={navigateBack}
            className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            {isOpen && <span>Back</span>}
          </button>
        </div>
      )}

      <nav className="px-6 space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
              activeTab === item.id || 
              (activeTab === 'project-detail' && item.id === 'projects') ||
              (activeTab === 'idea-detail' && item.id === 'ideas')
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border border-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {isOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};
```

## Error Handling & Loading States

### Enhanced Error Handling
```javascript
// Error boundary for Ideas system
const IdeasErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (error) => {
      setHasError(true);
      setError(error);
    };

    window.addEventListener('unhandledrejection', handleError);
    return () => window.removeEventListener('unhandledrejection', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
          <ExclamationIcon className="w-8 h-8 text-red-400" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
          <p className="text-gray-400 mb-4">There was an error loading the ideas system</p>
          <button
            onClick={() => {
              setHasError(false);
              setError(null);
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return children;
};
```

### Loading Skeletons
```javascript
// Skeleton components for better UX
const IdeasGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-2/3 mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-700 rounded w-16"></div>
          <div className="h-6 bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    ))}
  </div>
);

const IdeaDetailsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 bg-gray-700 rounded w-1/2"></div>
    <div className="h-4 bg-gray-700 rounded w-full"></div>
    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-32 bg-gray-700 rounded"></div>
      <div className="h-32 bg-gray-700 rounded"></div>
    </div>
  </div>
);
```

This enhanced frontend documentation now covers:

1. **Complete Ideas System Frontend** - All components, hooks, and integration patterns
2. **Enhanced File Management** - Drag & drop, progress tracking, and error handling
3. **Advanced Memory System** - Cross-tab sync, analytics, and cleanup utilities
4. **Smart Navigation** - Context-aware navigation with proper state management
5. **Error Handling** - Comprehensive error boundaries and recovery patterns
6. **Loading States** - Professional skeleton components for better UX
7. **Integration Examples** - Real-world usage patterns and component composition

The documentation now provides a complete guide for building and maintaining the frontend, with all the modern patterns and best practices you've implemented in your project.