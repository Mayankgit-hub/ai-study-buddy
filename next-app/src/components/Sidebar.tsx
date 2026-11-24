'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  HelpCircle, 
  MessageSquare, 
  CalendarClock, 
  LineChart, 
  Settings, 
  LogOut, 
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Sidebar: React.FC = () => {
  const { userProfile, logout, isFirebaseActive } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Tutor', path: '/tutor', icon: GraduationCap, badge: 'Popular' },
    { name: 'AI Notes Generator', path: '/notes', icon: BookOpen },
    { name: 'AI Quiz Generator', path: '/quiz', icon: HelpCircle },
    { name: 'Doubt Solver', path: '/doubt-solver', icon: MessageSquare },
    { name: 'Study Planner', path: '/planner', icon: CalendarClock },
    { name: 'Progress Analytics', path: '/progress', icon: LineChart },
  ];

  return (
    <aside className="w-64 bg-[#0E1122] border-r border-[#1E2338] flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1E2338]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-600/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
              AI Study Buddy
            </h1>
            <span className="text-[11px] text-purple-400 font-medium">Smart Learning Hub</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Learning Tools
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#15192E]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-medium border border-purple-500/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Account
        </div>
        <Link
          href="/profile"
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            pathname === '/profile'
              ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#15192E]'
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Profile & Settings</span>
        </Link>
      </div>

      {/* Live System Mode Pill */}
      <div className="mx-3 mb-3 p-2.5 rounded-lg bg-[#14182B] border border-[#232946] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-300 font-medium">Gemini AI Active</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {isFirebaseActive ? 'Cloud Sync' : 'Demo Mode'}
        </span>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-[#1E2338] bg-[#0B0D17]/50">
        <div className="flex items-center justify-between">
          <Link href="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
              {userProfile?.displayName ? userProfile.displayName.charAt(0) : 'S'}
            </div>
            <div className="min-w-0 truncate">
              <p className="text-xs font-medium text-slate-200 truncate">
                {userProfile?.displayName || 'Student Buddy'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {userProfile?.college || 'Engineering Student'}
              </p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
