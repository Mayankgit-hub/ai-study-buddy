import { NextRequest, NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { subjects, examDate, dailyHours, preferredTime } = await req.json();

    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return NextResponse.json({ error: 'At least one subject is required.' }, { status: 400 });
    }

    const prompt = `You are an academic productivity coach and study planner.
Generate a structured, realistic 5-day study timetable leading up to:
- Examination Date: ${examDate || 'Upcoming Exam'}
- Subjects: ${subjects.join(', ')}
- Daily Available Hours: ${dailyHours || 4} hours/day
- Preferred Study Slot: ${preferredTime || 'Evening'}

Distribute the subjects intelligently. Include focused study sessions (45-60 min), active recall slots, and short buffer breaks.

Return ONLY a valid JSON array of daily schedules matching this exact format:
[
  {
    "dayName": "Day 1 - Foundation & Key Concepts",
    "dateStr": "Schedule Milestone 1",
    "tasks": [
      {
        "id": "task_1_1",
        "subject": "${subjects[0]}",
        "topic": "Core Fundamentals & Theory",
        "timeSlot": "06:00 PM - 07:15 PM",
        "durationMinutes": 75,
        "isCompleted": false,
        "notes": "Read standard definitions and review lecture slides."
      },
      {
        "id": "task_1_2",
        "subject": "${subjects[1] || subjects[0]}",
        "topic": "Problem Solving & Examples",
        "timeSlot": "07:30 PM - 08:30 PM",
        "durationMinutes": 60,
        "isCompleted": false,
        "notes": "Solve 3-5 numerical problems or code exercises."
      }
    ]
  }
]
`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    let rawText = response.text || '[]';
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    const schedule = JSON.parse(rawText);
    return NextResponse.json({ schedule });
  } catch (err: unknown) {
    console.error('Planner API Error:', err);
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
