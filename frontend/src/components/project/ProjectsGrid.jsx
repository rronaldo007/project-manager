import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectsGrid = ({ projects, loading, error, onProjectClick }) => {
  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
        <div className="text-center text-red-400">{error}</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
        <div className="text-center text-gray-400">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-300">No projects</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id}
          project={project}
          onClick={onProjectClick}
        />
      ))}
    </div>
  );
};

export default ProjectsGrid;
