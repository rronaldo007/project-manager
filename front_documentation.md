# Project Manager Frontend Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Memory System](#memory-system)
3. [Component Structure](#component-structure)
4. [State Management](#state-management)
5. [API Integration](#api-integration)
6. [Routing & Navigation](#routing--navigation)
7. [Authentication Flow](#authentication-flow)
8. [UI Components](#ui-components)
9. [Development Setup](#development-setup)
10. [Performance Considerations](#performance-considerations)

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
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── projects/           # Project management components
│   │   ├── files/              # File management components
│   │   ├── topics/             # Topic system components
│   │   ├── links/              # Link management components
│   │   └── project/            # Individual project components
│   ├── hooks/
│   │   ├── useAuth.js          # Authentication hook
│   │   └── useTabMemory.js     # Memory management hooks
│   ├── pages/
│   │   ├── AuthPage.jsx        # Login/Register page
│   │   ├── ProjectPage.jsx     # Individual project view
│   │   └── ProjectsPage.jsx    # Projects overview
│   └── App.jsx                 # Main application component
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

#### 3. View Preferences Memory
```javascript
// Remembers view mode preferences (grid/list)
localStorage.setItem('topicViewMode', 'grid');
```

### Memory Hooks Implementation

#### useTabMemory Hook
```javascript
export const useTabMemory = (defaultTab = 'dashboard') => {
  // Active tab memory with localStorage persistence
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem('dashboardActiveTab') || defaultTab;
    } catch {
      return defaultTab;
    }
  });

  // Persist tab changes
  const setTabWithMemory = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('dashboardActiveTab', tab);
  };

  // Clear all memory on logout
  const clearMemory = () => {
    localStorage.removeItem('dashboardActiveTab');
    localStorage.removeItem('selectedProjectId');
    localStorage.removeItem('sidebarOpen');
    // Clear project-specific memory
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('projectTab_') || key.startsWith('selectedTopic_')) {
        localStorage.removeItem(key);
      }
    });
  };
};
```

#### useProjectTabMemory Hook
```javascript
export const useProjectTabMemory = (projectId, defaultTab = 'overview') => {
  const memoryKey = `projectTab_${projectId}`;
  
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

#### useTopicViewMemory Hook
```javascript
export const useTopicViewMemory = (defaultView = 'grid') => {
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('topicViewMode') || defaultView;
    } catch {
      return defaultView;
    }
  });

  const setViewWithMemory = (view) => {
    setViewMode(view);
    localStorage.setItem('topicViewMode', view);
  };

  return [viewMode, setViewWithMemory];
};
```

### Memory Integration Points

#### Dashboard Level
```javascript
// Dashboard.jsx
const Dashboard = () => {
  const {
    activeTab,
    setActiveTab,
    selectedProjectId,
    setSelectedProjectId,
    isSidebarOpen,
    setIsSidebarOpen,
    clearMemory
  } = useTabMemory('dashboard');

  const handleLogout = async () => {
    clearMemory(); // Clear all memory on logout
    await logout();
  };
};
```

#### Project Level
```javascript
// ProjectPage.jsx
const ProjectPage = ({ projectId }) => {
  const [activeTab, setActiveTab] = useProjectTabMemory(projectId, 'overview');
  
  // Selected topic memory
  const [selectedTopic, setSelectedTopic] = useState(() => {
    try {
      const saved = localStorage.getItem(`selectedTopic_${projectId}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persist topic selection
  useEffect(() => {
    try {
      if (selectedTopic) {
        localStorage.setItem(`selectedTopic_${projectId}`, JSON.stringify(selectedTopic));
      } else {
        localStorage.removeItem(`selectedTopic_${projectId}`);
      }
    } catch (error) {
      console.warn('Could not save selected topic:', error);
    }
  }, [selectedTopic, projectId]);
};
```

#### Component Level
```javascript
// ProjectTopics.jsx
const ProjectTopics = ({ projectId }) => {
  const [viewMode, setViewMode] = useTopicViewMemory('grid');
  
  return (
    <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
  );
};
```

## Component Structure

### Layout Components

#### DashboardLayout
```javascript
const DashboardLayout = ({ 
  children, 
  isSidebarOpen, 
  onSidebarToggle, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      <Sidebar 
        isOpen={isSidebarOpen}
        onToggle={onSidebarToggle}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      <div className="flex-1 flex flex-col">
        <DashboardHeader activeTab={activeTab} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
```

#### Sidebar with Memory
```javascript
const Sidebar = ({ isOpen, onToggle, activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'profile', label: 'Profile', icon: ProfileIcon },
    { id: 'projects', label: 'Projects', icon: ProjectsIcon }
  ];

  return (
    <div className={`transition-all duration-300 ${isOpen ? 'w-72' : 'w-20'}`}>
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`${activeTab === item.id ? 'active-styles' : 'inactive-styles'}`}
        >
          {item.icon}
          {isOpen && <span>{item.label}</span>}
        </button>
      ))}
    </div>
  );
};
```

### Content Components

#### DashboardContent Router
```javascript
const DashboardContent = ({ 
  activeTab, 
  selectedProjectId, 
  onProjectSelect, 
  onBackToProjects 
}) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Welcomepage />;
      case 'profile':
        return <UserProfile />;
      case 'projects':
        return <ProjectsPage onProjectSelect={onProjectSelect} />;
      case 'project-detail':
        if (selectedProjectId) {
          return (
            <ProjectPage
              projectId={selectedProjectId}
              onBack={onBackToProjects}
            />
          );
        }
        // Fallback if no project selected
        setTimeout(() => onBackToProjects(), 0);
        return <div>Loading...</div>;
      default:
        return <Welcomepage />;
    }
  };

  return <div className="h-full">{renderContent()}</div>;
};
```

## State Management

### Authentication Context
```javascript
// useAuth.js
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login/', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
    }
    return response;
  };

  const logout = async () => {
    await fetch('/api/auth/logout/', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me/', {
        credentials: 'include'
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      getUserInitials: () => `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Memory-Aware Components
```javascript
// Components automatically restore their state on mount
const ProjectTopics = ({ projectId }) => {
  // View mode persists across page reloads
  const [viewMode, setViewMode] = useTopicViewMemory('grid');
  
  // Topics data fetched fresh but view preference remembered
  const [topics, setTopics] = useState([]);
  
  useEffect(() => {
    fetchTopics();
  }, [projectId]);

  return (
    <div>
      <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      {viewMode === 'grid' ? <GridView /> : <ListView />}
    </div>
  );
};
```

## API Integration

### Fetch Utilities
```javascript
// Common fetch patterns with credentials
const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Usage in components
const fetchProjects = async () => {
  try {
    const projects = await apiCall('/api/projects/');
    setProjects(projects);
  } catch (error) {
    setError('Failed to load projects');
  }
};
```

### Error Handling Patterns
```javascript
const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/projects/', { credentials: 'include' });
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else if (response.status === 403) {
        setError('You do not have permission to view projects');
      } else {
        setError('Failed to load projects');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <ErrorBanner message={error} onRetry={fetchProjects} />}
      {loading ? <LoadingSkeleton /> : <ProjectsList projects={projects} />}
    </div>
  );
};
```

## Routing & Navigation

### Memory-Based Navigation
Instead of traditional routing, the app uses memory-aware tab-based navigation:

```javascript
// Navigation state stored in memory
const navigationFlow = {
  'dashboard' -> 'Welcome page with stats and recent projects',
  'profile' -> 'User profile management',
  'projects' -> 'Projects overview with grid/list of projects',
  'project-detail' -> 'Individual project view with tabs'
};

// Navigation handled by DashboardContent component
const handleNavigation = (destination, projectId = null) => {
  setActiveTab(destination);
  if (projectId) {
    setSelectedProjectId(projectId);
  }
  // State automatically persisted via memory hooks
};
```

### Deep Navigation Memory
```javascript
// ProjectPage navigation with memory
const ProjectPage = ({ projectId }) => {
  // Remembers which tab was active in this specific project
  const [activeTab, setActiveTab] = useProjectTabMemory(projectId, 'overview');
  
  // Remembers topic navigation within project
  const [viewMode, setViewMode] = useState('project');
  const [selectedTopic, setSelectedTopic] = useState(() => {
    const saved = localStorage.getItem(`selectedTopic_${projectId}`);
    return saved ? JSON.parse(saved) : null;
  });

  // Show topic page if navigated to specific topic
  if (viewMode === 'topic' && selectedTopic) {
    return (
      <TopicPage
        topicId={selectedTopic.id}
        projectId={projectId}
        onBack={() => {
          setSelectedTopic(null);
          setViewMode('project');
        }}
      />
    );
  }

  return <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />;
};
```

## Authentication Flow

### Session Management
```javascript
// App.jsx - Main authentication guard
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? <Dashboard /> : <AuthPage />;
};

// Dashboard.jsx - Memory cleanup on logout
const handleLogout = async () => {
  clearMemory(); // Clear all localStorage memory
  await logout();
  window.location.href = '/'; // Force refresh to clear any remaining state
};
```

### Memory Security
```javascript
// Memory cleared on logout for security
const clearMemory = () => {
  try {
    localStorage.removeItem('dashboardActiveTab');
    localStorage.removeItem('selectedProjectId');
    localStorage.removeItem('sidebarOpen');
    localStorage.removeItem('topicViewMode');
    
    // Clear project-specific memory
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('projectTab_') || key.startsWith('selectedTopic_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Could not clear memory:', error);
  }
};
```

## UI Components

### Design System
```javascript
// Common styling patterns
const cardStyles = "bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl";
const buttonPrimary = "px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg";
const textInput = "w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white";

// Consistent color palette
const statusColors = {
  'in_progress': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'completed': 'text-green-400 bg-green-400/10 border-green-400/20',
  'planning': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  'on_hold': 'text-gray-400 bg-gray-400/10 border-gray-400/20'
};
```

### Responsive Components
```javascript
const ProjectCard = ({ project, onClick }) => (
  <div 
    className="group bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 hover:border-gray-600 transition-colors cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-300">
        {project.title}
      </h3>
      <StatusBadge status={project.status} />
    </div>
    
    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
      {project.description}
    </p>
    
    <ProgressBar progress={project.progress} />
  </div>
);
```

## Performance Considerations

### Memory Optimization
```javascript
// Debounced memory updates to prevent excessive localStorage writes
const debouncedSetMemory = useCallback(
  debounce((key, value) => {
    localStorage.setItem(key, value);
  }, 100),
  []
);
```

### Component Lazy Loading
```javascript
// Lazy load heavy components
const ProjectPage = lazy(() => import('../pages/ProjectPage'));
const TopicPage = lazy(() => import('../components/topics/TopicPage'));

// Usage with Suspense
<Suspense fallback={<LoadingSkeleton />}>
  <ProjectPage projectId={selectedProjectId} />
</Suspense>
```

### Efficient Re-renders
```javascript
// Memoized components to prevent unnecessary re-renders
const ProjectCard = React.memo(({ project, onClick }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.project.id === nextProps.project.id &&
         prevProps.project.updated_at === nextProps.project.updated_at;
});
```

## Development Setup

### Environment Configuration
```bash
# .env.local
VITE_API_URL=http://localhost:8000
VITE_APP_NAME="Project Manager"
```

### Build Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        credentials: 'include'
      }
    }
  }
});
```

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Memory System Benefits & Limitations

### Benefits
1. **User Experience**: Users return to exactly where they left off
2. **State Persistence**: Navigation state survives page reloads
3. **Context Preservation**: Deep navigation paths remembered
4. **Performance**: Reduced need to refetch user preferences
5. **Security**: Memory cleared on logout

### Limitations
1. **Storage Size**: localStorage has ~10MB limit per domain
2. **Browser Compatibility**: Requires modern browsers with localStorage
3. **Privacy Mode**: May not persist in private browsing
4. **Cross-Device**: Memory doesn't sync across devices
5. **Manual Cleanup**: Requires careful memory management to prevent bloat

## Memory System Architecture

The memory system consists of three layers:

1. **Storage Layer**: localStorage for persistence
2. **Hook Layer**: React hooks for state management
3. **Component Layer**: Integration with React components

This creates a seamless experience where the application "remembers" user context across sessions, making it feel more like a native application than a traditional web app.

## API Endpoints Used

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/me/` - Get current user

### Projects
- `GET /api/projects/` - List all projects
- `GET /api/projects/stats/` - Dashboard statistics
- `GET /api/projects/recent/` - Recent projects
- `GET /api/projects/{id}/` - Project details

### Project Resources
- `GET /api/projects/{id}/topics/` - Project topics
- `GET /api/projects/{id}/files/` - Project files
- `GET /api/projects/{id}/links/` - Project links
- `GET /api/projects/{id}/activities/` - Project activities

The frontend is designed to work seamlessly with the Django REST API backend, providing a modern, responsive, and stateful user experience.