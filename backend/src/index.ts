import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ai, GEMINI_MODEL, generateContentWithFallback } from './gemini.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper for handling missing API key error
const checkAiConfigured = (res: Response): boolean => {
  if (!ai) {
    res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the backend. Please check backend/.env'
    });
    return false;
  }
  return true;
};

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    appName: 'AI Study Buddy API',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5),
    activeModel: GEMINI_MODEL,
    version: '1.0.0'
  });
});

// 1. POST /api/tutor
app.post('/api/tutor', async (req: Request, res: Response) => {
  try {
    const { topic, difficulty, explanationStyle, followUpQuestion, history } = req.body;

    if (!topic && !followUpQuestion) {
      res.status(400).json({ error: 'Topic or question is required.' });
      return;
    }

    if (!checkAiConfigured(res)) return;

    const systemPrompt = `You are "AI Study Buddy", an expert, patient, and engaging engineering and academic tutor.
Your mission is to help college students understand technical and theoretical concepts deeply and intuitively.
- Difficulty Level: ${difficulty || 'Beginner'}
- Style: ${explanationStyle || 'Simple'}

Guidelines:
1. Explain clearly with real-world analogies and intuitive breakdown.
2. If the topic involves algorithms, system design, or programming, provide clean, commented pseudocode or language-specific code snippets.
3. Highlight key terms and bullet points.
4. End with a 1-sentence quick recall summary and a thought-provoking viva question.`;

    const userPrompt = followUpQuestion
      ? `Topic Context: ${topic || 'Academic Lesson'}\nFollow-up Question: ${followUpQuestion}`
      : `Teach me about: "${topic}". Explain it for a ${difficulty} engineering student in a ${explanationStyle} style with clear examples.`;

    let contents = '';
    if (history && Array.isArray(history) && history.length > 0) {
      const historyTranscript = history
        .map(h => `${h.role === 'user' ? 'Student' : 'AI Tutor'}: ${h.parts?.[0]?.text || ''}`)
        .join('\n');
      contents = `${systemPrompt}\n\nPrevious Conversation:\n${historyTranscript}\n\nStudent: ${userPrompt}`;
    } else {
      contents = `${systemPrompt}\n\nStudent: ${userPrompt}`;
    }

    const response = await generateContentWithFallback({
      contents,
    });

    res.json({ response: response.text });
  } catch (err: unknown) {
    console.error('Tutor API Error:', err);
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    res.status(500).json({ error: msg });
  }
});

// 2. POST /api/notes
app.post('/api/notes', async (req: Request, res: Response) => {
  try {
    const { subject, topic, explanationLevel, format } = req.body;

    if (!subject || !topic) {
      res.status(400).json({ error: 'Subject and topic are required.' });
      return;
    }

    if (!checkAiConfigured(res)) return;

    const prompt = `You are an elite academic notes author for engineering university students.
Generate comprehensive, revision-ready study notes for:
- Subject: ${subject}
- Topic: ${topic}
- Target Depth: ${explanationLevel || 'Intermediate'}
- Notes Format: ${format || 'Detailed notes'}

Structure the output with clean markdown:
# ${topic} (${subject})
## 1. Executive Summary & Core Definition
## 2. Fundamental Concepts & Key Principles
## 3. Detailed Architecture / Mechanics / Algorithms (with clean tables or ASCII diagrams where helpful)
## 4. Key Advantages, Limitations & Real-world Applications
## 5. Important Viva / Exam Questions & Answers (at least 3 high-yield questions)
## 6. One-Minute Revision Bullet Points

Ensure the explanations are thorough, academic, accurate, and directly aligned with college semester examination standards.`;

    const response = await generateContentWithFallback({
      contents: prompt,
    });

    res.json({ notes: response.text });
  } catch (err: unknown) {
    console.error('Notes API Error:', err);
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    res.status(500).json({ error: msg });
  }
});

// 3. POST /api/quiz
app.post('/api/quiz', async (req: Request, res: Response) => {
  try {
    const { subject, topic, numberOfQuestions, difficulty } = req.body;

    if (!subject || !topic) {
      res.status(400).json({ error: 'Subject and topic are required.' });
      return;
    }

    if (!checkAiConfigured(res)) return;

    const count = Number(numberOfQuestions) || 5;

    const prompt = `You are an engineering examination evaluator.
Generate exactly ${count} multiple-choice questions (MCQs) for:
- Subject: ${subject}
- Topic: ${topic}
- Difficulty: ${difficulty || 'Intermediate'}

Return ONLY a valid JSON array of question objects. Do not include markdown code blocks or surrounding text.
JSON Structure format:
[
  {
    "id": 1,
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0,
    "explanation": "Why Option A is correct and why other options are incorrect."
  }
]
Important:
- Provide exactly 4 options per question.
- "correctAnswerIndex" must be 0, 1, 2, or 3 representing the index in "options".
- Ensure the questions test real engineering understanding and problem solving.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    let rawText = response.text || '[]';
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    const questions = JSON.parse(rawText);
    res.json({ questions });
  } catch (err: unknown) {
    console.error('Quiz API Error:', err);
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    res.status(500).json({ error: msg });
  }
});

// 4. POST /api/chat (Doubt Solver)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    if (!checkAiConfigured(res)) return;

    const systemInstruction = `You are "AI Study Buddy - Doubt Solver", an intelligent 24/7 academic teaching assistant for college students.
- Provide crisp, direct, step-by-step explanations for technical doubts, programming bugs, calculus proofs, and conceptual dilemmas.
- When code is requested or relevant, format it cleanly with explanations.
- Be encouraging, precise, and pedagogically sound.`;

    let fullPrompt = `${systemInstruction}\n\n`;

    if (history && Array.isArray(history) && history.length > 0) {
      const historyStr = history
        .map(h => `${h.role === 'user' ? 'Student' : 'Assistant'}: ${h.parts?.[0]?.text || ''}`)
        .join('\n');
      fullPrompt += `History:\n${historyStr}\n\n`;
    }

    fullPrompt += `Student: ${message}`;

    const response = await generateContentWithFallback({
      contents: fullPrompt,
    });

    res.json({ response: response.text });
  } catch (err: unknown) {
    console.error('Chat Doubt Solver API Error:', err);
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    res.status(500).json({ error: msg });
  }
});

// 5. POST /api/planner
app.post('/api/planner', async (req: Request, res: Response) => {
  try {
    const { subjects, examDate, dailyHours, preferredTime } = req.body;

    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      res.status(400).json({ error: 'At least one subject is required.' });
      return;
    }

    if (!checkAiConfigured(res)) return;

    const prompt = `You are an academic productivity coach and study planner.
Generate a structured, realistic 5-day study timetable leading up to:
- Examination Date: ${examDate || 'Upcoming Exam'}
- Subjects: ${subjects.join(', ')}
- Daily Available Hours: ${dailyHours || 4} hours/day
- Preferred Study Slot: ${preferredTime || 'Evening'}

Distribute the subjects intelligently. Include focused study sessions (45-60 min), active recall slots, and short buffer breaks.

Return ONLY a valid JSON array of daily schedules matching this exact format:
[
  {
    "dayName": "Day 1 - Foundation & Key Concepts",
    "dateStr": "Schedule Milestone 1",
    "tasks": [
      {
        "id": "task_1_1",
        "subject": "${subjects[0]}",
        "topic": "Core Fundamentals & Theory",
        "timeSlot": "06:00 PM - 07:15 PM",
        "durationMinutes": 75,
        "isCompleted": false,
        "notes": "Read standard definitions and review lecture slides."
      },
      {
        "id": "task_1_2",
        "subject": "${subjects[1] || subjects[0]}",
        "topic": "Problem Solving & Examples",
        "timeSlot": "07:30 PM - 08:30 PM",
        "durationMinutes": 60,
        "isCompleted": false,
        "notes": "Solve 3-5 numerical problems or code exercises."
      }
    ]
  }
]
`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    let rawText = response.text || '[]';
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    const schedule = JSON.parse(rawText);
    res.json({ schedule });
  } catch (err: unknown) {
    console.error('Planner API Error:', err);
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    res.status(500).json({ error: msg });
  }
});

app.listen(PORT, () => {
  console.log(`AI Study Buddy Backend API running on port ${PORT}`);
});
