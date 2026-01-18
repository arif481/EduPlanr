/**
 * Payment/Session Service
 * Handles CRUD operations for study sessions with real-time Firebase data
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
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StudySession } from '@/types';

const COLLECTION_NAME = 'sessions';

/**
 * Create a new study session
 */
export async function createSession(
  userId: string,
  session: Omit<StudySession, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<StudySession> {
  if (!db) throw new Error('Firebase not initialized');

  const sessionRef = collection(db, COLLECTION_NAME);

  const docData = {
    ...session,
    userId,
    startTime: session.startTime,
    endTime: session.endTime,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(sessionRef, docData);

  return {
    id: docRef.id,
    ...session,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Get all sessions for a user
 */
export async function getUserSessions(userId: string): Promise<StudySession[]> {
  if (!db) throw new Error('Firebase not initialized');

  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);

  const sessions = snapshot.docs.map((docSnap) => {
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

  return sessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
}

/**
 * Update a session
 */
export async function updateSession(
  sessionId: string,
  updates: Partial<Omit<StudySession, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  if (!db) throw new Error('Firebase not initialized');

  const docRef = doc(db, COLLECTION_NAME, sessionId);

  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  if (!db) throw new Error('Firebase not initialized');

  const docRef = doc(db, COLLECTION_NAME, sessionId);
  await deleteDoc(docRef);
}

/**
 * Mark session as complete
 */
export async function toggleSessionComplete(
  sessionId: string,
  isCompleted: boolean
): Promise<void> {
  if (!db) throw new Error('Firebase not initialized');

  const docRef = doc(db, COLLECTION_NAME, sessionId);
  await updateDoc(docRef, {
    isCompleted,
    updatedAt: serverTimestamp(),
  });
}
