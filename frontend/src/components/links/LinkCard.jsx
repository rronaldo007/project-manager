import React from 'react';

const LinkCard = ({ link, canEdit, onEdit, onDelete }) => {
  const getDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).origin;
      return `${domain}/favicon.ico`;
    } catch {
      return null;
    }
  };

  return (
    <div className="group relative bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6 hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      {/* Link Content */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          {/* Favicon */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-gray-600/30">
              <img 
                src={getFaviconUrl(link.url)}
                alt=""
                className="w-6 h-6 rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <svg 
                className="w-6 h-6 text-blue-400 hidden"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold text-lg mb-1 truncate" title={link.title}>
              {link.title}
            </h3>
            <p className="text-blue-300 text-sm mb-2 truncate" title={link.url}>
              {getDomainFromUrl(link.url)}
            </p>
            {link.description && (
              <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                {link.description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <a  
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
            title="Open link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          {canEdit && (
            <>
              <button
                onClick={() => onEdit(link)}
                className="p-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors"
                title="Edit link"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(link.id)}
                className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                title="Delete link"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-3 border-t border-gray-600/30">
        <span>Added {new Date(link.created_at).toLocaleDateString()}</span>
        {link.created_by && (
          <span>by {link.created_by.first_name || link.created_by.email}</span>
        )}
      </div>
    </div>
  );
};

export default LinkCard;
