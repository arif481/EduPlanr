/**
 * Global application store using Zustand
 * Manages authentication state, UI preferences, and app-wide data
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { UserProfile, Subject, Notification } from '@/types';

// Authentication store
interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ user: null, profile: null, isAuthenticated: false }),
}));

// UI/Theme store with persistence
interface UIState {
  theme: 'dark' | 'light' | 'system';
  sidebarCollapsed: boolean;
  activeView: string;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveView: (view: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarCollapsed: false,
      activeView: 'dashboard',
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setActiveView: (activeView) => set({ activeView }),
    }),
    {
      name: 'eduplanr-ui',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Subjects store
interface SubjectsState {
  subjects: Subject[];
  selectedSubjectId: string | null;
  isLoading: boolean;
  setSubjects: (subjects: Subject[]) => void;
  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  removeSubject: (id: string) => void;
  setSelectedSubject: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useSubjectsStore = create<SubjectsState>((set) => ({
  subjects: [],
  selectedSubjectId: null,
  isLoading: false,
  setSubjects: (subjects) => set({ subjects }),
  addSubject: (subject) => set((state) => ({ subjects: [...state.subjects, subject] })),
  updateSubject: (id, updates) =>
    set((state) => ({
      subjects: state.subjects.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),
  removeSubject: (id) =>
    set((state) => ({
      subjects: state.subjects.filter((s) => s.id !== id),
      selectedSubjectId: state.selectedSubjectId === id ? null : state.selectedSubjectId,
    })),
  setSelectedSubject: (selectedSubjectId) => set({ selectedSubjectId }),
  setLoading: (isLoading) => set({ isLoading }),
}));

// Notifications store
interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    })),
  markAsRead: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      const wasUnread = notification && !notification.isRead;
      return {
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
      };
    }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  removeNotification: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      const wasUnread = notification && !notification.isRead;
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
      };
    }),
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));

// Study session timer store
interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  sessionType: 'study' | 'break';
  duration: number; // total duration in seconds
  elapsed: number; // elapsed time in seconds
  currentSessionId: string | null;
  startTimer: (duration: number, sessionId?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  tick: () => void;
  setSessionType: (type: 'study' | 'break') => void;
  reset: () => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  isRunning: false,
  isPaused: false,
  sessionType: 'study',
  duration: 45 * 60, // 45 minutes default
  elapsed: 0,
  currentSessionId: null,
  startTimer: (duration, sessionId) =>
    set({
      isRunning: true,
      isPaused: false,
      duration,
      elapsed: 0,
      currentSessionId: sessionId || null,
    }),
  pauseTimer: () => set({ isPaused: true }),
  resumeTimer: () => set({ isPaused: false }),
  stopTimer: () => set({ isRunning: false, isPaused: false, elapsed: 0 }),
  tick: () =>
    set((state) => {
      if (state.isPaused || !state.isRunning) return state;
      const newElapsed = state.elapsed + 1;
      if (newElapsed >= state.duration) {
        return { ...state, isRunning: false, elapsed: state.duration };
      }
      return { elapsed: newElapsed };
    }),
  setSessionType: (sessionType) => set({ sessionType }),
  reset: () =>
    set({
      isRunning: false,
      isPaused: false,
      elapsed: 0,
      currentSessionId: null,
    }),
}));

// Chat/AI Tutor store
interface ChatState {
  isOpen: boolean;
  conversationId: string | null;
  isLoading: boolean;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  setConversationId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  conversationId: null,
  isLoading: false,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  setConversationId: (conversationId) => set({ conversationId }),
  setLoading: (isLoading) => set({ isLoading }),
}));
