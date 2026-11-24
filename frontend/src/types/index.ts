export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  college?: string;
  branch?: string;
  year?: string;
  targetExam?: string;
  studyGoalHoursPerDay?: number;
  createdAt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizResult {
  id?: string;
  userId: string;
  subject: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}

export interface NoteItem {
  id?: string;
  userId: string;
  subject: string;
  topic: string;
  level: string;
  format: string;
  content: string;
  createdAt: string;
}

export interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  timeSlot: string;
  durationMinutes: number;
  isCompleted: boolean;
  notes?: string;
}

export interface StudyScheduleDay {
  dayName: string;
  dateStr: string;
  tasks: StudyTask[];
}

export interface StudyPlan {
  id?: string;
  userId: string;
  subjects: string[];
  examDate: string;
  dailyHours: number;
  preferredTime: string;
  generatedSchedule: StudyScheduleDay[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  notesGenerated: number;
  studyHours: number;
  recentActivities: {
    id: string;
    type: 'quiz' | 'note' | 'tutor' | 'planner' | 'doubt';
    title: string;
    timestamp: string;
  }[];
}
