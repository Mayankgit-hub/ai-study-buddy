import { NextRequest, NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { subject, topic, numberOfQuestions, difficulty } = await req.json();

    if (!subject || !topic) {
      return NextResponse.json({ error: 'Subject and topic are required.' }, { status: 400 });
    }

    const count = Number(numberOfQuestions) || 5;

    const prompt = `You are an engineering examination evaluator.
Generate exactly ${count} multiple-choice questions (MCQs) for:
- Subject: ${subject}
- Topic: ${topic}
- Difficulty: ${difficulty || 'Intermediate'}

Return ONLY a valid JSON array of question objects. Do not include markdown code blocks or surrounding text.
JSON Structure format:
[
  {
    "id": 1,
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0,
    "explanation": "Why Option A is correct and why other options are incorrect."
  }
]
Important:
- Provide exactly 4 options per question.
- "correctAnswerIndex" must be 0, 1, 2, or 3 representing the index in "options".
- Ensure the questions test real engineering understanding and problem solving.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    let rawText = response.text || '[]';
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    const questions = JSON.parse(rawText);
    return NextResponse.json({ questions });
  } catch (err: unknown) {
    console.error('Quiz API Error:', err);
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
