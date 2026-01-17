/**
 * Smart Tutor Service
 * AI-powered study assistant using OpenAI GPT API
 */

import OpenAI from 'openai';
import { ChatMessage, Conversation } from '@/types';
import { v4 as uuidv4 } from 'uuid';
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
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CONVERSATIONS_COLLECTION = 'conversations';

// Initialize OpenAI client (only on server-side)
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// System prompt for the Smart Tutor
const SYSTEM_PROMPT = `You are EduPlanr's Smart Tutor, an intelligent and friendly study assistant. Your role is to help students learn effectively.

Guidelines:
1. Be encouraging and supportive - celebrate progress and effort
2. Explain concepts clearly, using analogies when helpful
3. Break down complex topics into digestible parts
4. Ask clarifying questions to understand the student's level
5. Provide examples and practice problems when appropriate
6. Suggest study techniques and memory aids
7. Be concise but thorough - respect the student's time
8. If you don't know something, be honest and suggest resources

You can help with:
- Explaining difficult concepts in any subject
- Creating study plans and schedules
- Generating practice questions and flashcards
- Summarizing notes and textbook chapters
- Providing tips for exam preparation
- Motivating and encouraging students

Remember: You're here to empower students to learn, not just give answers. Guide them to understanding.`;

/**
 * Generate a response from the AI tutor
 */
export async function generateTutorResponse(
  messages: ChatMessage[],
  userMessage: string
): Promise<string> {
  const openai = getOpenAIClient();
  
  // Build conversation history for context
  const conversationHistory = messages.slice(-10).map((msg) => ({
    role: msg.role as 'user' | 'assistant' | 'system',
    content: msg.content,
  }));
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ],
      max_tokens: 1000,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });
    
    return response.choices[0]?.message?.content || 
      "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate response from Smart Tutor');
  }
}

/**
 * Generate study flashcards from content
 */
export async function generateFlashcards(
  content: string,
  count: number = 5
): Promise<Array<{ question: string; answer: string }>> {
  const openai = getOpenAIClient();
  
  const prompt = `Based on the following study content, generate ${count} flashcard question-answer pairs. 
Format your response as a JSON array with objects containing "question" and "answer" fields.
Make the questions test understanding, not just memorization.

Content:
${content}

Respond only with the JSON array, no other text.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that creates educational flashcards. Always respond with valid JSON.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });
    
    const responseText = response.choices[0]?.message?.content || '[]';
    
    // Parse the JSON response
    const flashcards = JSON.parse(responseText);
    return flashcards;
  } catch (error) {
    console.error('Failed to generate flashcards:', error);
    throw new Error('Failed to generate flashcards');
  }
}

/**
 * Summarize study notes
 */
export async function summarizeNotes(content: string): Promise<string> {
  const openai = getOpenAIClient();
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful assistant that creates concise, well-structured summaries of study materials. Use bullet points and highlight key concepts.' 
        },
        { 
          role: 'user', 
          content: `Please summarize the following study notes, highlighting the most important concepts and key points:\n\n${content}` 
        },
      ],
      max_tokens: 800,
      temperature: 0.5,
    });
    
    return response.choices[0]?.message?.content || 'Unable to generate summary.';
  } catch (error) {
    console.error('Failed to summarize notes:', error);
    throw new Error('Failed to summarize notes');
  }
}

/**
 * Generate practice questions
 */
export async function generatePracticeQuestions(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number = 5
): Promise<Array<{ question: string; options?: string[]; answer: string; explanation: string }>> {
  const openai = getOpenAIClient();
  
  const prompt = `Generate ${count} ${difficulty} level practice questions about: ${topic}

For each question, provide:
- The question itself
- 4 multiple choice options (A, B, C, D) if applicable
- The correct answer
- A brief explanation of why that's the correct answer

Format as a JSON array with objects containing: question, options (array), answer, explanation.
Respond only with valid JSON.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an educational content creator. Always respond with valid JSON.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });
    
    const responseText = response.choices[0]?.message?.content || '[]';
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Failed to generate practice questions:', error);
    throw new Error('Failed to generate practice questions');
  }
}

/**
 * Get study tips for a topic
 */
export async function getStudyTips(topic: string): Promise<string[]> {
  const openai = getOpenAIClient();
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'You are a study coach providing practical study tips. Respond with a JSON array of tip strings.' 
        },
        { 
          role: 'user', 
          content: `Provide 5 specific, actionable study tips for learning about: ${topic}. Respond as a JSON array of strings.` 
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const responseText = response.choices[0]?.message?.content || '[]';
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Failed to get study tips:', error);
    throw new Error('Failed to get study tips');
  }
}

// ============================================================================
// Conversation Persistence
// ============================================================================

/**
 * Create a new conversation
 */
export async function createConversation(
  userId: string,
  title: string = 'New Chat'
): Promise<Conversation> {
  if (!db) throw new Error('Firebase not initialized');

  const conversationsRef = collection(db, CONVERSATIONS_COLLECTION);
  
  const conversation: Omit<Conversation, 'id'> = {
    userId,
    title,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isArchived: false,
  };

  const docRef = await addDoc(conversationsRef, {
    ...conversation,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return {
    id: docRef.id,
    ...conversation,
  };
}

/**
 * Get a conversation by ID
 */
export async function getConversation(conversationId: string): Promise<Conversation | null> {
  if (!db) throw new Error('Firebase not initialized');

  const docRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    messages: data.messages?.map((msg: ChatMessage) => ({
      ...msg,
      timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
    })) || [],
  } as Conversation;
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(userId: string): Promise<Conversation[]> {
  if (!db) throw new Error('Firebase not initialized');

  const q = query(
    collection(db, CONVERSATIONS_COLLECTION),
    where('userId', '==', userId),
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
      messages: data.messages || [],
    } as Conversation;
  });
}

/**
 * Add a message to a conversation
 */
export async function addMessageToConversation(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<ChatMessage> {
  if (!db) throw new Error('Firebase not initialized');

  const conversation = await getConversation(conversationId);
  if (!conversation) throw new Error('Conversation not found');

  const newMessage: ChatMessage = {
    id: uuidv4(),
    role,
    content,
    timestamp: new Date(),
  };

  const updatedMessages = [...conversation.messages, newMessage];
  
  // Update conversation with new message
  const docRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
  await updateDoc(docRef, {
    messages: updatedMessages,
    updatedAt: serverTimestamp(),
    // Update title based on first user message if it's the default
    ...(conversation.title === 'New Chat' && role === 'user' 
      ? { title: content.slice(0, 50) + (content.length > 50 ? '...' : '') }
      : {}),
  });
  
  return newMessage;
}

/**
 * Delete a conversation
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  if (!db) throw new Error('Firebase not initialized');

  const docRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
  await deleteDoc(docRef);
}

/**
 * Archive a conversation
 */
export async function archiveConversation(conversationId: string): Promise<void> {
  if (!db) throw new Error('Firebase not initialized');

  const docRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
  await updateDoc(docRef, { 
    isArchived: true,
    updatedAt: serverTimestamp(),
  });
}
