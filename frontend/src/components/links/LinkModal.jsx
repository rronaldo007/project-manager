import React from 'react';

const LinkModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  editingLink, 
  error 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">
              {editingLink ? 'Edit Link' : 'Add New Link'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-gray-700/70 transition-all"
                placeholder="Enter link title..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-gray-700/70 transition-all"
                placeholder="https://example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-gray-700/70 transition-all resize-none"
                placeholder="Brief description of this link..."
              />
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-600/50 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:border-gray-500 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {editingLink ? 'Update Link' : 'Add Link'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LinkModal;
