/**
 * Core TypeScript type definitions for EduPlanr
 * These interfaces define the shape of data used throughout the application
 */

// User profile stored in Firestore
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  defaultStudyDuration: number; // minutes
  breakDuration: number; // minutes
  dailyGoalHours: number;
  notifications: boolean;
  soundEnabled: boolean;
}

// Study material (notes, links, documents)
export interface StudyMaterial {
  id: string;
  userId: string;
  title: string;
  content: string; // HTML or Markdown content
  type: MaterialType;
  tags: string[];
  subjectId: string | null;
  syllabusId: string | null;
  url?: string; // for links
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  isArchived: boolean;
}

export type MaterialType = 'note' | 'link' | 'document' | 'flashcard';

// Subject/Course
export interface Subject {
  id: string;
  userId: string;
  name: string;
  color: string; // hex color for UI
  icon: string; // emoji or icon name
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Syllabus with topics
export interface Syllabus {
  id: string;
  userId: string;
  subjectId: string;
  title: string;
  description: string;
  topics: SyllabusTopic[];
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SyllabusTopic {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  priority: Priority;
  status: TopicStatus;
  completedAt?: Date;
  order: number;
}

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TopicStatus = 'not-started' | 'in-progress' | 'completed' | 'skipped';

// Study session for calendar/scheduling
export interface StudySession {
  id: string;
  userId: string;
  title: string;
  description: string;
  subjectId: string | null;
  syllabusId: string | null;
  topicId: string | null;
  startTime: Date;
  endTime: Date;
  isCompleted: boolean;
  actualDuration?: number; // minutes
  notes: string;
  type: SessionType;
  createdAt: Date;
  updatedAt: Date;
}

export type SessionType = 'study' | 'review' | 'break' | 'exam' | 'assignment';

// Task/Todo item
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  subjectId: string | null;
  dueDate: Date | null;
  priority: Priority;
  status: TaskStatus;
  estimatedMinutes: number;
  completedAt?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

// AI Chat message
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    tokens?: number;
    model?: string;
  };
}

// Chat conversation
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}

// Study statistics
export interface StudyStats {
  userId: string;
  date: string; // YYYY-MM-DD format
  totalMinutes: number;
  sessionsCompleted: number;
  topicsCompleted: number;
  tasksCompleted: number;
  subjectBreakdown: Record<string, number>; // subjectId -> minutes
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export type NotificationType = 'reminder' | 'achievement' | 'system' | 'deadline';

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Filter and sort options
export interface FilterOptions {
  search?: string;
  subjectId?: string;
  tags?: string[];
  priority?: Priority;
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}
