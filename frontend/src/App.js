import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { Sparkles, LogOut, Shield, User } from 'lucide-react';
import ResumeAnalyzer from './components/ResumeAnalyzer';

const GOOGLE_CLIENT_ID = "367017978012-9qic8casrqcupgjke21ohn3c09pqp64s.apps.googleusercontent.com";

// Helper component to handle avatar fallback securely
const UserAvatar = ({ user }) => {
  const [imageError, setImageError] = useState(false);

  // If user has a picture and it hasn't failed to load, show it
  if (user.picture && !imageError) {
    return (
      <img 
        src={user.picture} 
        alt="Profile" 
        className="w-8 h-8 rounded-full ring-2 ring-indigo-500 ring-offset-2 object-cover"
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop
          setImageError(true);
        }}
      />
    );
  }

  // Fallback default avatar
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center ring-2 ring-indigo-500 ring-offset-2">
      <User className="w-5 h-5 text-indigo-600" />
    </div>
  );
};

function App() {
  // Initialize state from localStorage to persist login across refreshes
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ats_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setUser(decoded); 
      // Save user session to localStorage
      localStorage.setItem('ats_user', JSON.stringify(decoded));
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    // Clear user session from localStorage
    localStorage.removeItem('ats_user');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {!user ? (
        // ==================== LOGIN PAGE ====================
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white px-4">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
          </div>

          {/* Login Content */}
          <div className="relative z-10 text-center mb-12 space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-2xl">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              ATS Resume Optimizer
            </h1>
            <p className="text-xl md:text-2xl text-indigo-200 font-light max-w-2xl mx-auto">
              AI-powered resume analysis to help you land your dream job
            </p>
          </div>

          {/* Login Card */}
          <div className="relative z-10 bg-white/95 backdrop-blur-xl p-12 rounded-3xl shadow-2xl text-center max-w-md w-full border border-white/20">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome Back</h2>
              <p className="text-slate-600 text-base">Sign in to analyze and optimize your resume with AI</p>
            </div>
            
            <div className="flex justify-center mb-6">
              <GoogleLogin 
                onSuccess={handleLoginSuccess} 
                onError={() => console.log('Login Failed')} 
                theme="filled_blue"
                shape="pill"
                size="large"
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mt-8">
              <Shield className="h-4 w-4" />
              <span>Secure authentication with Google</span>
            </div>
          </div>

          {/* Features Footer */}
          <div className="relative z-10 mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl text-center">
            <div className="space-y-2">
              <div className="text-3xl">🎯</div>
              <h3 className="font-semibold text-white">ATS Scoring</h3>
              <p className="text-sm text-indigo-200">Get instant match scores</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🔍</div>
              <h3 className="font-semibold text-white">Keyword Analysis</h3>
              <p className="text-sm text-indigo-200">Find missing skills</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">⚡</div>
              <h3 className="font-semibold text-white">Fast Results</h3>
              <p className="text-sm text-indigo-200">AI-powered insights</p>
            </div>
          </div>
        </div>
      ) : (
        // ==================== MAIN APP ====================
        <div className="relative min-h-screen">
          {/* Enhanced User Header - Aligned with Container */}
          <div className="absolute top-0 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-end items-center py-4 h-full">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-slate-200 transition-shadow">
                    <UserAvatar user={user} />
                    <div className="hidden sm:block text-left">
                      <p className="font-semibold text-slate-800 text-xs">{user.name}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 px-4 py-2 rounded-2xl text-sm font-semibold shadow-sm transition-all hover:shadow active:scale-95 flex items-center gap-2"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Resume Analyzer Component */}
          <ResumeAnalyzer user={user} /> 
        </div>
      )}
    </GoogleOAuthProvider>
  );
}

export default App;