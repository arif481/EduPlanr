/**
 * Generate Flashcards API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { content, count = 5 } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

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
    const flashcards = JSON.parse(responseText);

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error('Flashcards API error:', error);
    return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
  }
}
