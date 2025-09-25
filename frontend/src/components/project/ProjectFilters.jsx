import React from 'react';

const ProjectFilters = ({ filter, onFilterChange }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filter, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({ status: '', priority: '', search: '' });
  };

  const hasActiveFilters = filter.status || filter.priority || filter.search;

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">Filter Projects</h3>
            <p className="text-gray-400 text-xs">Narrow down your search results</p>
          </div>
        </div>
        {hasActiveFilters && (
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
            Active filters
          </span>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Type to search..."
              value={filter.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-2.5 pl-10 bg-gray-900/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-gray-900/70 transition-all duration-200"
            />
            <svg className="absolute left-3 top-3 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Status Select */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Status
          </label>
          <div className="relative">
            <select
              value={filter.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2.5 pr-10 bg-gray-900/50 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:bg-gray-900/70 transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="planning">🎯 Planning</option>
              <option value="in_progress">⚡ In Progress</option>
              <option value="on_hold">⏸️ On Hold</option>
              <option value="completed">✅ Completed</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
            <svg className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Priority Select */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Priority
          </label>
          <div className="relative">
            <select
              value={filter.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-4 py-2.5 pr-10 bg-gray-900/50 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:bg-gray-900/70 transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="">All Priorities</option>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🟠 High</option>
              <option value="urgent">🔴 Urgent</option>
            </select>
            <svg className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={`w-full px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              hasActiveFilters 
                ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white transform hover:scale-105 shadow-lg' 
                : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filter.search && (
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center">
              Search: {filter.search}
              <button onClick={() => handleFilterChange('search', '')} className="ml-2 hover:text-blue-300">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filter.status && (
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center">
              Status: {filter.status.replace('_', ' ')}
              <button onClick={() => handleFilterChange('status', '')} className="ml-2 hover:text-green-300">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filter.priority && (
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm flex items-center">
              Priority: {filter.priority}
              <button onClick={() => handleFilterChange('priority', '')} className="ml-2 hover:text-yellow-300">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;