import { useState, useEffect } from 'react';

export const useTaskMemory = () => {
  // View mode memory
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('tasksViewMode') || 'list';
    } catch {
      return 'list';
    }
  });

  // Filters memory
  const [filters, setFilters] = useState(() => {
    try {
      const saved = localStorage.getItem('tasksFilters');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persist view mode
  useEffect(() => {
    localStorage.setItem('tasksViewMode', viewMode);
  }, [viewMode]);

  // Persist filters
  useEffect(() => {
    localStorage.setItem('tasksFilters', JSON.stringify(filters));
  }, [filters]);

  const clearFilters = () => {
    setFilters({});
    localStorage.removeItem('tasksFilters');
  };

  return {
    viewMode,
    setViewMode,
    filters,
    setFilters,
    clearFilters
  };
};
