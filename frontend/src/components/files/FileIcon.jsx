import React from 'react';

const FileIcon = ({ fileType, fileName, size = 'md' }) => {
  const extension = fileName?.split('.').pop()?.toLowerCase();
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  if (fileType?.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center`}>
        <svg className={`${iconSizeClasses[size]} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }
  
  if (fileType?.includes('pdf') || extension === 'pdf') {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center`}>
        <svg className={`${iconSizeClasses[size]} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }
  
  if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center`}>
        <svg className={`${iconSizeClasses[size]} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    );
  }
  
  if (['xlsx', 'xls', 'csv'].includes(extension)) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center`}>
        <svg className={`${iconSizeClasses[size]} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center`}>
      <svg className={`${iconSizeClasses[size]} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
  );
};

export default FileIcon;
