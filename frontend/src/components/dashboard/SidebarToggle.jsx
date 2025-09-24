import React from 'react';

const SidebarToggle = ({ isOpen, onToggle }) => {
  return (
    <div className="absolute bottom-6 left-5">
      <button
        onClick={onToggle}
        className="text-gray-400 hover:text-white p-2.5 rounded-xl hover:bg-gray-800/50 transition-all duration-200 group"
      >
        <svg className="w-5 h-5 transform transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d={isOpen ? "M11 19l-7-7 7-7M8 12h13" : "m13 5 7 7-7 7M6 12h13"} />
        </svg>
      </button>
    </div>
  );
};

export default SidebarToggle;
