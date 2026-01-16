/**
 * Study Sessions Service
 * Handles scheduling, creating, and managing study sessions
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StudySession, Syllabus, Priority } from '@/types';
import { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  addDays,
  addMinutes,
  differenceInMinutes,
  isWithinInterval,
  format,
  parseISO,
} from 'date-fns';

const COLLECTION_NAME = 'sessions';

/**
 * Create a new study session
 */
export async function createSession(
  userId: string,
  session: Omit<StudySession, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<StudySession> {
  const sessionsRef = collection(db, COLLECTION_NAME);
  
  const docData = {
    ...session,
    userId,
    startTime: Timestamp.fromDate(session.startTime),
    endTime: Timestamp.fromDate(session.endTime),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(sessionsRef, docData);
  
  return {
    id: docRef.id,
    ...session,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Get a single session by ID
 */
export async function getSession(sessionId: string): Promise<StudySession | null> {
  const docRef = doc(db, COLLECTION_NAME, sessionId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    startTime: data.startTime?.toDate() || new Date(),
    endTime: data.endTime?.toDate() || new Date(),
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as StudySession;
}

/**
 * Get sessions for a specific date range
 */
export async function getSessionsInRange(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<StudySession[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    where('startTime', '>=', Timestamp.fromDate(startDate)),
    where('startTime', '<=', Timestamp.fromDate(endDate)),
    orderBy('startTime', 'asc')
  );

  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      startTime: data.startTime?.toDate() || new Date(),
      endTime: data.endTime?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as StudySession;
  });
}

/**
 * Get sessions for today
 */
export async function getTodaySessions(userId: string): Promise<StudySession[]> {
  const today = new Date();
  return getSessionsInRange(userId, startOfDay(today), endOfDay(today));
}

/**
 * Get sessions for current week
 */
export async function getWeekSessions(userId: string): Promise<StudySession[]> {
  const today = new Date();
  return getSessionsInRange(userId, startOfWeek(today), endOfWeek(today));
}

/**
 * Update a session
 */
export async function updateSession(
  sessionId: string,
  updates: Partial<Omit<StudySession, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, sessionId);
  
  const updateData: Record<string, unknown> = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  // Convert dates to Timestamps
  if (updates.startTime) {
    updateData.startTime = Timestamp.fromDate(updates.startTime);
  }
  if (updates.endTime) {
    updateData.endTime = Timestamp.fromDate(updates.endTime);
  }

  await updateDoc(docRef, updateData);
}

/**
 * Mark session as completed
 */
export async function completeSession(
  sessionId: string,
  actualDuration?: number
): Promise<void> {
  await updateSession(sessionId, {
    isCompleted: true,
    actualDuration,
  });
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, sessionId);
  await deleteDoc(docRef);
}

// ============================================================================
// Smart Scheduling Algorithm
// ============================================================================

interface TimeSlot {
  start: Date;
  end: Date;
}

interface SchedulingOptions {
  preferredStartHour: number; // 0-23
  preferredEndHour: number; // 0-23
  sessionDuration: number; // minutes
  breakDuration: number; // minutes
  daysAhead: number;
}

const DEFAULT_SCHEDULING_OPTIONS: SchedulingOptions = {
  preferredStartHour: 9,
  preferredEndHour: 21,
  sessionDuration: 45,
  breakDuration: 15,
  daysAhead: 7,
};

/**
 * Find available time slots for studying
 */
export async function findAvailableSlots(
  userId: string,
  options: Partial<SchedulingOptions> = {}
): Promise<TimeSlot[]> {
  const opts = { ...DEFAULT_SCHEDULING_OPTIONS, ...options };
  const today = new Date();
  const endDate = addDays(today, opts.daysAhead);
  
  // Get existing sessions
  const existingSessions = await getSessionsInRange(userId, today, endDate);
  
  const availableSlots: TimeSlot[] = [];
  
  // Iterate through each day
  for (let day = 0; day < opts.daysAhead; day++) {
    const currentDay = addDays(today, day);
    const dayStart = new Date(currentDay);
    dayStart.setHours(opts.preferredStartHour, 0, 0, 0);
    
    const dayEnd = new Date(currentDay);
    dayEnd.setHours(opts.preferredEndHour, 0, 0, 0);
    
    // Filter sessions for this day
    const daySessions = existingSessions.filter((session) =>
      isWithinInterval(session.startTime, { start: dayStart, end: dayEnd })
    );
    
    // Sort by start time
    daySessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    // Find gaps between sessions
    let currentTime = dayStart;
    
    for (const session of daySessions) {
      const gap = differenceInMinutes(session.startTime, currentTime);
      
      if (gap >= opts.sessionDuration) {
        availableSlots.push({
          start: new Date(currentTime),
          end: new Date(session.startTime),
        });
      }
      
      // Move current time to after the session plus break
      currentTime = addMinutes(session.endTime, opts.breakDuration);
    }
    
    // Check remaining time at end of day
    const remainingTime = differenceInMinutes(dayEnd, currentTime);
    if (remainingTime >= opts.sessionDuration) {
      availableSlots.push({
        start: new Date(currentTime),
        end: dayEnd,
      });
    }
  }
  
  return availableSlots;
}

/**
 * Auto-schedule study sessions based on syllabus topics
 */
export async function autoScheduleSessions(
  userId: string,
  syllabus: Syllabus,
  options: Partial<SchedulingOptions> = {}
): Promise<StudySession[]> {
  const opts = { ...DEFAULT_SCHEDULING_OPTIONS, ...options };
  
  // Get incomplete topics sorted by priority
  const priorityOrder: Record<Priority, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  
  const incompleteTopics = syllabus.topics
    .filter((topic) => topic.status !== 'completed' && topic.status !== 'skipped')
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  if (incompleteTopics.length === 0) {
    return [];
  }
  
  // Find available slots
  const availableSlots = await findAvailableSlots(userId, opts);
  
  const scheduledSessions: StudySession[] = [];
  let slotIndex = 0;
  
  for (const topic of incompleteTopics) {
    const requiredMinutes = topic.estimatedHours * 60;
    let scheduledMinutes = 0;
    
    while (scheduledMinutes < requiredMinutes && slotIndex < availableSlots.length) {
      const slot = availableSlots[slotIndex];
      const slotDuration = differenceInMinutes(slot.end, slot.start);
      
      // Calculate session duration (don't exceed slot or remaining topic time)
      const sessionMinutes = Math.min(
        opts.sessionDuration,
        slotDuration,
        requiredMinutes - scheduledMinutes
      );
      
      if (sessionMinutes >= 15) { // Minimum 15-minute session
        const sessionStart = slot.start;
        const sessionEnd = addMinutes(sessionStart, sessionMinutes);
        
        // Create session
        const session = await createSession(userId, {
          title: `Study: ${topic.title}`,
          description: topic.description,
          subjectId: syllabus.subjectId,
          syllabusId: syllabus.id,
          topicId: topic.id,
          startTime: sessionStart,
          endTime: sessionEnd,
          isCompleted: false,
          notes: '',
          type: 'study',
        });
        
        scheduledSessions.push(session);
        scheduledMinutes += sessionMinutes;
        
        // Update slot start for remaining time
        slot.start = addMinutes(sessionEnd, opts.breakDuration);
        
        // If slot is exhausted, move to next
        if (differenceInMinutes(slot.end, slot.start) < opts.sessionDuration) {
          slotIndex++;
        }
      } else {
        slotIndex++;
      }
    }
  }
  
  return scheduledSessions;
}

/**
 * Get study statistics for a date range
 */
export async function getStudyStats(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  totalMinutes: number;
  sessionsCompleted: number;
  averageSessionLength: number;
  byDay: Record<string, number>;
}> {
  const sessions = await getSessionsInRange(userId, startDate, endDate);
  const completedSessions = sessions.filter((s) => s.isCompleted);
  
  const totalMinutes = completedSessions.reduce((sum, session) => {
    const duration = session.actualDuration || 
      differenceInMinutes(session.endTime, session.startTime);
    return sum + duration;
  }, 0);
  
  const byDay: Record<string, number> = {};
  completedSessions.forEach((session) => {
    const dayKey = format(session.startTime, 'yyyy-MM-dd');
    const duration = session.actualDuration || 
      differenceInMinutes(session.endTime, session.startTime);
    byDay[dayKey] = (byDay[dayKey] || 0) + duration;
  });
  
  return {
    totalMinutes,
    sessionsCompleted: completedSessions.length,
    averageSessionLength: completedSessions.length > 0 
      ? Math.round(totalMinutes / completedSessions.length) 
      : 0,
    byDay,
  };
}
