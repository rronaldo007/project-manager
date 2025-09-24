import React from 'react';

const ProjectStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">Total Projects</p>
            <p className="text-2xl font-semibold text-white">{stats.total_projects}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-600/20 rounded-lg">
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">In Progress</p>
            <p className="text-2xl font-semibold text-white">{stats.by_status.in_progress}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-600/20 rounded-lg">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">Completed</p>
            <p className="text-2xl font-semibold text-white">{stats.by_status.completed}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-red-600/20 rounded-lg">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-400">Overdue</p>
            <p className="text-2xl font-semibold text-white">{stats.overdue_projects}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStats;
