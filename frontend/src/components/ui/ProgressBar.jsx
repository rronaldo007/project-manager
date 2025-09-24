import React from 'react';

const ProgressBar = ({ percentage, showStats = false }) => {
  const getProgressColor = (percent) => {
    if (percent >= 80) return 'from-green-400 to-emerald-500';
    if (percent >= 60) return 'from-blue-400 to-blue-500';
    if (percent >= 40) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-red-500';
  };

  return (
    <div className="space-y-3">
      {showStats && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            <div className="text-sm text-gray-400">Completed</div>
            <div className="text-lg font-bold text-white">{percentage}%</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            <div className="text-sm text-gray-400">Remaining</div>
            <div className="text-lg font-bold text-white">{100 - percentage}%</div>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-300">Project Progress</span>
          <span className="text-sm font-bold text-white">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(percentage)} transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
