import React from 'react';
import ProgressBar from '../ui/ProgressBar';
import UserAvatar from '../ui/UserAvatar';

const ProjectOverview = ({ project }) => (
  <div className="space-y-8">
    {/* Description Section */}
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Project Description
      </h3>
      <div className="text-gray-300 bg-gray-700/30 p-6 rounded-lg border border-gray-600/30 leading-relaxed">
        {project.description || 'No description provided for this project.'}
      </div>
    </div>

    {/* Progress Section */}
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Project Progress
      </h3>
      <ProgressBar percentage={project.progress_percentage} showStats={true} />
    </div>

    {/* Project Details Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Team Section */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Project Team
        </h3>
        <div className="space-y-4">
          <UserAvatar user={project.owner} showRole={true} role="owner" />
          {project.members && project.members.length > 0 && (
            <div className="border-t border-gray-700/50 pt-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Team Members</h4>
              <div className="space-y-3">
                {project.members.map(member => (
                  <UserAvatar key={member.id} user={member} showRole={true} role="member" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline & Info Section */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Timeline & Details
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
              <div className="text-sm text-gray-400 mb-1">Start Date</div>
              <div className="text-white font-semibold">
                {new Date(project.start_date).toLocaleDateString()}
              </div>
            </div>
            
            {project.end_date && (
              <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                <div className="text-sm text-gray-400 mb-1">End Date</div>
                <div className={`font-semibold ${project.is_overdue ? 'text-red-400' : 'text-white'}`}>
                  {new Date(project.end_date).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          {project.days_remaining !== null && (
            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
              <div className="text-sm text-gray-400 mb-1">Time Remaining</div>
              <div className={`text-lg font-bold ${project.days_remaining < 0 ? 'text-red-400' : 'text-green-400'}`}>
                {project.days_remaining < 0 
                  ? `${Math.abs(project.days_remaining)} days overdue` 
                  : `${project.days_remaining} days left`
                }
              </div>
            </div>
          )}

          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
            <div className="text-sm text-gray-400 mb-1">Created</div>
            <div className="text-white font-semibold">
              {new Date(project.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProjectOverview;
