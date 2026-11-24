import { NextRequest, NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { topic, difficulty, explanationStyle, followUpQuestion, history } = await req.json();

    if (!topic && !followUpQuestion) {
      return NextResponse.json({ error: 'Topic or question is required.' }, { status: 400 });
    }

    const systemPrompt = `You are "AI Study Buddy", an expert, patient, and engaging engineering and academic tutor.
Your mission is to help college students understand technical and theoretical concepts deeply and intuitively.
- Difficulty Level: ${difficulty || 'Beginner'}
- Style: ${explanationStyle || 'Simple'}

Guidelines:
1. Explain clearly with real-world analogies and intuitive breakdown.
2. If the topic involves algorithms, system design, or programming, provide clean, commented pseudocode or language-specific code snippets.
3. Highlight key terms and bullet points.
4. End with a 1-sentence quick recall summary and a thought-provoking viva question.`;

    const userPrompt = followUpQuestion
      ? `Topic Context: ${topic || 'Academic Lesson'}\nFollow-up Question: ${followUpQuestion}`
      : `Teach me about: "${topic}". Explain it for a ${difficulty} engineering student in a ${explanationStyle} style with clear examples.`;

    let contents = '';
    if (history && Array.isArray(history) && history.length > 0) {
      const historyTranscript = history
        .map((h: any) => `${h.role === 'user' ? 'Student' : 'AI Tutor'}: ${h.parts?.[0]?.text || ''}`)
        .join('\n');
      contents = `${systemPrompt}\n\nPrevious Conversation:\n${historyTranscript}\n\nStudent: ${userPrompt}`;
    } else {
      contents = `${systemPrompt}\n\nStudent: ${userPrompt}`;
    }

    const response = await generateContentWithFallback({ contents });
    return NextResponse.json({ response: response.text });
  } catch (err: unknown) {
    console.error('Tutor API Error:', err);
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
