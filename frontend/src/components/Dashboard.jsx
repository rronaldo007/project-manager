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

  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    setActiveTab('project-detail');
  };

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
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Profile Settings</h2>
              <p className="text-blue-100 opacity-90">Manage your account information</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-2.5 rounded-xl transition-all duration-200 border border-white/30 flex items-center space-x-2 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-8">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-red-300">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Profile Info Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700/50">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white text-3xl font-bold">
                    {getUserInitials()}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-800 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white mb-1">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-gray-300 mb-2">{user?.email}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center text-gray-400">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Joined {new Date(user?.date_joined).toLocaleDateString()}
                  </span>
                  <span className="flex items-center text-gray-400">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verified Account
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  First Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm border-2 rounded-xl text-white focus:outline-none transition-all duration-200 ${
                        errors.first_name 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-gray-700 focus:border-blue-500 focus:bg-gray-900/70'
                      }`}
                      placeholder="Enter first name"
                    />
                    {errors.first_name && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.first_name}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-gray-900/30 border border-gray-700 rounded-xl text-white">
                    {user?.first_name}
                  </div>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Last Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm border-2 rounded-xl text-white focus:outline-none transition-all duration-200 ${
                        errors.last_name 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-gray-700 focus:border-blue-500 focus:bg-gray-900/70'
                      }`}
                      placeholder="Enter last name"
                    />
                    {errors.last_name && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.last_name}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-gray-900/30 border border-gray-700 rounded-xl text-white">
                    {user?.last_name}
                  </div>
                )}
              </div>

              <div className="md:col-span-2 group">
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Address
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm border-2 rounded-xl text-white focus:outline-none transition-all duration-200 ${
                        errors.email 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-gray-700 focus:border-blue-500 focus:bg-gray-900/70'
                      }`}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-gray-900/30 border border-gray-700 rounded-xl text-white">
                    {user?.email}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700/50">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-6 py-2.5 border-2 border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Sidebar */}
      <div className={`bg-gray-900/95 backdrop-blur-md border-r border-gray-700/50 transition-all duration-300 shadow-2xl ${
        isSidebarOpen ? 'w-72' : 'w-20'
      }`}>
        <div className="p-5">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
              <span className="text-white font-bold text-lg">PM</span>
            </div>
            {isSidebarOpen && (
              <span className="text-white text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ProjectManager
              </span>
            )}
          </div>

          {/* User Info */}
          <div className="mb-10 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">
                  {getUserInitials()}
                </span>
              </div>
              {isSidebarOpen && (
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveTab('profile');
                setSelectedProjectId(null);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {isSidebarOpen && <span className="font-medium">Profile</span>}
            </button>

            <button
              onClick={() => {
                setActiveTab('projects');
                setSelectedProjectId(null);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === 'projects' || activeTab === 'project-detail'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {isSidebarOpen && <span className="font-medium">Projects</span>}
            </button>

            <div className="pt-4 mt-4 border-t border-gray-700/50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/10 transition-all duration-200 group"
              >
                <svg className="w-5 h-5 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {isSidebarOpen && <span className="font-medium">Logout</span>}
              </button>
            </div>
          </nav>
        </div>

        {/* Toggle Button */}
        <div className="absolute bottom-6 left-5">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white p-2.5 rounded-xl hover:bg-gray-800/50 transition-all duration-200 group"
          >
            <svg className="w-5 h-5 transform transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={isSidebarOpen ? "M11 19l-7-7 7-7M8 12h13" : "m13 5 7 7-7 7M6 12h13"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 px-8 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {activeTab === 'profile' ? 'User Profile' : 
                 activeTab === 'projects' ? 'Projects' : 
                 activeTab === 'project-detail' ? 'Project Details' : 'Dashboard'}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {activeTab === 'profile' ? 'Manage your personal information' : 
                 activeTab === 'projects' ? 'View and manage all your projects' : 
                 activeTab === 'project-detail' ? 'Project overview and details' : ''}
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-300 bg-gray-800/50 px-4 py-2 rounded-xl">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Welcome back, {user?.first_name}!</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {activeTab === 'profile' && <UserProfile />}
            {activeTab === 'projects' && (
              <ProjectsPage onProjectSelect={handleProjectSelect} />
            )}
            {activeTab === 'project-detail' && selectedProjectId && (
              <ProjectPage 
                projectId={selectedProjectId} 
                onBack={handleBackToProjects}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;