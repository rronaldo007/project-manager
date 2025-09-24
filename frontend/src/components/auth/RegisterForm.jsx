import React from 'react';
import FormInput from './FormInput';

const RegisterForm = ({ 
  formData, 
  errors, 
  showPassword,
  showConfirmPassword,
  onInputChange, 
  onTogglePassword,
  onToggleConfirmPassword,
  loading,
  onSubmit 
}) => {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={onInputChange}
          placeholder="John"
          error={errors.firstName}
          autoComplete="given-name"
        />
        
        <FormInput
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={onInputChange}
          placeholder="Doe"
          error={errors.lastName}
          autoComplete="family-name"
        />
      </div>

      <FormInput
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={onInputChange}
        placeholder="john@example.com"
        error={errors.email}
        autoComplete="email"
      />

      <FormInput
        label="Password"
        name="password"
        value={formData.password}
        onChange={onInputChange}
        placeholder="••••••••"
        error={errors.password}
        autoComplete="new-password"
        helpText="Must be at least 8 characters with uppercase, lowercase, and number"
        showPasswordToggle={true}
        showPassword={showPassword}
        onTogglePassword={onTogglePassword}
      />

      <FormInput
        label="Confirm Password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={onInputChange}
        placeholder="••••••••"
        error={errors.confirmPassword}
        autoComplete="new-password"
        showPasswordToggle={true}
        showPassword={showConfirmPassword}
        onTogglePassword={onToggleConfirmPassword}
      />

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating account...
          </>
        ) : (
          <>
            Create Account
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>

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
    </div>
  );
};

export default RegisterForm;
