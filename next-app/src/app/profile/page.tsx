'use client';

import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Save, 
  Check, 
  Building2, 
  GraduationCap, 
  Target, 
  Clock, 
  ShieldCheck
} from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { userProfile, updateUserProfileData, isFirebaseActive } = useAuth();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [college, setCollege] = useState(userProfile?.college || 'JECRC Foundation');
  const [branch, setBranch] = useState(userProfile?.branch || 'Computer Science & Engineering');
  const [year, setYear] = useState(userProfile?.year || '2nd Year');
  const [targetExam, setTargetExam] = useState(userProfile?.targetExam || 'Semester 3 Finals & Placements');
  const [studyGoal, setStudyGoal] = useState(userProfile?.studyGoalHoursPerDay || 4);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateUserProfileData({
        displayName,
        college,
        branch,
        year,
        targetExam,
        studyGoalHoursPerDay: Number(studyGoal)
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2338]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Student Profile & Settings</h1>
              <p className="text-xs text-slate-400">Configure your academic background, target exams, and study preferences</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isFirebaseActive ? 'Firestore Cloud Storage' : 'Browser Protected Storage'}</span>
          </div>
        </div>

        <div className="bg-[#131728] border border-[#232946] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0E1122] border border-[#1E2338]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center font-bold text-xl text-white uppercase shadow-lg shadow-purple-600/20">
              {displayName ? displayName.charAt(0) : 'S'}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{displayName || 'Student Buddy'}</h3>
              <p className="text-xs text-slate-400">{userProfile?.email || 'student@jecrc.edu.in'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-purple-300 font-medium">{branch}</span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-400">{year}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-[#0B0D17] border border-[#232946] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  College / University
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. JECRC University / RTU"
                    className="w-full bg-[#0B0D17] border border-[#232946] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Branch / Major
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-[#0B0D17] border border-[#232946] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Academic Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[#0B0D17] border border-[#232946] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="1st Year">1st Year (Freshman)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="4th Year">4th Year (Senior)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Exam / Academic Milestone
                </label>
                <div className="relative">
                  <Target className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    placeholder="e.g. 3rd Sem RTU Finals, GATE 2026, DSA Interviews"
                    className="w-full bg-[#0B0D17] border border-[#232946] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Daily Study Goal ({studyGoal} Hours / Day)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={studyGoal}
                    onChange={(e) => setStudyGoal(Number(e.target.value))}
                    className="w-full bg-[#0B0D17] border border-[#232946] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Settings saved successfully!
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">
                  All changes sync automatically across all features.
                </span>
              )}

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-600/20 disabled:opacity-50 flex items-center gap-2 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="p-6 rounded-2xl bg-[#0E1122] border border-[#1E2338] space-y-2 text-xs text-slate-400">
          <h4 className="text-sm font-bold text-white">College Project Credentials</h4>
          <p>
            Project Title: <span className="text-purple-300 font-medium">AI Study Buddy – Personal AI Learning Assistant</span>
          </p>
          <p>Institution: JECRC (Jaipur Engineering College and Research Centre)</p>
          <p>Department: Department of Computer Science & Engineering</p>
          <p>Platform Architecture: Next.js 16 (App Router Full-Stack) on Vercel</p>
          <p>Model Engine: Google Gemini Flash via Official Google Gen AI SDK</p>
        </div>
      </div>
    </AppLayout>
  );
}
