# AI STUDY BUDDY – YOUR PERSONAL AI LEARNING ASSISTANT

> **Tagline:** *"Learn Smarter. Practice Better. Achieve More."*  
> **Academic Project:** 2nd Year Computer Science & Engineering Final Project  
> **Institution:** JECRC Foundation  

AI Study Buddy is an interactive, responsive, AI-powered web platform tailored for engineering college students. Powered by Google's latest **Gemini 2.5 Flash** model via the official `@google/genai` SDK and backed by **Firebase Authentication** and **Cloud Firestore**, the platform features 6 specialized AI tools designed to enhance exam preparation, conceptual understanding, and continuous self-assessment.

---

## 🌟 Key Features

1. **Interactive AI Tutor**
   - Concept breakdowns tailored to user difficulty (`Beginner`, `Intermediate`, `Advanced`).
   - Multiple pedagogical styles (`Simple`, `Detailed`, `Step-by-Step`).
   - Multi-turn follow-up questions with real-world analogies, code snippets, and viva questions.

2. **AI Notes Generator**
   - Generates structured, exam-ready markdown notes with definitions, core principles, comparisons, and viva Q&As.
   - Formats: *Short notes*, *Detailed notes*, *Exam preparation notes*, *Important questions and answers*.
   - One-click copy and `.md` file download.

3. **Dynamic AI Quiz Generator**
   - On-the-fly MCQ test generation with no static/canned questions.
   - Live question navigation, option selection, and instant score calculation.
   - Comprehensive rationale explanations for every question and celebratory particle confetti.

4. **Dedicated AI Doubt Solver**
   - 24/7 technical academic chat for code debugging, calculus proofs, and conceptual clarification.
   - Full conversational memory with easy chat reset.

5. **Smart Study Planner**
   - Generates an intelligent, 5-day structured timetable leading up to the student's exam date.
   - Interactive task checklists with real-time completion tracking.

6. **Progress Analytics & Telemetry**
   - Real, authentic statistics tracking total quizzes taken, average score percentages, notes generated, and calculated study hours.
   - Subject-wise accuracy progress indicators and chronological quiz submission records.

7. **Authentication & Persistence**
   - Firebase Authentication & Cloud Firestore rules for secure user isolation.
   - Seamless demo fallback persistence mode for zero-friction evaluation during viva presentations.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React icons, Canvas Confetti.
- **Backend:** Node.js, Express.js, TypeScript.
- **AI Engine:** Google Gemini 2.5 Flash via official `@google/genai` SDK.
- **Database & Auth:** Firebase Auth, Cloud Firestore (with local fallback).
- **Design System:** Deep dark SaaS aesthetic (`#0B0D17`), violet/blue gradients, glassmorphism cards.

---

## 📂 Project Architecture

```
ai study buddy/
├── backend/
│   ├── src/
│   │   ├── gemini.ts        # Official Google Gen AI client configuration
│   │   └── index.ts         # Express REST API endpoints (/api/tutor, /api/notes, /api/quiz, /api/chat, /api/planner)
│   ├── .env.example         # Backend environment variables template
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components (Sidebar, AppLayout, Navbar)
│   │   ├── context/         # AuthContext (Firebase + Demo mode fallback)
│   │   ├── lib/             # Firebase SDK client initialization
│   │   ├── pages/           # 10 Application pages (Landing, Login, Dashboard, Tutor, Notes, Quiz, Doubt, Planner, Progress, Profile)
│   │   ├── services/        # api.ts (Backend caller) & dataService.ts (Firestore/Storage)
│   │   ├── types/           # Strict TypeScript data models
│   │   ├── App.tsx          # Client routing
│   │   └── index.css        # Tailwind theme tokens & design system
│   ├── .env.example         # Frontend Firebase environment template
│   ├── package.json
│   └── vite.config.ts
├── firestore.rules          # Granular security rules for Cloud Firestore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended; v24 installed)
- **npm** (v9+)
- A **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

---

### 2. Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration:
   ```bash
   copy .env.example .env
   ```
4. Edit `backend/.env` and insert your Gemini API Key:
   ```env
   PORT=5000
   GEMINI_API_KEY=AIzaSyYourActualGeminiKeyHere
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000` with live `/api/health`.*

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Configure Firebase:
   ```bash
   copy .env.example .env
   ```
   *Note: If no Firebase keys are provided, AI Study Buddy runs seamlessly in **Demo Mode**, persisting data locally so you can immediately demonstrate the full system during a classroom presentation.*
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🧪 Testing the Application During Viva

1. **Sign In:**
   - On the login screen (`/login`), click **"Demo Quick-Fill"** to load the pre-configured profile for *Aarav Sharma (2nd Year CSE)*.
2. **AI Tutor:**
   - Go to `/tutor`. Select an engineering topic such as *"Dijkstra's Algorithm"* or *"Virtual Memory"*.
   - Choose your level and style, click **"Begin Lesson"**, and review the step-by-step breakdown.
   - Test conversational context by asking follow-up questions like *"Explain with a C++ snippet"*.
3. **AI Notes Generator:**
   - Visit `/notes`. Enter Subject *"Operating Systems"* and Topic *"Process Scheduling"*.
   - Click **"Generate Revision Notes"**. Verify the structured markdown output, copy to clipboard, or click **"Download (.md)"**.
4. **AI Quiz Generator:**
   - Go to `/quiz`. Configure 5 questions on *"Data Structures"*.
   - Answer the MCQs sequentially. Submit to view the final score, confetti animation, and detailed correct rationale explanations.
5. **Doubt Solver:**
   - Visit `/doubt-solver` and ask any coding or theory doubt (e.g. *"Explain ACID properties with an example"*).
6. **Smart Study Planner:**
   - Go to `/planner`. Provide your exam date and subject list to generate an interactive 5-day daily timetable with clickable task checkboxes.
7. **Progress Analytics:**
   - Visit `/progress` and verify that your real quiz submissions, scores, and generated notes are accurately rendered without fabricated numbers.

---

## 🌐 Production Deployment

- **Frontend (Vercel):**
  - Connect your GitHub repository to [Vercel](https://vercel.com).
  - Set the Root Directory to `frontend`.
  - Add your backend URL as an environment variable or configure rewrite proxies in `vercel.json`.
- **Backend (Render / Railway / Google Cloud Run):**
  - Deploy the `backend` folder as a Node.js web service.
  - Set `GEMINI_API_KEY` in the hosting provider's Environment Variables dashboard.

---

## 👥 Project Team

- **Academic Year:** 2nd Year (3rd Semester)
- **Branch:** Computer Science & Engineering
- **Institution:** JECRC Foundation
- **Course:** Project-Based Learning / Mini-Project Viva
