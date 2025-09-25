import React, { useState } from 'react';

const CreateProjectModal = ({ isOpen, onClose, onCreateProject }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    progress_percentage: 0
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      progress_percentage: 0
    });
    setFormErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setFormErrors({ title: 'Title is required' });
      return;
    }

    setSubmitLoading(true);
    setFormErrors({});

    const result = await onCreateProject(formData);

    if (result.success) {
      resetForm();
      onClose();
      alert('Project created successfully!');
    } else {
      setFormErrors(result.errors);
    }

    setSubmitLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-700/50">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Create New Project</h2>
              <p className="text-blue-100/80 text-sm">Fill in the details to start your new project</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {formErrors.general && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-300">{formErrors.general}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Project Title <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className={`w-full px-4 py-3 bg-gray-900/50 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-900/70 transition-all duration-200 ${
                  formErrors.title ? 'border-red-500/50 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
                }`}
                placeholder="Enter a memorable project name"
              />
              {formErrors.title && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {formErrors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-gray-900/70 transition-all duration-200 resize-none"
                placeholder="Describe your project goals and objectives..."
              />
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:bg-gray-900/70 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="planning">🎯 Planning</option>
                  <option value="in_progress">⚡ In Progress</option>
                  <option value="on_hold">⏸️ On Hold</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:bg-gray-900/70 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="urgent">🔴 Urgent</option>
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:bg-gray-900/70 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:bg-gray-900/70 transition-all duration-200"
                />
              </div>
            </div>

            {/* Progress */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center justify-between">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Initial Progress
                </span>
                <span className="text-blue-400 font-medium">{formData.progress_percentage}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress_percentage}
                onChange={(e) => setFormData({...formData, progress_percentage: parseInt(e.target.value) || 0})}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${formData.progress_percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700/50">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 text-gray-300 border-2 border-gray-600 rounded-xl hover:bg-gray-700/50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center transform hover:scale-105"
            >
              {submitLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Project
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;