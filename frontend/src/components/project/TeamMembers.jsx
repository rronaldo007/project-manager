import React from 'react';

const TeamMembers = ({ project, isOwner, onManageTeam }) => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Team Members</h2>
        {isOwner && (
          <button
            onClick={onManageTeam}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Member</span>
          </button>
        )}
      </div>

      {/* Owner */}
      <div className="mb-4">
        <h3 className="text-gray-400 text-sm font-medium mb-3">Project Owner</h3>
        <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
            {project?.owner?.first_name?.charAt(0) || project?.owner?.email?.charAt(0)}
          </div>
          <div>
            <p className="text-white font-medium">
              {project?.owner?.first_name} {project?.owner?.last_name}
            </p>
            <p className="text-gray-400 text-sm">{project?.owner?.email}</p>
          </div>
        </div>
      </div>

      {/* Members */}
      {project?.memberships?.length > 0 ? (
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-3">Team Members</h3>
          <div className="space-y-2">
            {project.memberships.map((membership) => (
              <div key={membership.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {membership.user.first_name?.charAt(0) || membership.user.email.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {membership.user.first_name} {membership.user.last_name}
                    </p>
                    <p className="text-gray-400 text-sm">{membership.user.email}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                  {membership.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-gray-400 font-medium mb-2">No team members yet</h3>
          <p className="text-gray-500 text-sm">
            {isOwner ? 'Add team members to start collaborating' : 'The project owner hasn\'t added any team members yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
