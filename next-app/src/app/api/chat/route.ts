import { NextRequest, NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const systemInstruction = `You are "AI Study Buddy - Doubt Solver", an intelligent 24/7 academic teaching assistant for college students.
- Provide crisp, direct, step-by-step explanations for technical doubts, programming bugs, calculus proofs, and conceptual dilemmas.
- When code is requested or relevant, format it cleanly with explanations.
- Be encouraging, precise, and pedagogically sound.`;

    let fullPrompt = `${systemInstruction}\n\n`;

    if (history && Array.isArray(history) && history.length > 0) {
      const historyStr = history
        .map((h: any) => `${h.role === 'user' ? 'Student' : 'Assistant'}: ${h.parts?.[0]?.text || ''}`)
        .join('\n');
      fullPrompt += `History:\n${historyStr}\n\n`;
    }

    fullPrompt += `Student: ${message}`;

    const response = await generateContentWithFallback({ contents: fullPrompt });
    return NextResponse.json({ response: response.text });
  } catch (err: unknown) {
    console.error('Chat Doubt Solver API Error:', err);
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
