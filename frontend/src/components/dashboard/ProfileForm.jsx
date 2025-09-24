import React from 'react';
import FormField from './FormField';

const ProfileForm = ({ 
  formData, 
  errors, 
  isEditing, 
  loading, 
  user,
  onInputChange, 
  onSave, 
  onCancel 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="First Name"
          name="first_name"
          value={formData.first_name}
          error={errors.first_name}
          isEditing={isEditing}
          displayValue={user?.first_name}
          onChange={onInputChange}
          placeholder="Enter first name"
          icon={
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />

        <FormField
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          error={errors.last_name}
          isEditing={isEditing}
          displayValue={user?.last_name}
          onChange={onInputChange}
          placeholder="Enter last name"
          icon={
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />

        <div className="md:col-span-2">
          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            error={errors.email}
            isEditing={isEditing}
            displayValue={user?.email}
            onChange={onInputChange}
            placeholder="Enter email address"
            icon={
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700/50">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2.5 border-2 border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cancel</span>
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg transform hover:scale-105"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
