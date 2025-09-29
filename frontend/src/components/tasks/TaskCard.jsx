import React from 'react';

const TaskCard = ({ task, onClick }) => {
  return (
    <div
      onClick={() => onClick(task.id)}
      className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 hover:border-gray-600 
                 transition-all cursor-pointer"
    >
      <h3 className="text-white font-medium mb-2">{task.title}</h3>
      {task.description && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded text-xs ${
          task.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
          task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {task.priority}
        </span>
        <span className={`px-2 py-1 rounded text-xs ${
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

export default TaskCard;
