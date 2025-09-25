import React from 'react';

const LinksEmptyState = ({ canEdit, onAddLink, isSearching = false }) => {
  if (isSearching) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-lg font-medium text-white mb-2">No links found</h3>
        <p className="text-gray-400">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="text-center py-20">
      <div className="relative">
        <svg className="w-24 h-24 text-gray-500 mx-auto mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">No links added yet</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        {canEdit 
          ? "Share important resources, documentation, and tools by adding links to your project."
          : "No links have been shared in this project yet."
        }
      </p>
      {canEdit && (
        <button
          onClick={onAddLink}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Your First Link</span>
        </button>
      )}
    </div>
  );
};

export default LinksEmptyState;
