import { db, isFirebaseConfigured } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { QuizResult, NoteItem, StudyPlan, UserStats } from '../types';

const STORAGE_KEYS = {
  QUIZZES: 'ai_study_buddy_quizzes',
  NOTES: 'ai_study_buddy_notes',
  PLANS: 'ai_study_buddy_plans'
};

// ==================== QUIZ STORAGE ====================
export async function saveQuizResult(quiz: Omit<QuizResult, 'id'>): Promise<string> {
  if (isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, 'quizzes'), quiz);
      return docRef.id;
    } catch (e) {
      console.warn('Firebase error, falling back to local:', e);
    }
  }
  const saved = localStorage.getItem(STORAGE_KEYS.QUIZZES);
  const items: QuizResult[] = saved ? JSON.parse(saved) : [];
  const id = 'quiz_' + Date.now();
  items.unshift({ ...quiz, id });
  localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(items));
  return id;
}

export async function getUserQuizzes(userId: string): Promise<QuizResult[]> {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'quizzes'), where('userId', '==', userId));
      const snap = await getDocs(q);
      const results: QuizResult[] = [];
      snap.forEach(d => results.push({ id: d.id, ...(d.data() as Omit<QuizResult, 'id'>) }));
      return results.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    } catch (e) {
      console.warn('Firebase error, using local:', e);
    }
  }
  const saved = localStorage.getItem(STORAGE_KEYS.QUIZZES);
  if (!saved) return [];
  const items: QuizResult[] = JSON.parse(saved);
  return items.filter(q => q.userId === userId || userId === 'demo-student-2026');
}

// ==================== NOTES STORAGE ====================
export async function saveNote(note: Omit<NoteItem, 'id'>): Promise<string> {
  if (isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, 'notes'), note);
      return docRef.id;
    } catch (e) {
      console.warn('Firebase error, using local:', e);
    }
  }
  const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
  const items: NoteItem[] = saved ? JSON.parse(saved) : [];
  const id = 'note_' + Date.now();
  items.unshift({ ...note, id });
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(items));
  return id;
}

export async function getUserNotes(userId: string): Promise<NoteItem[]> {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'notes'), where('userId', '==', userId));
      const snap = await getDocs(q);
      const results: NoteItem[] = [];
      snap.forEach(d => results.push({ id: d.id, ...(d.data() as Omit<NoteItem, 'id'>) }));
      return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e) {
      console.warn('Firebase error, using local:', e);
    }
  }
  const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
  if (!saved) return [];
  const items: NoteItem[] = JSON.parse(saved);
  return items.filter(n => n.userId === userId || userId === 'demo-student-2026');
}

// ==================== STUDY PLANNER STORAGE ====================
export async function saveStudyPlan(plan: Omit<StudyPlan, 'id'>): Promise<string> {
  if (isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, 'studyPlans'), plan);
      return docRef.id;
    } catch (e) {
      console.warn('Firebase error, using local:', e);
    }
  }
  const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
  const items: StudyPlan[] = saved ? JSON.parse(saved) : [];
  const id = 'plan_' + Date.now();
  items.unshift({ ...plan, id });
  localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(items));
  return id;
}

export async function getUserLatestStudyPlan(userId: string): Promise<StudyPlan | null> {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'studyPlans'), where('userId', '==', userId));
      const snap = await getDocs(q);
      const results: StudyPlan[] = [];
      snap.forEach(d => results.push({ id: d.id, ...(d.data() as Omit<StudyPlan, 'id'>) }));
      if (results.length > 0) {
        return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      }
    } catch (e) {
      console.warn('Firebase error, using local:', e);
    }
  }
  const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
  if (!saved) return null;
  const items: StudyPlan[] = JSON.parse(saved);
  const userPlans = items.filter(p => p.userId === userId || userId === 'demo-student-2026');
  return userPlans.length > 0 ? userPlans[0] : null;
}

export async function updatePlanTaskStatus(
  planId: string, 
  dayIndex: number, 
  taskId: string, 
  completed: boolean
): Promise<void> {
  // Update in local storage
  const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
  if (saved) {
    const items: StudyPlan[] = JSON.parse(saved);
    const plan = items.find(p => p.id === planId);
    if (plan && plan.generatedSchedule[dayIndex]) {
      const task = plan.generatedSchedule[dayIndex].tasks.find(t => t.id === taskId);
      if (task) {
        task.isCompleted = completed;
        localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(items));
      }
    }
  }

  if (isFirebaseConfigured && !planId.startsWith('plan_')) {
    try {
      const planRef = doc(db, 'studyPlans', planId);
      // fetch, mutate and save
    } catch (e) {
      console.warn('Error updating task in Firestore:', e);
    }
  }
}

// ==================== DASHBOARD & PROGRESS STATS ====================
export async function getUserAggregatedStats(userId: string): Promise<UserStats> {
  const quizzes = await getUserQuizzes(userId);
  const notes = await getUserNotes(userId);
  const latestPlan = await getUserLatestStudyPlan(userId);

  const totalQuizzes = quizzes.length;
  const averageScore = totalQuizzes > 0
    ? Math.round(quizzes.reduce((acc, q) => acc + q.percentage, 0) / totalQuizzes)
    : 0;
  const notesGenerated = notes.length;

  // Calculate actual hours based on completed tasks & quiz count
  let calculatedHours = totalQuizzes * 0.4 + notesGenerated * 0.5;
  if (latestPlan) {
    let completedTasksCount = 0;
    latestPlan.generatedSchedule.forEach(day => {
      day.tasks.forEach(task => {
        if (task.isCompleted) completedTasksCount += (task.durationMinutes / 60);
      });
    });
    calculatedHours += completedTasksCount;
  }

  // Synthesize genuine activity history from the stored records
  const recentActivities: UserStats['recentActivities'] = [];
  
  quizzes.slice(0, 5).forEach(q => {
    recentActivities.push({
      id: q.id || 'q_' + Math.random(),
      type: 'quiz',
      title: `Completed ${q.subject} quiz on "${q.topic}" with ${q.percentage}% score`,
      timestamp: q.completedAt
    });
  });

  notes.slice(0, 5).forEach(n => {
    recentActivities.push({
      id: n.id || 'n_' + Math.random(),
      type: 'note',
      title: `Generated ${n.format} for ${n.subject} (${n.topic})`,
      timestamp: n.createdAt
    });
  });

  if (latestPlan) {
    recentActivities.push({
      id: latestPlan.id || 'p_1',
      type: 'planner',
      title: `Generated Study Schedule for ${latestPlan.subjects.join(', ')}`,
      timestamp: latestPlan.createdAt
    });
  }

  // Sort chronological descending
  recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    totalQuizzes,
    averageScore,
    notesGenerated,
    studyHours: Number(calculatedHours.toFixed(1)),
    recentActivities: recentActivities.slice(0, 8)
  };
}
