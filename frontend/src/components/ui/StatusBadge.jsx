import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    'planning': { 
      icon: '📋', 
      text: 'Planning', 
      bg: 'bg-gradient-to-r from-blue-600 to-blue-700', 
      textColor: 'text-blue-100',
      border: 'border-blue-500/30'
    },
    'in_progress': { 
      icon: '⚡', 
      text: 'In Progress', 
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-500', 
      textColor: 'text-yellow-100',
      border: 'border-yellow-400/30'
    },
    'on_hold': { 
      icon: '⏸️', 
      text: 'On Hold', 
      bg: 'bg-gradient-to-r from-gray-500 to-gray-600', 
      textColor: 'text-gray-100',
      border: 'border-gray-400/30'
    },
    'completed': { 
      icon: '✅', 
      text: 'Completed', 
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600', 
      textColor: 'text-green-100',
      border: 'border-green-400/30'
    },
    'cancelled': { 
      icon: '❌', 
      text: 'Cancelled', 
      bg: 'bg-gradient-to-r from-red-500 to-red-600', 
      textColor: 'text-red-100',
      border: 'border-red-400/30'
    }
  };

  const config = statusConfig[status] || statusConfig.planning;

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm ${config.bg} ${config.textColor} ${config.border}`}>
      <span className="mr-2">{config.icon}</span>
      {config.text}
    </div>
  );
};

export default StatusBadge;
