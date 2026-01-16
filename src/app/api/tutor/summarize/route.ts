/**
 * Summarize Notes API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

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

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Summarize API error:', error);
    return NextResponse.json({ error: 'Failed to summarize notes' }, { status: 500 });
  }
}
