/**
 * Generate Practice Questions API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty = 'medium', count = 5 } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

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
    const questions = JSON.parse(responseText);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Questions API error:', error);
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
  }
}
