import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Sparkles, Bell, Search, ShieldCheck } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { currentUser, loading, isFirebaseActive } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D17] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center animate-pulse mb-4">
          <Sparkles className="w-6 h-6 text-purple-400 animate-spin" />
        </div>
        <p className="text-slate-400 text-sm font-medium">Loading AI Study Buddy workspace...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-[#0B0D17] text-slate-100 flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen bg-[#0B0D17]">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#1E2338] bg-[#0E1122]/70 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-purple-400 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20">
              Live Workspace
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Powered by Google Gemini 2.5 Flash
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {isFirebaseActive ? 'Firestore Online' : 'Local Storage Mode'}
            </div>
            <div className="h-4 w-[1px] bg-[#1E2338]" />
            <button 
              onClick={() => window.open('https://ai.google.dev/', '_blank')}
              className="text-xs text-slate-400 hover:text-purple-300 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              API Docs
            </button>
          </div>
        </header>

        {/* Dynamic Nested View */}
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
