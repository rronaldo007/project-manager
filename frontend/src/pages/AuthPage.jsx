import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import AuthHeader from '../components/auth/AuthHeader';
import AuthToggle from '../components/auth/AuthToggle';
import ErrorBanner from '../components/auth/ErrorBanner';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login, register, loading } = useAuth();

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

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      } else if (formData.firstName.trim().length < 2) {
        newErrors.firstName = 'First name must be at least 2 characters';
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      } else if (formData.lastName.trim().length < 2) {
        newErrors.lastName = 'Last name must be at least 2 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setErrors({});
    
    try {
      let result;
      
      if (isLogin) {
        result = await login({
          email: formData.email.trim(),
          password: formData.password
        });
      } else {
        result = await register({
          email: formData.email.trim(),
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          password: formData.password,
          confirm_password: formData.confirmPassword
        });
      }

      if (result.success) {
        window.location.href = '/dashboard';
      } else {
        const newErrors = {};
        const apiErrors = result.errors;
        
        if (apiErrors.email) {
          newErrors.email = Array.isArray(apiErrors.email) ? apiErrors.email[0] : apiErrors.email;
        }
        if (apiErrors.password) {
          newErrors.password = Array.isArray(apiErrors.password) ? apiErrors.password[0] : apiErrors.password;
        }
        if (apiErrors.first_name) {
          newErrors.firstName = Array.isArray(apiErrors.first_name) ? apiErrors.first_name[0] : apiErrors.first_name;
        }
        if (apiErrors.last_name) {
          newErrors.lastName = Array.isArray(apiErrors.last_name) ? apiErrors.last_name[0] : apiErrors.last_name;
        }
        if (apiErrors.confirm_password) {
          newErrors.confirmPassword = Array.isArray(apiErrors.confirm_password) ? apiErrors.confirm_password[0] : apiErrors.confirm_password;
        }
        if (apiErrors.non_field_errors) {
          newErrors.general = Array.isArray(apiErrors.non_field_errors) ? apiErrors.non_field_errors[0] : apiErrors.non_field_errors;
        }
        if (apiErrors.detail) {
          newErrors.general = apiErrors.detail;
        }
        if (apiErrors.general) {
          newErrors.general = apiErrors.general;
        }
        
        if (Object.keys(newErrors).length === 0) {
          newErrors.general = 'An error occurred. Please try again.';
        }
        
        setErrors(newErrors);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ 
        general: 'Unable to connect to the server. Please check your connection and try again.' 
      });
    }
  };

  const handleToggleMode = (loginMode) => {
    setIsLogin(loginMode);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const toggleMode = () => {
    handleToggleMode(!isLogin);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          {/* Header */}
          <AuthHeader isLogin={isLogin} />

          {/* Form Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 shadow-2xl">
            {/* Toggle Buttons */}
            <AuthToggle isLogin={isLogin} onToggle={handleToggleMode} />

            {/* Error Banner */}
            <ErrorBanner error={errors.general} />

            {/* Forms */}
            {isLogin ? (
              <LoginForm
                formData={formData}
                errors={errors}
                showPassword={showPassword}
                onInputChange={handleInputChange}
                onTogglePassword={togglePasswordVisibility}
                loading={loading}
                onSubmit={handleSubmit}
              />
            ) : (
              <RegisterForm
                formData={formData}
                errors={errors}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                onInputChange={handleInputChange}
                onTogglePassword={togglePasswordVisibility}
                onToggleConfirmPassword={toggleConfirmPasswordVisibility}
                loading={loading}
                onSubmit={handleSubmit}
              />
            )}
          </div>

          {/* Alternative Login Options */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {isLogin ? 'Sign up for free' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
