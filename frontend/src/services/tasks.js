import api from './api';

const API_BASE = '/api/tasks';

export const tasksAPI = {
  // Personal/all tasks
  getAll: (filters) => api.get(`${API_BASE}/tasks/`, { params: filters }),
  getById: (id) => api.get(`${API_BASE}/tasks/${id}/`),
  create: (data) => api.post(`${API_BASE}/tasks/`, data),
  update: (id, data) => api.patch(`${API_BASE}/tasks/${id}/`, data),
  delete: (id) => api.delete(`${API_BASE}/tasks/${id}/`),
  complete: (id) => api.post(`${API_BASE}/tasks/${id}/complete/`),

  // Project tasks
  getProjectTasks: (projectId, filters) =>
    api.get(`${API_BASE}/projects/${projectId}/tasks/`, { params: filters }),
  createProjectTask: (projectId, data) =>
    api.post(`${API_BASE}/projects/${projectId}/tasks/`, data),

  // Dashboard
  getDashboard: () => api.get(`${API_BASE}/tasks/dashboard/`),
  getStats: () => api.get(`${API_BASE}/tasks/stats/`),

  // Comments
  getComments: (taskId) => api.get(`${API_BASE}/tasks/${taskId}/comments/`),
  addComment: (taskId, data) => api.post(`${API_BASE}/tasks/${taskId}/comments/`, data),

  // Templates
  getTemplates: () => api.get(`${API_BASE}/templates/`),
  createFromTemplate: (templateId, data) =>
    api.post(`${API_BASE}/templates/${templateId}/create_task/`, data),
};

export default tasksAPI;
