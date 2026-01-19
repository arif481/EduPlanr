/**
 * AI Tutor Chat API Route (Gemini)
 * Secure server-side Google Gemini integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

export async function POST(request: NextRequest) {
  try {
    const { messages, userMessage } = await request.json();

    if (!userMessage) {
      return NextResponse.json({ error: 'userMessage is required' }, { status: 400 });
    }

    // Support both GEMINI_API_KEY and GOOGLE_API_KEY
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    console.log('Debug Env Vars:', {
      Target: 'Gemini',
      HasGeminiKey: !!process.env.GEMINI_API_KEY,
      HasGoogleKey: !!process.env.GOOGLE_API_KEY,
      KeyLength: apiKey ? apiKey.length : 0
    });

    if (!apiKey) {
      return NextResponse.json({
        content: "I am currently running in **Demo Mode** because the `GEMINI_API_KEY` environment variable is not configured on the server.\n\nTo enable my full AI capabilities (Powered by Google Gemini 1.5 Flash), please add your Gemini API key to the project's environment variables.\n\nIn the meantime, feel free to explore the other features of EduPlanr! 🚀"
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    // Convert conversation history to Gemini format
    // OpenAI format: { role: 'user' | 'assistant', content: string }
    // Gemini format: { role: 'user' | 'model', parts: [{ text: string }] }

    const history = (messages || []).slice(-10).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const content = response.text();

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Gemini Chat API error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
