import React, { useState, useEffect } from 'react';
import { 
  CalendarClock, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Trash2, 
  AlertCircle,
  Calendar,
  Layers,
  Check
} from 'lucide-react';
import { generateStudyPlan } from '../services/api';
import { saveStudyPlan, getUserLatestStudyPlan, updatePlanTaskStatus } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { StudyPlan, StudyScheduleDay } from '../types';

export const PlannerPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [subjectsInput, setSubjectsInput] = useState('Data Structures & Algorithms, Operating Systems, DBMS');
  const [examDate, setExamDate] = useState('2026-12-15');
  const [dailyHours, setDailyHours] = useState(4);
  const [preferredTime, setPreferredTime] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Evening');

  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  useEffect(() => {
    async function fetchPlan() {
      if (!currentUser) return;
      const plan = await getUserLatestStudyPlan(currentUser.uid);
      if (plan) {
        setCurrentPlan(plan);
      }
    }
    fetchPlan();
  }, [currentUser]);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const subjectsArray = subjectsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (subjectsArray.length === 0) {
      setError('Please list at least one subject to study.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const scheduleDays = await generateStudyPlan({
        subjects: subjectsArray,
        examDate,
        dailyHours: Number(dailyHours),
        preferredTime
      });

      const newPlan: Omit<StudyPlan, 'id'> = {
        userId: currentUser ? currentUser.uid : 'demo-student-2026',
        subjects: subjectsArray,
        examDate,
        dailyHours: Number(dailyHours),
        preferredTime,
        generatedSchedule: scheduleDays,
        createdAt: new Date().toISOString()
      };

      const planId = await saveStudyPlan(newPlan);
      setCurrentPlan({ ...newPlan, id: planId });
      setActiveDayIdx(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error generating schedule with Gemini.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (dayIdx: number, taskId: string, currentStatus: boolean) => {
    if (!currentPlan) return;
    const updatedSchedule = [...currentPlan.generatedSchedule];
    const targetTask = updatedSchedule[dayIdx].tasks.find(t => t.id === taskId);
    if (targetTask) {
      targetTask.isCompleted = !currentStatus;
      const updatedPlan = { ...currentPlan, generatedSchedule: updatedSchedule };
      setCurrentPlan(updatedPlan);

      if (currentPlan.id) {
        await updatePlanTaskStatus(currentPlan.id, dayIdx, taskId, !currentStatus);
      }
    }
  };

  const calculateCompletion = () => {
    if (!currentPlan || currentPlan.generatedSchedule.length === 0) return 0;
    let total = 0;
    let completed = 0;
    currentPlan.generatedSchedule.forEach(d => {
      d.tasks.forEach(t => {
        total++;
        if (t.isCompleted) completed++;
      });
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2338]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Smart Study Planner</h1>
            <p className="text-xs text-slate-400">Personalized exam countdown schedule, session breaks, and task checkpoints</p>
          </div>
        </div>

        {currentPlan && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Overall Target Completion</span>
              <span className="text-sm font-bold text-emerald-400">{calculateCompletion()}% Done</span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-300">
              {calculateCompletion()}%
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Planner inputs */}
        <div className="lg:col-span-4 bg-[#131728] border border-[#232946] rounded-2xl p-6 h-fit space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Timetable Parameters
          </h2>

          <form onSubmit={handleGeneratePlan} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Subjects (Comma-separated)
              </label>
              <textarea
                rows={2}
                value={subjectsInput}
                onChange={(e) => setSubjectsInput(e.target.value)}
                placeholder="Data Structures, Computer Networks, Theory of Computation"
                className="w-full bg-[#0B0D17] border border-[#232946] rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Examination / Target Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-[#0B0D17] border border-[#232946] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Available Study Hours Per Day ({dailyHours} hrs)
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 hr/day</span>
                <span>4 hrs/day</span>
                <span>8 hrs/day</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Preferred Study Slot
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Morning', 'Afternoon', 'Evening', 'Night'] as const).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setPreferredTime(slot)}
                    className={`py-1.5 text-xs rounded-lg font-medium border transition-all ${
                      preferredTime === slot
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-[#0B0D17] border-[#232946] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-semibold text-xs shadow-lg shadow-emerald-600/25 disabled:opacity-50 flex items-center justify-center gap-2 transition-all mt-2"
            >
              {loading ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Timetable with Gemini...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Generate AI Timetable</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Schedule Display */}
        <div className="lg:col-span-8 space-y-4">
          {currentPlan && currentPlan.generatedSchedule.length > 0 ? (
            <>
              {/* Day selector tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {currentPlan.generatedSchedule.map((day, idx) => {
                  const completedInDay = day.tasks.filter(t => t.isCompleted).length;
                  const isDayDone = day.tasks.length > 0 && completedInDay === day.tasks.length;

                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveDayIdx(idx)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                        activeDayIdx === idx
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm'
                          : 'bg-[#131728] border-[#232946] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{day.dayName}</span>
                      {isDayDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] text-slate-500">
                          {completedInDay}/{day.tasks.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Day's Task List */}
              {currentPlan.generatedSchedule[activeDayIdx] && (
                <div className="bg-[#101426] border border-[#232946] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1E2338]">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {currentPlan.generatedSchedule[activeDayIdx].dayName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Target Date: {currentPlan.generatedSchedule[activeDayIdx].dateStr || 'Study Plan Milestone'}
                      </p>
                    </div>

                    <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      {currentPlan.dailyHours} Study Hours Scheduled
                    </span>
                  </div>

                  <div className="space-y-3">
                    {currentPlan.generatedSchedule[activeDayIdx].tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(activeDayIdx, task.id, task.isCompleted)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 select-none ${
                          task.isCompleted
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-400'
                            : 'bg-[#131728] border-[#232946] hover:border-emerald-500/30 text-slate-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                              task.isCompleted
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-slate-500 bg-[#0B0D17]'
                            }`}
                          >
                            {task.isCompleted && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                                {task.subject}
                              </span>
                              <span className="text-slate-600">•</span>
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {task.timeSlot} ({task.durationMinutes} min)
                              </span>
                            </div>
                            <h4
                              className={`text-sm font-bold mt-1 ${
                                task.isCompleted ? 'line-through text-slate-500' : 'text-white'
                              }`}
                            >
                              {task.topic}
                            </h4>
                            {task.notes && (
                              <p className="text-xs text-slate-400 mt-1">{task.notes}</p>
                            )}
                          </div>
                        </div>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium shrink-0 ${
                            task.isCompleted
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {task.isCompleted ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-[#101426] border border-[#232946] rounded-2xl p-12 text-center">
              <CalendarClock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Timetable Generated Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Enter your upcoming exam date and subject list on the left to let Gemini calculate an optimized daily learning itinerary.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
