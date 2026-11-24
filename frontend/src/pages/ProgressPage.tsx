import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Award, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Flame, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { getUserQuizzes, getUserNotes, getUserAggregatedStats, getUserLatestStudyPlan } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { QuizResult, NoteItem, StudyPlan, UserStats } from '../types';

export const ProgressPage: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizResult[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalQuizzes: 0,
    averageScore: 0,
    notesGenerated: 0,
    studyHours: 0,
    recentActivities: []
  });
  const [latestPlan, setLatestPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      try {
        const [q, n, s, p] = await Promise.all([
          getUserQuizzes(currentUser.uid),
          getUserNotes(currentUser.uid),
          getUserAggregatedStats(currentUser.uid),
          getUserLatestStudyPlan(currentUser.uid)
        ]);
        setQuizzes(q);
        setNotes(n);
        setStats(s);
        setLatestPlan(p);
      } catch (err) {
        console.error('Error fetching progress telemetry:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  // Subject breakdown computed from actual quizzes and notes
  const subjectBreakdown = () => {
    const map: Record<string, { quizzes: number; totalScore: number; notes: number }> = {};
    quizzes.forEach(q => {
      if (!map[q.subject]) map[q.subject] = { quizzes: 0, totalScore: 0, notes: 0 };
      map[q.subject].quizzes++;
      map[q.subject].totalScore += q.percentage;
    });
    notes.forEach(n => {
      if (!map[n.subject]) map[n.subject] = { quizzes: 0, totalScore: 0, notes: 0 };
      map[n.subject].notes++;
    });
    return Object.entries(map).map(([name, data]) => ({
      name,
      quizCount: data.quizzes,
      avgScore: data.quizzes > 0 ? Math.round(data.totalScore / data.quizzes) : null,
      notesCount: data.notes
    }));
  };

  const subjects = subjectBreakdown();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2338]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <LineChart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Learning Telemetry & Progress</h1>
            <p className="text-xs text-slate-400">Authentic performance analytics computed from your quizzes, notes, and study tasks</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#14182B] border border-[#232946] text-xs text-violet-300 font-medium">
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          <span>Active Streak: {stats.totalQuizzes > 0 ? 'Consistent' : 'Starting Out'}</span>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#131728] border border-[#232946]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Cumulative Score</span>
            <Award className="w-4 h-4 text-pink-400" />
          </div>
          <h3 className="text-3xl font-black text-white mt-3">
            {stats.totalQuizzes > 0 ? `${stats.averageScore}%` : 'N/A'}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Across {stats.totalQuizzes} evaluated tests
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#131728] border border-[#232946]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Revision Notes</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-3xl font-black text-white mt-3">{stats.notesGenerated}</h3>
          <p className="text-[11px] text-slate-500 mt-1">Generated syllabus notebooks</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#131728] border border-[#232946]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Time Invested</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-3xl font-black text-white mt-3">{stats.studyHours}h</h3>
          <p className="text-[11px] text-slate-500 mt-1">Actual active learning duration</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#131728] border border-[#232946]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Daily Goal</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-3xl font-black text-white mt-3">
            {userProfile?.studyGoalHoursPerDay || 4}h/day
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Target daily commitment</p>
        </div>
      </div>

      {/* Subject-Wise Mastery Radar */}
      <div className="p-6 rounded-2xl bg-[#131728] border border-[#232946] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Subject Mastery & Activity Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Performance calculated directly from your submitted quiz records</p>
          </div>
          <span className="text-xs text-purple-400 font-medium">{subjects.length} Subjects Tracked</span>
        </div>

        {subjects.length > 0 ? (
          <div className="space-y-4 pt-2">
            {subjects.map((sub, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#0E1122] border border-[#1E2338] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{sub.name}</span>
                  <div className="flex items-center gap-4 text-slate-400">
                    <span>{sub.notesCount} Notes</span>
                    <span>{sub.quizCount} Quizzes</span>
                    {sub.avgScore !== null && (
                      <span className="font-semibold text-emerald-400">{sub.avgScore}% Average</span>
                    )}
                  </div>
                </div>

                {/* Accuracy progress bar */}
                <div className="w-full bg-[#181D33] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${sub.avgScore !== null ? Math.max(sub.avgScore, 10) : 30}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <Layers className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-xs text-slate-400">No subject activity recorded yet.</p>
            <p className="text-[11px] text-slate-500 mt-1">Take your first quiz or create notes to view subject insights.</p>
          </div>
        )}
      </div>

      {/* Quiz History Table */}
      <div className="p-6 rounded-2xl bg-[#131728] border border-[#232946] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Historical Quiz Submissions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Chronological record of generated test performance</p>
          </div>
          <span className="text-xs text-slate-400">{quizzes.length} Total Submissions</span>
        </div>

        {quizzes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E2338] text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Subject & Topic</th>
                  <th className="pb-3 font-semibold">Difficulty</th>
                  <th className="pb-3 font-semibold">Raw Score</th>
                  <th className="pb-3 font-semibold">Percentage</th>
                  <th className="pb-3 font-semibold text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2338]">
                {quizzes.map((q) => (
                  <tr key={q.id} className="hover:bg-[#161B30] transition-colors">
                    <td className="py-3 text-slate-200">
                      <div className="font-semibold text-white">{q.subject}</div>
                      <div className="text-[11px] text-slate-400">{q.topic}</div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20 text-[10px]">
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300">
                      {q.score} / {q.totalQuestions}
                    </td>
                    <td className="py-3">
                      <span
                        className={`font-bold ${
                          q.percentage >= 70
                            ? 'text-emerald-400'
                            : q.percentage >= 40
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {q.percentage}%
                      </span>
                    </td>
                    <td className="py-3 text-right text-slate-500">
                      {new Date(q.completedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-slate-500 text-xs">
            No quiz records found. Take a quiz in the AI Quiz Generator to see real statistics here.
          </div>
        )}
      </div>
    </div>
  );
};
