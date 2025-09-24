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
        alert('Profile updated successfully!');
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
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden">
      <ProfileHeader 
        isEditing={isEditing}
        onEditClick={() => setIsEditing(true)}
      />
      
      <div className="p-8">
        {errors.general && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-300">{errors.general}</p>
            </div>
          </div>
        )}

        <ProfileInfoCard 
          user={user}
          getUserInitials={getUserInitials}
        />

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
  );
};

export default UserProfile;
