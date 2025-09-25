import React from 'react';

const UploadButton = ({ uploading, onFileSelect, disabled = false }) => {
  return (
    <div className="relative">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files[0])}
        disabled={uploading || disabled}
        multiple={false}
      />
      <label
        htmlFor="file-upload"
        className={`flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
          (uploading || disabled) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {uploading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Upload File</span>
          </>
        )}
      </label>
    </div>
  );
};

export default UploadButton;
