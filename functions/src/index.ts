/**
 * Firebase Cloud Functions for EduPlanr
 * Secure proxy for OpenAI API calls
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import OpenAI from 'openai';
import cors from 'cors';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize CORS middleware
const corsHandler = cors({ origin: true });

// Initialize OpenAI client
const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY || functions.config().openai?.key;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  return new OpenAI({ apiKey });
};

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
 * Chat with AI Tutor
 * POST /chat
 * Body: { messages: Array<{role: string, content: string}>, userMessage: string }
 */
export const chat = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    // Only allow POST
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { messages = [], userMessage } = req.body;

      if (!userMessage) {
        res.status(400).json({ error: 'userMessage is required' });
        return;
      }

      const openai = getOpenAI();

      // Build conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      }));

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...conversationHistory,
          { role: 'user', content: userMessage },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content || 
        "I apologize, but I couldn't generate a response. Please try again.";

      res.json({ content });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });
});

/**
 * Generate Flashcards
 * POST /flashcards
 * Body: { content: string, count?: number }
 */
export const flashcards = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { content, count = 5 } = req.body;

      if (!content) {
        res.status(400).json({ error: 'content is required' });
        return;
      }

      const openai = getOpenAI();

      const prompt = `Based on the following study content, generate ${count} flashcard question-answer pairs. 
Format your response as a JSON array with objects containing "question" and "answer" fields.
Make the questions test understanding, not just memorization.

Content:
${content}

Respond only with the JSON array, no other text.`;

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
      const flashcardsData = JSON.parse(responseText);

      res.json({ flashcards: flashcardsData });
    } catch (error) {
      console.error('Flashcards error:', error);
      res.status(500).json({ error: 'Failed to generate flashcards' });
    }
  });
});

/**
 * Summarize Notes
 * POST /summarize
 * Body: { content: string }
 */
export const summarize = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { content } = req.body;

      if (!content) {
        res.status(400).json({ error: 'content is required' });
        return;
      }

      const openai = getOpenAI();

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

      const summary = response.choices[0]?.message?.content || 'Unable to generate summary.';

      res.json({ summary });
    } catch (error) {
      console.error('Summarize error:', error);
      res.status(500).json({ error: 'Failed to summarize notes' });
    }
  });
});

/**
 * Generate Practice Questions
 * POST /questions
 * Body: { topic: string, difficulty: 'easy'|'medium'|'hard', count?: number }
 */
export const questions = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { topic, difficulty = 'medium', count = 5 } = req.body;

      if (!topic) {
        res.status(400).json({ error: 'topic is required' });
        return;
      }

      const openai = getOpenAI();

      const prompt = `Generate ${count} ${difficulty} level practice questions about: ${topic}

For each question, provide:
- The question itself
- 4 multiple choice options (A, B, C, D) if applicable
- The correct answer
- A brief explanation of why that's the correct answer

Format as a JSON array with objects containing: question, options (array), answer, explanation.
Respond only with valid JSON.`;

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
      const questionsData = JSON.parse(responseText);

      res.json({ questions: questionsData });
    } catch (error) {
      console.error('Questions error:', error);
      res.status(500).json({ error: 'Failed to generate questions' });
    }
  });
});

/**
 * Get Study Tips
 * POST /tips
 * Body: { topic: string }
 */
export const tips = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { topic } = req.body;

      if (!topic) {
        res.status(400).json({ error: 'topic is required' });
        return;
      }

      const openai = getOpenAI();

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
      const tipsData = JSON.parse(responseText);

      res.json({ tips: tipsData });
    } catch (error) {
      console.error('Tips error:', error);
      res.status(500).json({ error: 'Failed to get study tips' });
    }
  });
});
