'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Copy, 
  Download, 
  Check, 
  FileText, 
  FolderDown, 
  AlertCircle,
  History
} from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { generateNotes } from '@/services/api';
import { saveNote, getUserNotes } from '@/services/dataService';
import { useAuth } from '@/context/AuthContext';
import { NoteItem } from '@/types';

export default function NotesPage() {
  const { currentUser } = useAuth();
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [format, setFormat] = useState<
    'Short notes' | 'Detailed notes' | 'Exam preparation notes' | 'Important questions and answers'
  >('Detailed notes');

  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedNotes, setSavedNotes] = useState<NoteItem[]>([]);
  const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate');

  useEffect(() => {
    async function loadSaved() {
      if (!currentUser) return;
      const notes = await getUserNotes(currentUser.uid);
      setSavedNotes(notes);
    }
    loadSaved();
  }, [currentUser]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) {
      setError('Please provide both subject and topic name.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const notesMarkdown = await generateNotes({
        subject: subject.trim(),
        topic: topic.trim(),
        explanationLevel: level,
        format
      });

      setGeneratedContent(notesMarkdown);

      if (currentUser) {
        const newNote: Omit<NoteItem, 'id'> = {
          userId: currentUser.uid,
          subject: subject.trim(),
          topic: topic.trim(),
          level,
          format,
          content: notesMarkdown,
          createdAt: new Date().toISOString()
        };
        await saveNote(newNote);
        const refreshed = await getUserNotes(currentUser.uid);
        setSavedNotes(refreshed);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate study notes.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${subject.replace(/\s+/g, '_')}_${topic.replace(/\s+/g, '_')}_Notes.md`;
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formats = [
    'Short notes',
    'Detailed notes',
    'Exam preparation notes',
    'Important questions and answers'
  ] as const;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2338]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Notes Generator</h1>
              <p className="text-xs text-slate-400">Structured headings, definitions, bullet points, and exam Q&A</p>
            </div>
          </div>

          <div className="flex rounded-lg bg-[#14182B] p-1 border border-[#232946]">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'generate'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create New Notes
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Saved Notebook ({savedNotes.length})</span>
            </button>
          </div>
        </div>

        {activeTab === 'generate' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-[#131728] border border-[#232946] rounded-2xl p-6 h-fit space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Notes Specification
              </h2>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Operating Systems, DBMS, Machine Learning"
                    className="w-full bg-[#0B0D17] border border-[#232946] rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Topic Name
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Process Scheduling & CPU Algorithms"
                    className="w-full bg-[#0B0D17] border border-[#232946] rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Explanation Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLevel(l)}
                        className={`py-1.5 text-xs rounded-lg font-medium border transition-all ${
                          level === l
                            ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                            : 'bg-[#0B0D17] border-[#232946] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Notes Format
                  </label>
                  <div className="space-y-1.5">
                    {formats.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFormat(f)}
                        className={`w-full py-2 px-3 text-xs rounded-lg font-medium text-left border flex items-center justify-between transition-all ${
                          format === f
                            ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                            : 'bg-[#0B0D17] border-[#232946] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span>{f}</span>
                        {format === f && <Check className="w-3.5 h-3.5 text-blue-400" />}
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
                  disabled={loading || !subject.trim() || !topic.trim()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/25 disabled:opacity-50 flex items-center justify-center gap-2 transition-all mt-2"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5" />
                      <span>Generate Revision Notes</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-[#101426] border border-[#232946] rounded-2xl min-h-[500px] flex flex-col overflow-hidden">
              <div className="bg-[#14182B] px-5 py-3 border-b border-[#1E2338] flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  Notes Preview Document
                </span>

                {generatedContent && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0B0D17] hover:bg-[#1A2038] border border-[#232946] text-xs text-slate-300 font-medium transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs text-blue-300 font-medium transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download (.md)</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 animate-pulse">
                      <Sparkles className="w-6 h-6 animate-spin" />
                    </div>
                    <h4 className="text-sm font-semibold text-white">Analyzing Syllabus Concepts</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Structuring definitions, core principles, comparisons, and bullet points...
                    </p>
                  </div>
                ) : generatedContent ? (
                  <div className="prose prose-invert prose-sm max-w-none text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                    {generatedContent}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-center text-slate-500">
                    <FolderDown className="w-12 h-12 text-slate-700 mb-2" />
                    <p className="text-sm font-medium text-slate-400">No notes generated yet</p>
                    <p className="text-xs text-slate-500 max-w-xs mt-1">
                      Fill the parameters on the left and click Generate Revision Notes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {savedNotes.length === 0 ? (
              <div className="text-center py-16 bg-[#131728] border border-[#232946] rounded-2xl">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-300">You haven&apos;t generated or saved any notes yet.</p>
                <button
                  onClick={() => setActiveTab('generate')}
                  className="mt-3 px-4 py-2 rounded-lg bg-blue-600 text-xs font-semibold text-white"
                >
                  Create First Note
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-5 rounded-xl bg-[#131728] border border-[#232946] hover:border-blue-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-blue-400 mb-2">
                        <span className="font-semibold uppercase tracking-wider">{note.subject}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300">
                          {note.format}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">{note.topic}</h3>
                      <p className="text-xs text-slate-400 line-clamp-3 mb-4">{note.content}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#1E2338] text-xs">
                      <span className="text-[11px] text-slate-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => {
                          setSubject(note.subject);
                          setTopic(note.topic);
                          setGeneratedContent(note.content);
                          setActiveTab('generate');
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                      >
                        View Full Notes →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
