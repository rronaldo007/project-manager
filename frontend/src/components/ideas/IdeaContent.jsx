import React from 'react';
import ProjectsSection from './ProjectsSection';
import NotesSection from './NotesSection';
import MembersSection from './MembersSection';

const IdeaContent = ({ 
  idea, 
  onUnlinkProject, 
  onShowCreateProject, 
  onShowLinkProject, 
  onShowAddNote,
  onShowAddMember,
  userPermissions
}) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Description */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
        <p className="text-gray-300">{idea.description}</p>
      </div>

      {/* Problem Statement */}
      {idea.problem_statement && (
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Problem Statement</h2>
          <p className="text-gray-300">{idea.problem_statement}</p>
        </div>
      )}

      {/* Solution Overview */}
      {idea.solution_overview && (
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Solution Overview</h2>
          <p className="text-gray-300">{idea.solution_overview}</p>
        </div>
      )}

      {/* Projects Section */}
      <ProjectsSection
        idea={idea}
        onUnlinkProject={onUnlinkProject}
        onShowCreateProject={onShowCreateProject}
        onShowLinkProject={onShowLinkProject}
        userPermissions={userPermissions}
      />

      {/* Members Section */}
      <MembersSection
        idea={idea}
        onShowAddMember={onShowAddMember}
        canManageMembers={userPermissions?.can_manage_members}
      />

      {/* Notes Section */}
      <NotesSection
        idea={idea}
        onShowAddNote={onShowAddNote}
        canAddNotes={userPermissions?.can_contribute}
      />
    </div>
  );
};

export default IdeaContent;
