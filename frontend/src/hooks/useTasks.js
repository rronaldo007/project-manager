import { useState, useCallback } from 'react';

export const useTasks = (context = 'all') => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const response = await fetch(`/api/tasks/tasks/?${params}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        setError('Failed to load tasks');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [context]);

  const createTask = useCallback(async (taskData) => {
    try {
      const response = await fetch('/api/tasks/tasks/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(prev => [...prev, data]);
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { success: false, errors: errorData };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  }, []);

  const updateTask = useCallback(async (taskId, updates) => {
    try {
      const response = await fetch(`/api/tasks/tasks/${taskId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(prev => prev.map(task => 
          task.id === taskId ? data : task
        ));
        return { success: true, data };
      } else {
        return { success: false, error: 'Update failed' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/tasks/${taskId}/`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        return { success: true };
      } else {
        return { success: false, error: 'Delete failed' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  }, []);

  const completeTask = useCallback(async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/tasks/${taskId}/complete/`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setTasks(prev => prev.map(task =>
          task.id === taskId ? { ...task, status: 'done' } : task
        ));
        return { success: true };
      } else {
        return { success: false, error: 'Failed to complete task' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask
  };
};
