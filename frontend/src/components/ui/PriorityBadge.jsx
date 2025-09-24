import React from 'react';

const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    'low': { 
      icon: '🟢', 
      text: 'Low Priority', 
      bg: 'bg-gradient-to-r from-gray-600 to-gray-700', 
      textColor: 'text-gray-200'
    },
    'medium': { 
      icon: '🟡', 
      text: 'Medium Priority', 
      bg: 'bg-gradient-to-r from-blue-600 to-blue-700', 
      textColor: 'text-blue-100'
    },
    'high': { 
      icon: '🟠', 
      text: 'High Priority', 
      bg: 'bg-gradient-to-r from-orange-500 to-orange-600', 
      textColor: 'text-orange-100'
    },
    'urgent': { 
      icon: '🔴', 
      text: 'Urgent', 
      bg: 'bg-gradient-to-r from-red-500 to-red-600', 
      textColor: 'text-red-100'
    }
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${config.bg} ${config.textColor}`}>
      <span className="mr-2">{config.icon}</span>
      {config.text}
    </div>
  );
};

export default PriorityBadge;
