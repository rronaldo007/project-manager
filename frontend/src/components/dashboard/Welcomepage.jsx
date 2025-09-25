import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const Welcomepage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls for dashboard data
    const fetchDashboardData = async () => {
      try {
        // Replace with actual API calls
        setTimeout(() => {
          setStats({
            totalProjects: 12,
            activeProjects: 8,
            completedTasks: 47,
            pendingTasks: 23
          });
          setRecentProjects([
            {
              id: 1,
              title: "Website Redesign",
              status: "active",
              priority: "high",
              progress: 75,
              updated_at: "2024-01-15"
            },
            {
              id: 2,
              title: "Mobile App Development",
              status: "planning",
              priority: "medium",
              progress: 30,
              updated_at: "2024-01-14"
            },
            {
              id: 3,
              title: "Database Optimization",
              status: "completed",
              priority: "low",
              progress: 100,
              updated_at: "2024-01-13"
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'planning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'on-hold': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="w-64 h-10 bg-gray-700/50 rounded-xl animate-pulse mb-2"></div>
            <div className="w-48 h-6 bg-gray-700/30 rounded animate-pulse"></div>
          </div>
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                <div className="w-20 h-6 bg-gray-700/50 rounded animate-pulse mb-2"></div>
                <div className="w-16 h-8 bg-gray-700/30 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                <div className="w-48 h-6 bg-gray-700/50 rounded animate-pulse mb-4"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 bg-gray-700/20 rounded-xl">
                      <div className="w-12 h-12 bg-gray-600/50 rounded-xl animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="w-48 h-5 bg-gray-600/50 rounded animate-pulse"></div>
                        <div className="w-32 h-4 bg-gray-600/30 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                <div className="w-32 h-6 bg-gray-700/50 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-full h-4 bg-gray-700/30 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            Welcome back, {user?.first_name || 'User'}!
          </h1>
          <p className="text-gray-400 text-lg">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Projects */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
            <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2M5 13l-2-2 2-2m0 8h14v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <span className="text-2xl">📊</span>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm font-medium">Total Projects</p>
                <p className="text-3xl font-bold text-white">{stats.totalProjects}</p>
              </div>
            </div>
          </div>

          {/* Active Projects */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
            <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-2xl">🚀</span>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm font-medium">Active Projects</p>
                <p className="text-3xl font-bold text-white">{stats.activeProjects}</p>
              </div>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
            <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-2xl">✅</span>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm font-medium">Completed Tasks</p>
                <p className="text-3xl font-bold text-white">{stats.completedTasks}</p>
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
            <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-2xl">⏰</span>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm font-medium">Pending Tasks</p>
                <p className="text-3xl font-bold text-white">{stats.pendingTasks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Recent Projects</h2>
                <button className="px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="group p-4 bg-gray-700/20 hover:bg-gray-700/40 rounded-xl transition-all duration-200 cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {project.title.charAt(0)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-white font-semibold group-hover:text-blue-300 transition-colors">
                            {project.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000" 
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(project.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Insights */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>New Project</span>
                </button>
                
                <button className="w-full px-4 py-3 border-2 border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-200 flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Create Task</span>
                </button>
                
                <button className="w-full px-4 py-3 border-2 border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-200 flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>View Reports</span>
                </button>
              </div>
            </div>

            {/* Today's Focus */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-4">Today's Focus</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Review Website Redesign mockups</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Team standup at 10:00 AM</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Deploy database updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcomepage;