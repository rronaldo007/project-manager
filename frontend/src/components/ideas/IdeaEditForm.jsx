import React, { useState } from 'react';

const IdeaEditForm = ({ idea, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: idea.title,
    description: idea.description,
    problem_statement: idea.problem_statement || '',
    solution_overview: idea.solution_overview || '',
    target_audience: idea.target_audience || '',
    market_potential: idea.market_potential || '',
    revenue_model: idea.revenue_model || '',
    competition_analysis: idea.competition_analysis || '',
    technical_requirements: idea.technical_requirements || '',
    estimated_effort: idea.estimated_effort || '',
    priority: idea.priority,
    status: idea.status,
    tags: idea.tags || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Edit Idea</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="Comma-separated tags"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-24"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Problem Statement</label>
            <textarea
              value={formData.problem_statement}
              onChange={(e) => setFormData({...formData, problem_statement: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-20"
              placeholder="What problem does this idea solve?"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Solution Overview</label>
            <textarea
              value={formData.solution_overview}
              onChange={(e) => setFormData({...formData, solution_overview: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white h-20"
              placeholder="High-level overview of the solution"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="draft">Draft</option>
              <option value="concept">Concept</option>
              <option value="in_development">In Development</option>
              <option value="implemented">Implemented</option>
              <option value="on_hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default IdeaEditForm;
