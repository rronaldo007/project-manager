import React from 'react';

const TaskFilters = ({ filters, setFilters }) => {
  return (
    <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="">All</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Priority</label>
          <select
            value={filters.priority || ''}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value || undefined })}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Context Filter */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Context</label>
          <select
            value={filters.context || ''}
            onChange={(e) => setFilters({ ...filters, context: e.target.value || undefined })}
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="">All</option>
            <option value="standalone">Personal</option>
            <option value="project">Project</option>
            <option value="idea">Idea</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            onClick={() => setFilters({})}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
