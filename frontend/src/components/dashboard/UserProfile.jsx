import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ProfileHeader from './ProfileHeader';
import ProfileInfoCard from './ProfileInfoCard';
import ProfileForm from './ProfileForm';

const UserProfile = () => {
  const { user, getUserInitials, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:8000/api/auth/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          email: formData.email.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        updateUser(data);
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
      } else {
        const newErrors = {};
        
        if (data.first_name) {
          newErrors.first_name = Array.isArray(data.first_name) ? data.first_name[0] : data.first_name;
        }
        if (data.last_name) {
          newErrors.last_name = Array.isArray(data.last_name) ? data.last_name[0] : data.last_name;
        }
        if (data.email) {
          newErrors.email = Array.isArray(data.email) ? data.email[0] : data.email;
        }
        
        if (Object.keys(newErrors).length === 0) {
          newErrors.general = 'Failed to update profile. Please try again.';
        }
        
        setErrors(newErrors);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setErrors({ 
        general: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-green-300 font-medium">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Profile Container */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl"></div>
        
        <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden">
          <ProfileHeader 
            isEditing={isEditing}
            onEditClick={() => setIsEditing(true)}
          />
          
          <div className="p-8 space-y-8">
            {/* Error Alert */}
            {errors.general && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm animate-in fade-in duration-300">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-red-300 font-medium">{errors.general}</p>
                  </div>
                  <button 
                    onClick={() => setErrors(prev => ({ ...prev, general: '' }))}
                    className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <ProfileInfoCard 
              user={user}
              getUserInitials={getUserInitials}
            />

            {/* Activity Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Last Login</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-white font-semibold">2 hours ago</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Account Type</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-white font-semibold">Premium</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Storage Used</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <p className="text-white font-semibold">2.4 GB / 10 GB</p>
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
            </div>

            <ProfileForm
              formData={formData}
              errors={errors}
              isEditing={isEditing}
              loading={loading}
              user={user}
              onInputChange={handleInputChange}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;