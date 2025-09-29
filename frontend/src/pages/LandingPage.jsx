import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const LandingPage = ({ onLoginSuccess }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">📊</span>
            <span className="text-2xl font-bold text-white">Project Manager</span>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setAuthMode('login');
                setShowAuth(true);
              }}
              className="px-6 py-2 text-white hover:text-blue-300 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setShowAuth(true);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Manage Projects
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Like a Pro
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Complete project management with agile sprints, epics, releases, and kanban boards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => {
                setAuthMode('register');
                setShowAuth(true);
              }}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg 
                         hover:bg-blue-700 transform hover:scale-105 transition-all shadow-xl"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => {
                setAuthMode('login');
                setShowAuth(true);
              }}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold 
                         rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              Sign In
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">Agile Sprints</h3>
              <p className="text-gray-400">Plan and track sprints with burndown charts</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">Kanban Board</h3>
              <p className="text-gray-400">Drag and drop tasks across workflow columns</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-white mb-2">Ideas to Tasks</h3>
              <p className="text-gray-400">Transform ideas into actionable tasks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <div className="flex items-center justify-center space-x-2 mb-6">
              <span className="text-3xl">📊</span>
              <h2 className="text-2xl font-bold text-white">Project Manager</h2>
            </div>

            <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  authMode === 'login'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  authMode === 'register'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {authMode === 'login' ? (
              <LoginForm onSuccess={() => {
                setShowAuth(false);
                onLoginSuccess && onLoginSuccess();
              }} />
            ) : (
              <RegisterForm onSuccess={() => setAuthMode('login')} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
