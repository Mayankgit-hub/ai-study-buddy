'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { UserProfile } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isFirebaseActive: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const LOCAL_STORAGE_USER_KEY = 'ai_study_buddy_demo_user';
const LOCAL_STORAGE_PROFILE_KEY = 'ai_study_buddy_demo_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string, email: string, name?: string) => {
    if (typeof window === 'undefined') return;

    if (isFirebaseConfigured) {
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUserProfile(snap.data() as UserProfile);
        } else {
          const newProfile: UserProfile = {
            uid,
            email: email || '',
            displayName: name || 'Student Buddy',
            college: 'JECRC Foundation',
            branch: 'Computer Science & Engineering',
            year: '2nd Year',
            targetExam: 'Semester 3 Finals',
            studyGoalHoursPerDay: 4,
            createdAt: new Date().toISOString()
          };
          await setDoc(ref, newProfile);
          setUserProfile(newProfile);
        }
      } catch (err) {
        console.warn('Firestore fetch warning:', err);
      }
    } else {
      const savedProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      } else {
        const fallbackProfile: UserProfile = {
          uid,
          email,
          displayName: name || 'Student Buddy',
          college: 'JECRC Foundation',
          branch: 'Computer Science & Engineering',
          year: '2nd Year',
          targetExam: 'Semester 3 Finals',
          studyGoalHoursPerDay: 4,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(fallbackProfile));
        setUserProfile(fallbackProfile);
      }
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user) {
          await fetchProfile(user.uid, user.email || '', user.displayName || '');
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        fetchProfile(parsed.uid, parsed.email, parsed.displayName);
      } else {
        const demoUser = {
          uid: 'demo-student-2026',
          email: 'student@jecrc.edu.in',
          displayName: 'Aarav Sharma',
          emailVerified: true
        } as unknown as User;
        setCurrentUser(demoUser);
        fetchProfile('demo-student-2026', 'student@jecrc.edu.in', 'Aarav Sharma');
      }
      setLoading(false);
    }
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    if (isFirebaseConfigured) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email,
        displayName: name,
        college: 'JECRC Foundation',
        branch: 'Computer Science & Engineering',
        year: '2nd Year',
        targetExam: 'Semester 3 Finals',
        studyGoalHoursPerDay: 4,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setUserProfile(newProfile);
    } else {
      const mockUser = {
        uid: 'user_' + Date.now(),
        email,
        displayName: name,
        emailVerified: true
      } as unknown as User;
      const profile: UserProfile = {
        uid: mockUser.uid,
        email,
        displayName: name,
        college: 'JECRC Foundation',
        branch: 'Computer Science & Engineering',
        year: '2nd Year',
        targetExam: 'Semester 3 Finals',
        studyGoalHoursPerDay: 4,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
      setCurrentUser(mockUser);
      setUserProfile(profile);
    }
  };

  const login = async (email: string, password: string) => {
    if (isFirebaseConfigured) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      const mockUser = {
        uid: 'user_' + Date.now(),
        email,
        displayName: email.split('@')[0],
        emailVerified: true
      } as unknown as User;
      const profile: UserProfile = {
        uid: mockUser.uid,
        email,
        displayName: email.split('@')[0],
        college: 'JECRC Foundation',
        branch: 'Computer Science & Engineering',
        year: '2nd Year',
        targetExam: 'Semester 3 Finals',
        studyGoalHoursPerDay: 4,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
      setCurrentUser(mockUser);
      setUserProfile(profile);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      await firebaseSignOut(auth);
    }
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
    setCurrentUser(null);
    setUserProfile(null);
  };

  const updateUserProfileData = async (data: Partial<UserProfile>) => {
    if (!currentUser || !userProfile) return;
    const updated = { ...userProfile, ...data };
    if (isFirebaseConfigured) {
      await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
    } else {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
    }
    setUserProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isFirebaseActive: isFirebaseConfigured,
        signup,
        login,
        logout,
        updateUserProfileData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
