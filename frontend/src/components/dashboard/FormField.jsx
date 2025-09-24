import React from 'react';

const FormField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  error, 
  isEditing, 
  displayValue,
  onChange, 
  placeholder,
  icon 
}) => {
  return (
    <div className="group">
      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
        {icon}
        {label}
      </label>
      {isEditing ? (
        <div>
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-3 bg-gray-900/50 backdrop-blur-sm border-2 rounded-xl text-white focus:outline-none transition-all duration-200 ${
              error 
                ? 'border-red-500/50 focus:border-red-500' 
                : 'border-gray-700 focus:border-blue-500 focus:bg-gray-900/70'
            }`}
            placeholder={placeholder}
          />
          {error && (
            <p className="mt-2 text-sm text-red-400 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="px-4 py-3 bg-gray-900/30 border border-gray-700 rounded-xl text-white">
          {displayValue}
        </div>
      )}
    </div>
  );
};

export default FormField;
