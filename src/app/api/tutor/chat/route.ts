/**
 * AI Tutor Chat API Route (Gemini)
 * Secure server-side Google Gemini integration with Model Fallback
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

// List of models to try in order of preference (Verified Jan 2026)
const MODELS_TO_TRY = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.5-pro", "gemini-2.0-flash"];

export async function POST(request: NextRequest) {
  try {
    const { messages, userMessage } = await request.json();

    if (!userMessage) {
      return NextResponse.json({ error: 'userMessage is required' }, { status: 400 });
    }

    // Support both GEMINI_API_KEY and GOOGLE_API_KEY
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        content: "I am currently running in **Demo Mode** because the `GEMINI_API_KEY` environment variable is not configured on the server.\n\nTo enable my full AI capabilities (Powered by Google Gemini), please add your Gemini API key to the project's environment variables.\n\nIn the meantime, feel free to explore the other features of EduPlanr! 🚀"
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Prepare history once
    // OpenAI format: { role: 'user' | 'assistant', content: string }
    // Gemini format: { role: 'user' | 'model', parts: [{ text: string }] }
    let history = (messages || []).slice(-10).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Gemini requires the first message in history to be from 'user'
    if (history.length > 0 && history[0].role === 'model') {
      history = history.slice(1);
    }

    // Construct the final message with system prompt injection
    const finalUserMessage = `${SYSTEM_PROMPT}\n\nStudent's Question: ${userMessage}`;

    // Try models in sequence
    let lastError = null;

    for (const modelName of MODELS_TO_TRY) {
      try {
        console.log(`Attempting to use model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const chat = model.startChat({
          history: history,
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          },
        });

        const result = await chat.sendMessage(finalUserMessage);
        const response = await result.response;
        const content = response.text();

        // If successful, return immediately
        return NextResponse.json({ content });

      } catch (error: any) {
        console.warn(`Model ${modelName} failed:`, error.message);
        lastError = error;

        // Check for specific fatal errors
        if (error.message.includes('API key') || error.message.includes('location')) {
          // If key is invalid or location blocked, stop trying others
          break;
        }
      }
    }

    // If all failed, return the error to the user as a chat message for debugging
    console.error('All Gemini models failed. Last error:', lastError);

    let errorMessage = "I'm having trouble connecting to my brain right now.";
    if (lastError?.message?.includes('404')) {
      errorMessage += "\n\n**Debug Info:** The API returned 404 (Not Found). This usually means either:\n1. The API Key is from a project that doesn't have the Generative Language API enabled.\n2. The model is not available in your region.\n3. The API Key is invalid.";
    } else if (lastError?.message) {
      errorMessage += `\n\n**Error Details:** ${lastError.message}`;
    }

    return NextResponse.json({
      content: errorMessage + "\n\nPlease check your server logs for more details."
    }); // Return 200 so the client displays this message

  } catch (error: any) {
    console.error('Gemini Chat API error:', error);
    return NextResponse.json({ content: `**System Error:** ${error.message}` });
  }
}
