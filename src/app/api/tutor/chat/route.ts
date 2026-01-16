/**
 * AI Tutor Chat API Route
 * Secure server-side OpenAI integration
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

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

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    // Build conversation history (last 10 messages)
    const conversationHistory = (messages || []).slice(-10).map((msg: { role: string; content: string }) => ({
      role: msg.role as 'user' | 'assistant',
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

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
