import React from 'react';

const TasksEmptyState = ({ onCreateTask }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">📋</span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">No tasks found</h3>
      <p className="text-gray-400 mb-4">Create your first task to get started</p>
      <button
        onClick={onCreateTask}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Create Task
      </button>
    </div>
  );
};

export default TasksEmptyState;
