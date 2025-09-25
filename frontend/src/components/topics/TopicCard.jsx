import React, { useState } from 'react';

const TopicCard = ({ topic, onClick, canEdit, onUpdate, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleQuickAction = async (action, e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    
    if (action === 'delete') {
      await onDelete(topic.id);
    }
  };

  return (
    <div 
      className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all duration-200 cursor-pointer group hover:shadow-lg"
      onClick={onClick}
    >
      {/* Color stripe */}
      <div 
        className="h-1 w-full rounded-t-xl"
        style={{ backgroundColor: topic.color }}
      ></div>
      
      <div className="p-6">
        {/* Header with menu */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {topic.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2">
              {topic.description || 'No description'}
            </p>
          </div>
          
          {canEdit && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-white transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 top-8 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                  <button
                    onClick={(e) => handleQuickAction('delete', e)}
                    className="w-full px-3 py-2 text-left text-red-400 hover:bg-gray-700 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{topic.notes_count}</div>
            <div className="text-xs text-gray-400">Notes</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{topic.links_count}</div>
            <div className="text-xs text-gray-400">Links</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{topic.media_count}</div>
            <div className="text-xs text-gray-400">Media</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{topic.comments_count}</div>
            <div className="text-xs text-gray-400">Comments</div>
          </div>
        </div>

        {/* Tags */}
        {topic.tags && topic.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {topic.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: tag.color + '40', color: tag.color }}
              >
                {tag.name}
              </span>
            ))}
            {topic.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-400">
                +{topic.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-700">
          <div>Created {formatDate(topic.created_at)}</div>
          <div className="flex items-center space-x-1">
            <span>by</span>
            <span className="font-medium">{topic.created_by.first_name}</span>
          </div>
        </div>
      </div>
      
      {/* Click outside handler for menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default TopicCard;
