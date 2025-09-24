import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectPage from '../pages/ProjectPage';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout, getUserInitials, updateUser } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  // Handle project selection from ProjectsPage
  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    setActiveTab('project-detail');
  };

  // Handle going back to projects list
  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setActiveTab('projects');
  };

  const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      email: ''
    });

    useEffect(() => {
      if (user) {
        setFormData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || ''
        });
      }
    }, [user]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    };

    const validateForm = () => {
      const newErrors = {};

      if (!formData.first_name.trim()) {
        newErrors.first_name = 'First name is required';
      }

      if (!formData.last_name.trim()) {
        newErrors.last_name = 'Last name is required';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
      if (!validateForm()) {
        return;
      }

      setLoading(true);
      setErrors({});

      try {
        const response = await fetch('http://localhost:8000/api/auth/profile/', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            email: formData.email.trim()
          }),
        });

        const data = await response.json();

        if (response.ok) {
          updateUser(data);
          setIsEditing(false);
          alert('Profile updated successfully!');
        } else {
          const newErrors = {};
          
          if (data.first_name) {
            newErrors.first_name = Array.isArray(data.first_name) ? data.first_name[0] : data.first_name;
          }
          if (data.last_name) {
            newErrors.last_name = Array.isArray(data.last_name) ? data.last_name[0] : data.last_name;
          }
          if (data.email) {
            newErrors.email = Array.isArray(data.email) ? data.email[0] : data.email;
          }
          
          if (Object.keys(newErrors).length === 0) {
            newErrors.general = 'Failed to update profile. Please try again.';
          }
          
          setErrors(newErrors);
        }
      } catch (error) {
        console.error('Profile update error:', error);
        setErrors({ 
          general: 'Network error. Please check your connection and try again.' 
        });
      } finally {
        setLoading(false);
      }
    };

    const handleCancel = () => {
      setFormData({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || ''
      });
      setErrors({});
      setIsEditing(false);
    };

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">User Profile</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700/50 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {getUserInitials()}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-gray-400">{user?.email}</p>
              <p className="text-sm text-gray-500">
                Member since {new Date(user?.date_joined).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none transition-colors ${
                      errors.first_name 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-gray-600 focus:border-blue-500'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-400">{errors.first_name}</p>
                  )}
                </div>
              ) : (
                <p className="text-white bg-gray-700 px-3 py-2 rounded-lg">
                  {user?.first_name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none transition-colors ${
                      errors.last_name 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-gray-600 focus:border-blue-500'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-400">{errors.last_name}</p>
                  )}
                </div>
              ) : (
                <p className="text-white bg-gray-700 px-3 py-2 rounded-lg">
                  {user?.last_name}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none transition-colors ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-400' 
                        : 'border-gray-600 focus:border-blue-500'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>
              ) : (
                <p className="text-white bg-gray-700 px-3 py-2 rounded-lg">
                  {user?.email}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <div className={`bg-gray-800 border-r border-gray-700 transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PM</span>
            </div>
            {isSidebarOpen && (
              <span className="text-white text-xl font-semibold">ProjectManager</span>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {getUserInitials()}
                </span>
              </div>
              {isSidebarOpen && (
                <div>
                  <p className="text-white text-sm font-medium">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-gray-400 text-xs">{user?.email}</p>
                </div>
              )}
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveTab('profile');
                setSelectedProjectId(null);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {isSidebarOpen && <span>Profile</span>}
            </button>

            <button
              onClick={() => {
                setActiveTab('projects');
                setSelectedProjectId(null);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'projects' || activeTab === 'project-detail'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {isSidebarOpen && <span>Projects</span>}
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </nav>
        </div>

        <div className="absolute bottom-4 left-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={isSidebarOpen ? "M11 19l-7-7 7-7M8 12h13" : "m13 5 7 7-7 7M6 12h13"} />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              {activeTab === 'profile' ? 'User Profile' : 
               activeTab === 'projects' ? 'Projects' : 
               activeTab === 'project-detail' ? 'Project Details' : 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">
                Welcome back, {user?.first_name}!
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {activeTab === 'profile' && (
            <div className="p-6">
              <UserProfile />
            </div>
          )}
          {activeTab === 'projects' && (
            <ProjectsPage onProjectSelect={handleProjectSelect} />
          )}
          {activeTab === 'project-detail' && selectedProjectId && (
            <ProjectPage 
              projectId={selectedProjectId} 
              onBack={handleBackToProjects}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
