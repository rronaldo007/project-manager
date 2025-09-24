import React from 'react';

const ProfileHeader = ({ isEditing, onEditClick }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Profile Settings</h2>
          <p className="text-blue-100 opacity-90">Manage your account information</p>
        </div>
        {!isEditing && (
          <button
            onClick={onEditClick}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-2.5 rounded-xl transition-all duration-200 border border-white/30 flex items-center space-x-2 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Profile</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
