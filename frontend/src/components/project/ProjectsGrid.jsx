import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectsGrid = ({ projects, loading, error, onProjectClick }) => {
  if (loading) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Animated loader */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-gray-400 animate-pulse">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/10 backdrop-blur-sm border border-red-700/50 rounded-2xl p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-red-400 font-semibold mb-1">Error Loading Projects</h3>
            <p className="text-red-300/70 text-sm">{error}</p>
          </div>
          <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-16">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {/* Animated empty state illustration */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center animate-pulse">
              <svg className="w-16 h-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-gray-400 max-w-sm">
              Start your journey by creating your first project. Organize, track, and manage everything in one place.
            </p>
          </div>

          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create Your First Project</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Grid View Toggle (optional) */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-400">
          Showing <span className="text-white font-medium">{projects.length}</span> projects
        </p>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button className="p-2 text-white bg-gray-700/50 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Projects Grid with staggered animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="transform transition-all duration-500"
            style={{
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
            }}
          >
            <ProjectCard 
              project={project}
              onClick={onProjectClick}
            />
          </div>
        ))}
      </div>

      {/* Add CSS keyframes via Tailwind's animation utilities or inline */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectsGrid;