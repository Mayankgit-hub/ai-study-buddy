import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Bot, 
  User, 
  Code2, 
  Lightbulb, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { solveDoubt } from '../services/api';
import { ChatMessage } from '../types';

export const DoubtSolverPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || loading) return;

    setInputMessage('');
    setError('');

    const userMsg: ChatMessage = {
      id: 'doubt_' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
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

      const aiResponse = await solveDoubt({
        message: textToSend.trim(),
        history: geminiHistory.slice(0, -1)
      });

      const aiMsg: ChatMessage = {
        id: 'doubt_ai_' + Date.now(),
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error retrieving answer from Doubt Solver.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sampleDoubts = [
    "Why does QuickSort have O(n^2) worst-case time complexity, and how does randomized pivot fix it?",
    "Write a C++ example implementing Dijkstra's Algorithm using priority_queue.",
    "Explain ACID properties in database transactions with a banking debit/credit example.",
    "What is the difference between Mutex and Binary Semaphore in Operating Systems?"
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1E2338] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Doubt Solver</h1>
            <p className="text-xs text-slate-400">Ask coding queries, mathematical proofs, or theoretical syllabus questions</p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14182B] hover:bg-[#1A2038] border border-[#232946] text-xs text-slate-300 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Clear Chat</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 shrink-0">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Chat Conversation Box */}
      <div className="bg-[#101426] border border-[#232946] rounded-2xl flex-1 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center overflow-y-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <Lightbulb className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">Need Help With Any Academic Doubt?</h3>
            <p className="text-xs text-slate-400 max-w-md mt-1 mb-6 leading-relaxed">
              Ask about algorithms, system design, debugging code snippets, or clarifying lecture notes. The AI responds dynamically using Gemini 2.5.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl w-full text-left">
              {sampleDoubts.map((doubt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(undefined, doubt)}
                  className="p-3 rounded-xl bg-[#14182B] hover:bg-[#1C223B] border border-[#232946] text-xs text-slate-300 transition-all flex items-start gap-2 text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{doubt}</span>
                </button>
              ))}
            </div>
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
                        ? 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30'
                        : 'bg-[#1E2338] text-slate-300 border border-[#2C3352]'
                    }`}
                  >
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                      isAi
                        ? 'bg-[#14182B] border border-[#232946] text-slate-200'
                        : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1 text-[11px] opacity-75">
                      <span className="font-semibold">{isAi ? 'Gemini Doubt Solver' : 'You'}</span>
                      <div className="flex items-center gap-2">
                        <span>{m.timestamp}</span>
                        {isAi && (
                          <button
                            onClick={() => copyToClipboard(m.text, m.id)}
                            className="p-1 hover:text-white transition-colors"
                            title="Copy answer"
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
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-[#14182B] border border-[#232946] text-xs text-amber-300 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Thinking through your question and formulating clear answer...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input area */}
        <div className="p-4 bg-[#0E1122] border-t border-[#1E2338] shrink-0">
          <form onSubmit={(e) => handleSend(e)} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your academic doubt or code problem here..."
              className="flex-1 bg-[#131728] border border-[#232946] rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-white font-medium text-xs shadow-md shadow-amber-500/25 disabled:opacity-50 flex items-center gap-1.5 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
