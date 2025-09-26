import React, { useState } from 'react';

const AddMemberModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    user_email: '',
    role: 'viewer'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    
    try {
      await onSubmit(formData);
      setFormData({ user_email: '', role: 'viewer' });
    } catch (error) {
      setFormError(error.message || 'Failed to add member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ user_email: '', role: 'viewer' });
    setFormError('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Add Member</h2>
          <button 
            onClick={handleClose} 
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.user_email}
              onChange={(e) => setFormData({...formData, user_email: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="Enter user's email address"
              disabled={isSubmitting}
              required
            />
            <p className="text-gray-400 text-xs mt-1">
              The user must already have an account in the system
            </p>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              disabled={isSubmitting}
            >
              <option value="viewer">Viewer</option>
              <option value="contributor">Contributor</option>
              <option value="editor">Editor</option>
            </select>
            
            <div className="mt-2 space-y-1 text-xs text-gray-400">
              <p><strong className="text-gray-300">Viewer:</strong> Can view the idea and its content</p>
              <p><strong className="text-gray-300">Contributor:</strong> Can view and add notes/resources</p>
              <p><strong className="text-gray-300">Editor:</strong> Can view, edit, and manage members</p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Member'
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
