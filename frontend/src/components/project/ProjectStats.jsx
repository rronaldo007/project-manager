import React from 'react';

const ProjectStats = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.total_projects,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      trend: '+12%'
    },
    {
      title: 'In Progress',
      value: stats.by_status.in_progress,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      iconColor: 'text-yellow-400',
      trend: '+5%'
    },
    {
      title: 'Completed',
      value: stats.by_status.completed,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-400',
      trend: '+23%'
    },
    {
      title: 'Overdue',
      value: stats.overdue_projects,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      gradient: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/10',
      iconColor: 'text-red-400',
      trend: '-8%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="relative group"
        >
          {/* Gradient border effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`}></div>
          
          {/* Card content */}
          <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300 transform hover:-translate-y-1">
            {/* Top section with icon and trend */}
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 ${stat.bgColor} rounded-xl backdrop-blur-sm`}>
                <div className={`${stat.iconColor}`}>
                  {stat.icon}
                </div>
              </div>
              
              {/* Trend indicator */}
              <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                stat.trend.startsWith('+') 
                  ? 'bg-green-500/10 text-green-400' 
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {stat.trend}
              </span>
            </div>

            {/* Stats */}
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <span className="text-gray-500 text-sm mb-1">projects</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000`}
                  style={{ width: `${Math.min((stat.value / stats.total_projects) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectStats;