'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, 
  Send, 
  Sparkles, 
  RotateCcw, 
  BookOpen, 
  Layers, 
  Sliders, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { askTutor } from '@/services/api';
import { ChatMessage } from '@/types';

export default function TutorPage() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [style, setStyle] = useState<'Simple' | 'Detailed' | 'Step-by-Step'>('Simple');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleStartTopic = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setError('Please provide an academic topic or question.');
      return;
    }

    setError('');
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: `Teach me about: "${topic.trim()}" (Level: ${difficulty}, Style: ${style})`,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([userMsg]);
    setLoading(true);

    try {
      const response = await askTutor({
        topic: topic.trim(),
        difficulty,
        explanationStyle: style
      });

      const aiMsg: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: response,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error reaching AI Tutor.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const followUp = inputMessage.trim();
    setInputMessage('');
    setError('');

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: followUp,
      timestamp: new Date().toLocaleTimeString()
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      const geminiHistory = newHistory.map(m => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: m.text }]
      }));

      const response = await askTutor({
        topic: topic || 'Academic Topic',
        difficulty,
        explanationStyle: style,
        followUpQuestion: followUp,
        history: geminiHistory.slice(0, -1)
      });

      const aiMsg: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: response,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error reaching AI Tutor.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError('');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { label: "B-Trees vs B+ Trees", topic: "B-Trees and B+ Trees in Database Indexing", diff: "Intermediate", style: "Detailed" },
    { label: "Dijkstra's Algorithm", topic: "Dijkstra's Shortest Path Algorithm with step-by-step example", diff: "Beginner", style: "Step-by-Step" },
    { label: "Deadlocks in OS", topic: "Deadlock Detection and Prevention in Operating Systems", diff: "Intermediate", style: "Simple" },
    { label: "CAP Theorem", topic: "CAP Theorem in Distributed Systems", diff: "Advanced", style: "Detailed" }
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2338]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Tutor Engine</h1>
              <p className="text-xs text-slate-400">Interactive, patient instruction tailored to your syllabus pace</p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14182B] hover:bg-[#1A2038] border border-[#232946] text-xs text-slate-300 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Lesson</span>
            </button>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-[#131728] border border-[#232946] space-y-4">
          <form onSubmit={handleStartTopic} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Academic Topic or Concept
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Virtual Memory, Normalization in DBMS, Red-Black Trees..."
                  className="flex-1 bg-[#0B0D17] border border-[#232946] rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || !topic.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/25 disabled:opacity-50 flex items-center gap-2 transition-all shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Begin Lesson</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <span className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  Difficulty Level
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-1.5 text-xs rounded-lg font-medium border transition-all ${
                        difficulty === lvl
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-sm'
                          : 'bg-[#0B0D17] border-[#232946] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  Explanation Style
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Simple', 'Detailed', 'Step-by-Step'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStyle(st)}
                      className={`py-1.5 text-xs rounded-lg font-medium border transition-all ${
                        style === st
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                          : 'bg-[#0B0D17] border-[#232946] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </form>

          {messages.length === 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">Popular Engineering Topics:</span>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setTopic(q.topic);
                      setDifficulty(q.diff as any);
                      setStyle(q.style as any);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#0E1122] hover:bg-purple-950/30 border border-[#232946] hover:border-purple-500/30 text-xs text-slate-300 transition-colors"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-[#101426] border border-[#232946] rounded-2xl min-h-[420px] flex flex-col overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">Your AI Tutor is Ready</h3>
              <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed">
                Enter any concept above or choose a suggested topic. The AI tutor breaks down complex engineering formulas and algorithms into crystal-clear steps.
              </p>
            </div>
          ) : (
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {messages.map((m) => {
                const isAi = m.sender === 'ai';
                return (
                  <div
                    key={m.id}
                    className={`flex gap-3.5 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        isAi
                          ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                          : 'bg-[#1E2338] text-slate-300 border border-[#2C3352]'
                      }`}
                    >
                      {isAi ? <Sparkles className="w-4 h-4" /> : 'You'}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                        isAi
                          ? 'bg-[#14182B] border border-[#232946] text-slate-200'
                          : 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-1.5 text-[11px] opacity-75">
                        <span className="font-semibold">{isAi ? 'AI Tutor' : 'You'}</span>
                        <div className="flex items-center gap-2">
                          <span>{m.timestamp}</span>
                          {isAi && (
                            <button
                              onClick={() => copyToClipboard(m.text, m.id)}
                              className="p-1 hover:text-white transition-colors"
                              title="Copy explanation"
                            >
                              {copiedId === m.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                        {m.text}
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#14182B] border border-[#232946] text-xs text-purple-300 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                    <span>Gemini Tutor is generating explanation with real-world examples...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {messages.length > 0 && (
            <div className="p-4 bg-[#0E1122] border-t border-[#1E2338]">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a follow-up: 'Explain with a C++ snippet', 'Give a real-world example', 'Summarize'..."
                  className="flex-1 bg-[#131728] border border-[#232946] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-md shadow-purple-600/20 disabled:opacity-50 flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
