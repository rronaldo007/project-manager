import React from 'react';

const TaskListItem = ({ task, onClick }) => {
  return (
    <div
      onClick={() => onClick(task.id)}
      className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 hover:border-gray-600 
                 transition-all cursor-pointer flex items-center justify-between"
    >
      <div className="flex-1">
        <h3 className="text-white font-medium">{task.title}</h3>
        <p className="text-gray-400 text-sm mt-1">{task.context_display}</p>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`px-3 py-1 rounded text-sm ${
          task.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
          task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {task.priority}
        </span>
        <span className={`px-3 py-1 rounded text-sm ${
          task.status === 'done' ? 'bg-green-500/20 text-green-400' :
          task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
};

export default TaskListItem;
