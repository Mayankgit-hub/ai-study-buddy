import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  HelpCircle, 
  MessageSquare, 
  CalendarClock, 
  LineChart, 
  CheckCircle2, 
  ArrowRight, 
  BrainCircuit, 
  ShieldCheck, 
  Zap, 
  Users, 
  Code2,
  Terminal,
  Cpu
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      title: "Interactive AI Tutor",
      desc: "Deep conceptual clarity tailored to your syllabus. Choose your level from Beginner to Advanced with step-by-step guidance.",
      icon: GraduationCap,
      color: "from-purple-500/20 to-indigo-500/20",
      border: "hover:border-purple-500/50"
    },
    {
      title: "AI Notes Generator",
      desc: "Instantly convert complicated topics into revision-ready summaries, exam key-points, and important viva questions.",
      icon: BookOpen,
      color: "from-blue-500/20 to-cyan-500/20",
      border: "hover:border-blue-500/50"
    },
    {
      title: "Dynamic AI Quiz Maker",
      desc: "No static canned questions. Generates on-the-fly MCQs with live scoring, detailed rationales, and performance breakdown.",
      icon: HelpCircle,
      color: "from-pink-500/20 to-rose-500/20",
      border: "hover:border-pink-500/50"
    },
    {
      title: "Instant Doubt Solver",
      desc: "Ask any academic doubt, programming puzzle, or formula deduction. Get fast, patient explanations with code snippets.",
      icon: MessageSquare,
      color: "from-amber-500/20 to-orange-500/20",
      border: "hover:border-amber-500/50"
    },
    {
      title: "Smart Study Planner",
      desc: "AI-calculated timetable factoring in your target exam date, daily hours, and subject difficulty with interactive task tracking.",
      icon: CalendarClock,
      color: "from-emerald-500/20 to-teal-500/20",
      border: "hover:border-emerald-500/50"
    },
    {
      title: "Progress Analytics",
      desc: "Real learning telemetry tracking your quizzes, notes created, topic mastery, and actual study milestones.",
      icon: LineChart,
      color: "from-violet-500/20 to-purple-500/20",
      border: "hover:border-violet-500/50"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0D17] text-slate-100 selection:bg-purple-500/30">
      {/* Top Navbar */}
      <header className="border-b border-[#1E2338]/80 bg-[#0B0D17]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">AI Study Buddy</span>
              <span className="hidden sm:inline-block ml-2 text-xs text-purple-400 font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                Engineering Edition
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-purple-400 transition-colors">How It Works</a>
            <a href="#architecture" className="hover:text-purple-400 transition-colors">Architecture</a>
            <a href="#team" className="hover:text-purple-400 transition-colors">Project Team</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 transition-all hover:scale-105 active:scale-95"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181D33] border border-purple-500/30 text-xs font-medium text-purple-300 mb-8">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>Built for Computer Science & Engineering Students</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Your Personal <br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              AI Learning Companion
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Learn Smarter. Practice Better. Achieve More.
            Master technical subjects, solve complex engineering doubts, generate syllabus notes, and ace your exams with Gemini 2.5.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white font-semibold text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#14182B] hover:bg-[#1C223B] text-slate-200 border border-[#262C49] font-medium text-base transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Product Preview Card */}
          <div className="mt-16 rounded-2xl bg-[#101426] border border-[#232946] p-2 shadow-2xl shadow-purple-950/40 relative">
            <div className="rounded-xl bg-[#0B0D17] border border-[#1C2238] overflow-hidden">
              <div className="bg-[#14182B] px-4 py-3 border-b border-[#1E2338] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs text-slate-400 font-mono">ai-study-buddy.app/dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Gemini 2.5 Flash Connected</span>
                </div>
              </div>
              <div className="p-6 text-left grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#131728] border border-[#232946]">
                  <p className="text-xs text-slate-400">Current Course Focus</p>
                  <p className="text-base font-bold text-white mt-1">Data Structures & Algorithms</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-purple-400">
                    <span>Target: Semester 3</span>
                    <span>88% Accuracy</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#131728] border border-[#232946]">
                  <p className="text-xs text-slate-400">Active Study Streak</p>
                  <p className="text-base font-bold text-emerald-400 mt-1">12 Days Active</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>14 Quizzes Solved</span>
                    <span>9 Notes Stored</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#131728] border border-[#232946]">
                  <p className="text-xs text-slate-400">AI Assistant</p>
                  <p className="text-base font-bold text-blue-400 mt-1">Instant Doubt Solver</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Ready 24/7</span>
                    <span className="text-emerald-400">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-[#1E2338] bg-[#0E1122]/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 tracking-tight">
              Six Specialized AI Engines in One Platform
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              Everything an engineering undergraduate needs to understand concepts, prepare revision notes, and test preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl bg-[#131728] border border-[#232946] ${item.border} transition-all duration-300 hover:-translate-y-1 group`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center border border-white/5 mb-5`}>
                    <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 border-t border-[#1E2338]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight">How It Works</h2>
            <p className="text-slate-400 mt-2 text-sm">Three easy steps from syllabus confusion to academic mastery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#131728] border border-[#232946] relative">
              <span className="text-3xl font-black text-purple-500/30 absolute right-6 top-6">01</span>
              <h4 className="text-base font-bold text-white mb-2">Input Your Topic & Level</h4>
              <p className="text-sm text-slate-400">
                Specify your engineering subject (Operating Systems, DBMS, DSA) and pick your comfort level from Beginner to Advanced.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#131728] border border-[#232946] relative">
              <span className="text-3xl font-black text-indigo-500/30 absolute right-6 top-6">02</span>
              <h4 className="text-base font-bold text-white mb-2">Gemini Analyzes & Synthesizes</h4>
              <p className="text-sm text-slate-400">
                Backend securely calls the official Google Gemini SDK, generating structured markdown, adaptive MCQs, or customized timetables.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[#131728] border border-[#232946] relative">
              <span className="text-3xl font-black text-blue-500/30 absolute right-6 top-6">03</span>
              <h4 className="text-base font-bold text-white mb-2">Retain & Track Analytics</h4>
              <p className="text-sm text-slate-400">
                Download structured notes, retake dynamic tests to gauge retention, and view your real historical score improvements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* College Project Architecture Section for Viva */}
      <section id="architecture" className="py-20 border-t border-[#1E2338] bg-[#0E1122]/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              Viva & Examination Ready
            </span>
            <h2 className="text-3xl font-bold text-white mt-3">Full-Stack Technical Architecture</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-5 rounded-xl bg-[#131728] border border-[#232946]">
              <div className="flex items-center gap-2 text-purple-400 font-bold mb-3">
                <Code2 className="w-5 h-5" />
                <span>Frontend Layer</span>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li>• React.js 18 with Vite</li>
                <li>• TypeScript for strict typing</li>
                <li>• Tailwind CSS for custom design system</li>
                <li>• Lucide React modern iconography</li>
                <li>• Responsive SPA routing with React Router</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-[#131728] border border-[#232946]">
              <div className="flex items-center gap-2 text-blue-400 font-bold mb-3">
                <Terminal className="w-5 h-5" />
                <span>Backend & AI Layer</span>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li>• Node.js & Express.js REST API</li>
                <li>• Official @google/genai SDK</li>
                <li>• Gemini 2.5 Flash reasoning model</li>
                <li>• Secure server-side API Key isolation</li>
                <li>• Robust JSON schema enforcement</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-[#131728] border border-[#232946]">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-3">
                <ShieldCheck className="w-5 h-5" />
                <span>Database & Auth Layer</span>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li>• Firebase Authentication</li>
                <li>• Cloud Firestore document storage</li>
                <li>• Granular per-user private data rules</li>
                <li>• Zero-friction fallback demo persistence</li>
                <li>• Vercel production deployment setup</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Viva Credit */}
      <section id="team" className="py-16 border-t border-[#1E2338]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 text-slate-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Academic Project</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Developed by 2nd Year Engineering Students</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">
            Designed as a major second-year mini-project demonstrating modern full-stack web engineering, generative artificial intelligence integration, and cloud database architecture.
          </p>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#14182B] border border-[#232946] text-xs text-slate-300 font-mono">
            <span>Branch: Computer Science & Engineering</span>
            <span className="text-purple-400">•</span>
            <span>Batch: 2024–2028</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E2338] py-8 bg-[#090B14]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 AI Study Buddy. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with ❤️ using <span className="text-purple-400 font-medium">Google Gemini</span> & <span className="text-blue-400 font-medium">React</span>
          </p>
        </div>
      </footer>
    </div>
  );
};
