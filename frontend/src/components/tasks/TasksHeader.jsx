import React from 'react';

const TasksHeader = ({ 
  tasksCount, 
  viewMode, 
  setViewMode, 
  showFilters, 
  setShowFilters, 
  onCreateTask 
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tasks</h1>
        <p className="text-gray-400 mt-1">
          {tasksCount} task{tasksCount !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex items-center space-x-3">
        {/* View Mode Toggle */}
        <div className="flex bg-gray-800/50 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 rounded text-sm ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded text-sm ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Grid
          </button>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg ${
            showFilters ? 'bg-blue-600 text-white' : 'bg-gray-800/50 text-gray-400'
          }`}
        >
          Filters
        </button>

        {/* New Task Button */}
        <button
          onClick={onCreateTask}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Task
        </button>
      </div>
    </div>
  );
};

export default TasksHeader;
