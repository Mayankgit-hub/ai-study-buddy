import { NextRequest, NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { subject, topic, explanationLevel, format } = await req.json();

    if (!subject || !topic) {
      return NextResponse.json({ error: 'Subject and topic are required.' }, { status: 400 });
    }

    const prompt = `You are an elite academic notes author for engineering university students.
Generate comprehensive, revision-ready study notes for:
- Subject: ${subject}
- Topic: ${topic}
- Target Depth: ${explanationLevel || 'Intermediate'}
- Notes Format: ${format || 'Detailed notes'}

Structure the output with clean markdown:
# ${topic} (${subject})
## 1. Executive Summary & Core Definition
## 2. Fundamental Concepts & Key Principles
## 3. Detailed Architecture / Mechanics / Algorithms (with clean tables or ASCII diagrams where helpful)
## 4. Key Advantages, Limitations & Real-world Applications
## 5. Important Viva / Exam Questions & Answers (at least 3 high-yield questions)
## 6. One-Minute Revision Bullet Points

Ensure the explanations are thorough, academic, accurate, and directly aligned with college semester examination standards.`;

    const response = await generateContentWithFallback({ contents: prompt });
    return NextResponse.json({ notes: response.text });
  } catch (err: unknown) {
    console.error('Notes API Error:', err);
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
