import React, { useState, useEffect } from 'react';
import EditTaskModal from '../components/tasks/EditTaskModal';

const TaskDetailPage = ({ taskId, onBack }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchTaskDetail();
  }, [taskId]);

  const fetchTaskDetail = async () => {
    try {
      const response = await fetch(`/api/tasks/tasks/${taskId}/`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setTask(data);
      }
    } catch (err) {
      console.error('Failed to fetch task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`/api/tasks/tasks/${taskId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        const updated = await response.json();
        setTask(updated);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleEditTask = async (updates) => {
    try {
      const response = await fetch(`/api/tasks/tasks/${taskId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        const updated = await response.json();
        setTask(updated);
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      return { success: false };
    }
  };

  const handleDeleteTask = async () => {
    try {
      const response = await fetch(`/api/tasks/tasks/${taskId}/`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        onBack();
      } else {
        alert('Failed to delete task');
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
      alert('Failed to delete task');
    }
  };

  const handleCompleteTask = async () => {
    try {
      const response = await fetch(`/api/tasks/tasks/${taskId}/complete/`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchTaskDetail();
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Task not found</p>
        <button onClick={onBack} className="mt-4 text-blue-400 hover:text-blue-300">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">{task.title}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Edit Button */}
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Edit
          </button>

          {/* Complete Button */}
          {task.status !== 'done' && (
            <button
              onClick={handleCompleteTask}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Mark Complete
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>

          {/* Status Dropdown */}
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="done">Done</option>
            <option value="blocked">Blocked</option>
          </select>

          {/* Priority Badge */}
          <span className={`px-3 py-1 rounded text-sm ${
            task.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
            task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
            task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {task.priority}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-700 mb-6">
        {['overview', 'comments', 'activity'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-white font-semibold mb-2">Description</h3>
              <p className="text-gray-400">
                {task.description || 'No description provided'}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Context</p>
                <p className="text-white">{task.context_display || 'N/A'}</p>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Created</p>
                <p className="text-white">
                  {new Date(task.created_at).toLocaleDateString()}
                </p>
              </div>

              {task.due_date && (
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Due Date</p>
                  <p className={`${task.is_overdue ? 'text-red-400' : 'text-white'}`}>
                    {new Date(task.due_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {task.assignee && (
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Assignee</p>
                  <p className="text-white">
                    {task.assignee.first_name} {task.assignee.last_name}
                  </p>
                </div>
              )}
            </div>

            {/* Tags */}
            {task.tag_list && task.tag_list.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {task.tag_list.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Progress */}
            {task.subtasks_count > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2">Progress</h3>
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Subtasks completed</span>
                    <span>{Math.round(task.progress_percentage || 0)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${task.progress_percentage || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="text-gray-400 text-center py-8">
            <p>Comments section - Coming soon</p>
            <p className="text-sm mt-2">{task.comments_count || 0} comment(s)</p>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="text-gray-400 text-center py-8">
            <p>Activity timeline - Coming soon</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditTask}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Delete Task</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetailPage;
