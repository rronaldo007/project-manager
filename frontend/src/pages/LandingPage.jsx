import React from 'react';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Manage Your Projects
            <span className="text-blue-500 block">Effortlessly</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Track progress, manage tasks, create timelines, and generate documentation 
            all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a href="/auth" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors">
              Get Started
            </a>
            <button className="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg text-lg hover:bg-gray-800 transition-colors">
              Learn More
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Project Dashboard</h3>
              <p className="text-gray-400">Overview of all your projects with progress tracking.</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Timeline Management</h3>
              <p className="text-gray-400">Visual timelines with milestones and deadlines.</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Documents</h3>
              <p className="text-gray-400">Generate business plans and project specs automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
