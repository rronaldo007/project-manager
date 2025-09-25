import React from 'react';

const LinksLoadingSkeleton = () => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="w-48 h-8 bg-gray-700/50 rounded"></div>
          <div className="w-32 h-10 bg-gray-700/50 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-700/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gray-600/50 rounded-lg"></div>
                <div className="flex-1">
                  <div className="w-3/4 h-4 bg-gray-600/50 rounded mb-2"></div>
                  <div className="w-1/2 h-3 bg-gray-600/30 rounded"></div>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-600/30 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinksLoadingSkeleton;
