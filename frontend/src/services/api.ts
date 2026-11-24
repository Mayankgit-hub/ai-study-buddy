import { QuizQuestion, StudyScheduleDay } from '../types';

const API_BASE = '/api';

export interface TutorRequest {
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  explanationStyle: 'Simple' | 'Detailed' | 'Step-by-Step';
  followUpQuestion?: string;
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
}

export interface NotesRequest {
  subject: string;
  topic: string;
  explanationLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  format: 'Short notes' | 'Detailed notes' | 'Exam preparation notes' | 'Important questions and answers';
}

export interface QuizRequest {
  subject: string;
  topic: string;
  numberOfQuestions: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface DoubtRequest {
  message: string;
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
}

export interface PlannerRequest {
  subjects: string[];
  topics?: string[];
  examDate: string;
  dailyHours: number;
  preferredTime: string;
}

export async function askTutor(payload: TutorRequest): Promise<string> {
  const res = await fetch(`${API_BASE}/tutor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Tutor API failed with status ${res.status}`);
  }
  const data = await res.json();
  return data.response;
}

export async function generateNotes(payload: NotesRequest): Promise<string> {
  const res = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Notes API failed with status ${res.status}`);
  }
  const data = await res.json();
  return data.notes;
}

export async function generateQuiz(payload: QuizRequest): Promise<QuizQuestion[]> {
  const res = await fetch(`${API_BASE}/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Quiz API failed with status ${res.status}`);
  }
  const data = await res.json();
  return data.questions;
}

export async function solveDoubt(payload: DoubtRequest): Promise<string> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Doubt Solver API failed with status ${res.status}`);
  }
  const data = await res.json();
  return data.response;
}

export async function generateStudyPlan(payload: PlannerRequest): Promise<StudyScheduleDay[]> {
  const res = await fetch(`${API_BASE}/planner`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Planner API failed with status ${res.status}`);
  }
  const data = await res.json();
  return data.schedule;
}
