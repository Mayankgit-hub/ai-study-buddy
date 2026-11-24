import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  HelpCircle, 
  MessageSquare, 
  CalendarClock, 
  LineChart, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Award, 
  FileText, 
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserAggregatedStats, getUserLatestStudyPlan } from '../services/dataService';
import { UserStats, StudyPlan } from '../types';

export const DashboardPage: React.FC = () => {
  const { userProfile, currentUser } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalQuizzes: 0,
    averageScore: 0,
    notesGenerated: 0,
    studyHours: 0,
    recentActivities: []
  });
  const [activePlan, setActivePlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      try {
        const aggregated = await getUserAggregatedStats(currentUser.uid);
        const plan = await getUserLatestStudyPlan(currentUser.uid);
        setStats(aggregated);
        setActivePlan(plan);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  const toolCards = [
    {
      title: 'AI Tutor',
      desc: 'Interactive concept tutor with custom explanation depths',
      icon: GraduationCap,
      path: '/tutor',
      color: 'from-purple-500/10 to-indigo-500/10',
      iconColor: 'text-purple-400'
    },
    {
      title: 'AI Notes Generator',
      desc: 'Structured summaries, revision notes, and viva Q&A',
      icon: BookOpen,
      path: '/notes',
      color: 'from-blue-500/10 to-cyan-500/10',
      iconColor: 'text-blue-400'
    },
    {
      title: 'AI Quiz Generator',
      desc: 'Dynamic MCQ test simulation with real-time scoring',
      icon: HelpCircle,
      path: '/quiz',
      color: 'from-pink-500/10 to-rose-500/10',
      iconColor: 'text-pink-400'
    },
    {
      title: 'Doubt Solver',
      desc: 'Instant academic chat for coding, theory & math problems',
      icon: MessageSquare,
      path: '/doubt-solver',
      color: 'from-amber-500/10 to-orange-500/10',
      iconColor: 'text-amber-400'
    },
    {
      title: 'Smart Study Planner',
      desc: 'Automated study timetable leading up to your exam dates',
      icon: CalendarClock,
      path: '/planner',
      color: 'from-emerald-500/10 to-teal-500/10',
      iconColor: 'text-emerald-400'
    },
    {
      title: 'Progress Analytics',
      desc: 'Deep analytics, accuracy radar, and study hour telemetry',
      icon: LineChart,
      path: '/progress',
      color: 'from-violet-500/10 to-purple-500/10',
      iconColor: 'text-violet-400'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#171A30] via-[#1A1838] to-[#141B32] border border-[#262C4A] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[90px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Learning Terminal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {userProfile?.displayName || 'Student'}! 👋
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-xl">
              Targeting: <span className="text-purple-300 font-semibold">{userProfile?.targetExam || 'Engineering Finals'}</span> •{' '}
              {userProfile?.college || 'Computer Science Engineering'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/tutor"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <span>Ask AI Tutor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Real Statistics Metric Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#131728] border border-[#232946]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Quizzes Solved</span>
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">{stats.totalQuizzes}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Real evaluated quizzes</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#131728] border border-[#232946]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Average Score</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">
              {stats.totalQuizzes > 0 ? `${stats.averageScore}%` : 'N/A'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Based on quiz submissions</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#131728] border border-[#232946]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Notes Generated</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">{stats.notesGenerated}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Stored revision notes</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#131728] border border-[#232946]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Study Hours</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">{stats.studyHours}h</h3>
            <p className="text-[11px] text-slate-400 mt-1">Calculated learning duration</p>
          </div>
        </div>
      </div>

      {/* Quick Access Tools */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Six AI Learning Engines</h2>
          <span className="text-xs text-slate-400">Click any engine to launch</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {toolCards.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className="p-5 rounded-xl bg-[#131728] border border-[#232946] hover:border-purple-500/40 hover:bg-[#161B30] transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${tool.color} border border-white/5`}>
                    <Icon className={`w-5 h-5 ${tool.iconColor}`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-white mt-4 group-hover:text-purple-300 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {tool.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Active Study Plan & Recent Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Study Plan widget */}
        <div className="p-6 rounded-2xl bg-[#131728] border border-[#232946]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Upcoming Study Schedule</h3>
            </div>
            <Link to="/planner" className="text-xs text-purple-400 hover:underline">
              {activePlan ? 'Open Full Timetable' : 'Create Timetable'}
            </Link>
          </div>

          {activePlan && activePlan.generatedSchedule.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Subjects: <span className="text-slate-200">{activePlan.subjects.join(', ')}</span> • Exam Date:{' '}
                <span className="text-purple-300">{activePlan.examDate}</span>
              </p>
              <div className="space-y-2 mt-3">
                {activePlan.generatedSchedule[0].tasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg bg-[#0E1122] border border-[#1E2338] flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{task.subject}: {task.topic}</p>
                      <span className="text-[10px] text-slate-400">{task.timeSlot} • {task.durationMinutes} mins</span>
                    </div>
                    {task.isCompleted ? (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        Upcoming
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarClock className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No active study plan generated yet.</p>
              <Link
                to="/planner"
                className="inline-block mt-3 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium hover:bg-emerald-500/20"
              >
                Generate Study Schedule
              </Link>
            </div>
          )}
        </div>

        {/* Real Activity Stream */}
        <div className="p-6 rounded-2xl bg-[#131728] border border-[#232946]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Recent Learning Activities</h3>
            </div>
            <span className="text-xs text-slate-400">{stats.recentActivities.length} Records</span>
          </div>

          {stats.recentActivities.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-lg bg-[#0E1122] border border-[#1E2338] flex items-start gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 leading-snug">{act.title}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(act.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No learning history recorded yet.</p>
              <p className="text-[11px] text-slate-400 mt-1">Try answering a quiz or asking the AI Tutor!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
