/**
 * Study Materials Service
 * Handles CRUD operations for study materials (notes, links, documents)
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
  limit,
  startAfter,
  serverTimestamp,
  DocumentSnapshot,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StudyMaterial, FilterOptions, PaginatedResponse } from '@/types';

const COLLECTION_NAME = 'materials';
const PAGE_SIZE = 20;

/**
 * Create a new study material
 */
export async function createMaterial(
  userId: string,
  material: Omit<StudyMaterial, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<StudyMaterial> {
  const materialsRef = collection(db, COLLECTION_NAME);
  
  const docData = {
    ...material,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(materialsRef, docData);
  
  return {
    id: docRef.id,
    ...material,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Get a single material by ID
 */
export async function getMaterial(materialId: string): Promise<StudyMaterial | null> {
  const docRef = doc(db, COLLECTION_NAME, materialId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as StudyMaterial;
}

/**
 * Update an existing material
 */
export async function updateMaterial(
  materialId: string,
  updates: Partial<Omit<StudyMaterial, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, materialId);
  
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a material
 */
export async function deleteMaterial(materialId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, materialId);
  await deleteDoc(docRef);
}

/**
 * Get paginated materials for a user with optional filters
 */
export async function getMaterials(
  userId: string,
  filters?: FilterOptions,
  lastDoc?: DocumentSnapshot,
  pageSize: number = PAGE_SIZE
): Promise<PaginatedResponse<StudyMaterial>> {
  const constraints: QueryConstraint[] = [
    where('userId', '==', userId),
    where('isArchived', '==', false),
  ];

  // Apply filters
  if (filters?.subjectId) {
    constraints.push(where('subjectId', '==', filters.subjectId));
  }

  if (filters?.tags && filters.tags.length > 0) {
    constraints.push(where('tags', 'array-contains-any', filters.tags));
  }

  // Add ordering
  constraints.push(orderBy('updatedAt', 'desc'));

  // Pagination
  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  constraints.push(limit(pageSize + 1)); // +1 to check if there are more

  const q = query(collection(db, COLLECTION_NAME), ...constraints);
  const snapshot = await getDocs(q);

  const items: StudyMaterial[] = [];
  let hasMore = false;

  snapshot.docs.forEach((docSnap, index) => {
    if (index < pageSize) {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as StudyMaterial);
    } else {
      hasMore = true;
    }
  });

  return {
    items,
    total: items.length, // Note: Firestore doesn't support COUNT efficiently
    page: 1,
    pageSize,
    hasMore,
  };
}

/**
 * Get favorite materials
 */
export async function getFavoriteMaterials(userId: string): Promise<StudyMaterial[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    where('isFavorite', '==', true),
    where('isArchived', '==', false),
    orderBy('updatedAt', 'desc'),
    limit(50)
  );

  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as StudyMaterial;
  });
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(materialId: string, isFavorite: boolean): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, materialId);
  await updateDoc(docRef, { 
    isFavorite, 
    updatedAt: serverTimestamp() 
  });
}

/**
 * Archive a material (soft delete)
 */
export async function archiveMaterial(materialId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, materialId);
  await updateDoc(docRef, { 
    isArchived: true, 
    updatedAt: serverTimestamp() 
  });
}

/**
 * Search materials by title
 */
export async function searchMaterials(
  userId: string,
  searchTerm: string
): Promise<StudyMaterial[]> {
  // Note: Firestore doesn't support full-text search natively
  // For production, consider using Algolia or Elasticsearch
  // This is a simple prefix search
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    where('isArchived', '==', false),
    orderBy('title'),
    limit(50)
  );

  const snapshot = await getDocs(q);
  const searchLower = searchTerm.toLowerCase();
  
  return snapshot.docs
    .map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as StudyMaterial;
    })
    .filter((material) => 
      material.title.toLowerCase().includes(searchLower) ||
      material.content.toLowerCase().includes(searchLower)
    );
}

/**
 * Get materials count by type
 */
export async function getMaterialsCountByType(
  userId: string
): Promise<Record<string, number>> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    where('isArchived', '==', false)
  );

  const snapshot = await getDocs(q);
  
  const counts: Record<string, number> = {
    note: 0,
    link: 0,
    document: 0,
    flashcard: 0,
  };

  snapshot.docs.forEach((docSnap) => {
    const type = docSnap.data().type;
    if (type in counts) {
      counts[type]++;
    }
  });

  return counts;
}
