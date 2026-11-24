'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  AlertCircle,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppLayout } from '@/components/AppLayout';
import { generateQuiz } from '@/services/api';
import { saveQuizResult } from '@/services/dataService';
import { useAuth } from '@/context/AuthContext';
import { QuizQuestion } from '@/types';

export default function QuizPage() {
  const { currentUser } = useAuth();
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) {
      setError('Please provide subject and topic name.');
      return;
    }

    setError('');
    setLoading(true);
    setQuestions([]);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);

    try {
      const generated = await generateQuiz({
        subject: subject.trim(),
        topic: topic.trim(),
        numberOfQuestions: Number(numberOfQuestions),
        difficulty
      });

      if (!generated || generated.length === 0) {
        throw new Error('Failed to generate questions. Please try again.');
      }

      setQuestions(generated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error generating quiz with Gemini.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = async () => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        score += 1;
      }
    });

    setFinalScore(score);
    setIsSubmitted(true);

    const percentage = Math.round((score / questions.length) * 100);

    if (percentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    if (currentUser) {
      try {
        await saveQuizResult({
          userId: currentUser.uid,
          subject: subject.trim(),
          topic: topic.trim(),
          difficulty,
          score,
          totalQuestions: questions.length,
          percentage,
          completedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Could not persist quiz result:', err);
      }
    }
  };

  const handleResetQuiz = () => {
    setQuestions([]);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setError('');
  };

  const currQ = questions[currentQuestionIndex];
  const allAnswered = questions.length > 0 && Object.keys(selectedAnswers).length === questions.length;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2338]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Quiz Generator</h1>
              <p className="text-xs text-slate-400">Dynamic MCQs with deep rationales and real performance telemetry</p>
            </div>
          </div>

          {questions.length > 0 && (
            <button
              onClick={handleResetQuiz}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14182B] hover:bg-[#1A2038] border border-[#232946] text-xs text-slate-300 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Generate New Quiz</span>
            </button>
          )}
        </div>

        {questions.length === 0 ? (
          <div className="bg-[#131728] border border-[#232946] rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                Configure Quiz Evaluation
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Gemini will generate fresh exam-level multiple-choice questions testing your genuine grasp of concepts.
              </p>
            </div>

            <form onSubmit={handleStartQuiz} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Computer Networks, DSA, Operating Systems"
                    className="w-full bg-[#0B0D17] border border-[#232946] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Topic Name
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. TCP vs UDP, Semaphore, Binary Trees"
                    className="w-full bg-[#0B0D17] border border-[#232946] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Number of Questions
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 5, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNumberOfQuestions(num)}
                        className={`py-2 text-xs rounded-lg font-medium border transition-all ${
                          numberOfQuestions === num
                            ? 'bg-pink-600/20 border-pink-500 text-pink-300 shadow-sm'
                            : 'bg-[#0B0D17] border-[#232946] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {num} Questions
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setDifficulty(lvl)}
                        className={`py-2 text-xs rounded-lg font-medium border transition-all ${
                          difficulty === lvl
                            ? 'bg-pink-600/20 border-pink-500 text-pink-300 shadow-sm'
                            : 'bg-[#0B0D17] border-[#232946] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !subject.trim() || !topic.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-sm shadow-lg shadow-pink-600/25 disabled:opacity-50 flex items-center justify-center gap-2 transition-all mt-3"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Multiple Choice Questions with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Quiz</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#131728] border border-[#232946] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {subject} • {topic}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">
                  {difficulty}
                </span>
              </div>

              <div className="text-xs text-slate-300 font-medium">
                Question <span className="text-pink-400 font-bold">{currentQuestionIndex + 1}</span> of {questions.length}
              </div>
            </div>

            {isSubmitted && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#161A33] via-[#1B1838] to-[#12162B] border border-pink-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Quiz Evaluation Completed</h3>
                <p className="text-3xl font-black text-pink-400">
                  {finalScore} / {questions.length}{' '}
                  <span className="text-base font-semibold text-slate-300">
                    ({Math.round((finalScore / questions.length) * 100)}%)
                  </span>
                </p>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  {finalScore / questions.length >= 0.7
                    ? 'Excellent grasp of the fundamentals! Your performance score has been saved to your analytics.'
                    : 'Good attempt. Review the rationale below for any incorrect questions to reinforce your understanding.'}
                </p>
              </div>
            )}

            {currQ && (
              <div className="bg-[#101426] border border-[#232946] rounded-2xl p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                    Question #{currentQuestionIndex + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {currQ.question}
                  </h3>
                </div>

                <div className="space-y-3">
                  {currQ.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currQ.id] === optIdx;
                    const isCorrect = currQ.correctAnswerIndex === optIdx;

                    let optionStyle = 'bg-[#131728] border-[#232946] text-slate-200 hover:border-slate-500';

                    if (isSubmitted) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                      } else {
                        optionStyle = 'bg-[#131728]/50 border-[#232946] text-slate-500 opacity-60';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-pink-600/20 border-pink-500 text-pink-200 shadow-md';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(currQ.id, optIdx)}
                        className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center text-xs text-slate-400 font-mono shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isSubmitted && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                        {isSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isSubmitted && (
                  <div className="p-4 rounded-xl bg-[#14182B] border border-[#232946] text-xs space-y-1.5 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-pink-400 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Explanation & Correct Rationale:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{currQ.explanation}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-[#1E2338]">
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    className="px-4 py-2 rounded-lg bg-[#14182B] hover:bg-[#1C223B] border border-[#232946] text-xs text-slate-300 font-medium disabled:opacity-30 transition-all flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-xs font-semibold text-white transition-all flex items-center gap-1.5 shadow-md shadow-pink-600/20"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : !isSubmitted ? (
                    <button
                      type="button"
                      disabled={!allAnswered}
                      onClick={handleSubmitQuiz}
                      className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Submit & Calculate Score</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResetQuiz}
                      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Take Another Quiz</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
