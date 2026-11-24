import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    framework: 'Next.js 16 (App Router Full-Stack)',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5),
    activeModel: 'gemini-3.5-flash-lite'
  });
}
