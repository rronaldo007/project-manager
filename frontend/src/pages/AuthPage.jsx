import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';

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
        // Success - redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        // Handle API errors
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

  const toggleMode = () => {
    setIsLogin(!isLogin);
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
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7L12 2z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-gray-400">
              {isLogin 
                ? 'Sign in to access your project management dashboard' 
                : 'Join us and start managing your projects efficiently'
              }
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 shadow-2xl">
            {/* Toggle Buttons */}
            <div className="flex bg-gray-700/50 rounded-lg p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  isLogin 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  !isLogin 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Banner */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-700/50 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* Name Fields (Registration Only) */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all ${
                        errors.firstName 
                          ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400' 
                          : 'border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      }`}
                      placeholder="John"
                      autoComplete="given-name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all ${
                        errors.lastName 
                          ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400' 
                          : 'border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      }`}
                      placeholder="Doe"
                      autoComplete="family-name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400' 
                      : 'border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`}
                  placeholder="john@example.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-12 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all ${
                      errors.password 
                        ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400' 
                        : 'border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    }`}
                    placeholder="••••••••"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
                {!isLogin && (
                  <p className="mt-1 text-xs text-gray-400">
                    Must be at least 8 characters with uppercase, lowercase, and number
                  </p>
                )}
              </div>

              {/* Confirm Password Field (Registration Only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pr-12 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all ${
                        errors.confirmPassword 
                          ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400' 
                          : 'border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      }`}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>

              {/* Terms and Privacy (Registration Only) */}
              {!isLogin && (
                <p className="text-xs text-gray-400 text-center">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                    Privacy Policy
                  </a>
                </p>
              )}

              {/* Forgot Password (Login Only) */}
              {isLogin && (
                <div className="text-center">
                  <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot your password?
                  </button>
                </div>
              )}
            </div>
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