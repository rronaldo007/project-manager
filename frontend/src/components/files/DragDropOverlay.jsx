import React from 'react';

const DragDropOverlay = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-blue-600/20 backdrop-blur-sm border-4 border-dashed border-blue-400 rounded-2xl flex items-center justify-center z-50">
      <div className="text-center">
        <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <h3 className="text-2xl font-bold text-blue-400 mb-2">Drop your file here</h3>
        <p className="text-blue-300">Release to upload</p>
      </div>
    </div>
  );
};

export default DragDropOverlay;
