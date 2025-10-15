import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generatePrompt } from '@/lib/prompts';
import { Assignment, ScheduleRequest, ScheduleResponse, UserPreferences } from '@/lib/types';
import { addDays } from 'date-fns';

// Format date in local timezone to avoid UTC issues
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const genAI = process.env.GOOGLE_GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
  : null;

// Mock mode for testing (if needed)
function generateMockSchedule(assignments: Assignment[], preferences: UserPreferences): ScheduleResponse {
  type StudySession = ScheduleResponse['schedule'][number];

  const schedule: StudySession[] = [];
  let sessionId = 1;

  const parseTimeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map((part: string) => parseInt(part, 10));
    return hours * 60 + (minutes || 0);
  };

  const minutesToTime = (totalMinutes: number) => {
    const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
    const hours = Math.floor(normalized / 60);
    const minutes = normalized % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const today = new Date();
  const todayLocalString = formatLocalDate(today);
  let currentDay = new Date(`${todayLocalString}T00:00:00`);

  const [peakStartRaw, peakEndRaw] = preferences.peakHours.split('-');
  const peakStartMinutes = parseTimeToMinutes(peakStartRaw);
  const peakEndMinutes = parseTimeToMinutes(peakEndRaw);
  const crossesMidnight = peakEndMinutes <= peakStartMinutes;

  const windows = crossesMidnight
    ? [
        { start: 0, end: peakEndMinutes },
        { start: peakStartMinutes, end: 24 * 60 },
      ]
    : [{ start: peakStartMinutes, end: peakEndMinutes }];

  const longestWindow = Math.max(...windows.map((window) => window.end - window.start));
  const totalPeakWindowMinutes = windows.reduce((sum, window) => sum + (window.end - window.start), 0);
  const sessionMinutes = Math.round(preferences.sessionLength);
  const breakMinutes = Math.round(preferences.breakLength);
  const requestedMaxPerDay = Math.round(preferences.hoursPerDay * 60);
  
  // Use the smaller of: requested max hours OR what fits in peak window
  const maxStudyMinutesPerDay = Math.min(requestedMaxPerDay, totalPeakWindowMinutes);

  if (sessionMinutes > longestWindow) {
    throw new Error('Session length is longer than available peak-hour window.');
  }
  
  let minutesIntoDay = peakStartMinutes;
  let minutesStudiedToday = 0;

  const advanceToNextDay = () => {
    currentDay = addDays(currentDay, 1);
    minutesIntoDay = windows[0].start;
    minutesStudiedToday = 0;
  };

  const alignToPeakWindow = () => {
    while (true) {
      for (const window of windows) {
        if (minutesIntoDay < window.start) {
          minutesIntoDay = window.start;
        }

        if (minutesIntoDay + sessionMinutes <= window.end) {
          return;
        }

        // Move to next window in the same day
        minutesIntoDay = window.end;
      }

      // No window in current day can accommodate the session, move to next day
      advanceToNextDay();
    }
  };

  const setTimeOnDate = (date: Date, minutes: number) => {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    copy.setHours(hours, mins, 0, 0);
    return copy;
  };

  for (const assignment of assignments) {
    const sessionsNeeded = Math.ceil((assignment.estimatedHours * 60) / sessionMinutes);
    const [year, month, day] = assignment.deadline.split('-').map((value: string) => parseInt(value, 10));
    const deadline = new Date(year, month - 1, day, 23, 59, 59, 999);

    for (let i = 0; i < sessionsNeeded; i++) {
      if (minutesStudiedToday + sessionMinutes > maxStudyMinutesPerDay) {
        advanceToNextDay();
      }

      alignToPeakWindow();

      const sessionStart = setTimeOnDate(currentDay, minutesIntoDay);
      if (sessionStart > deadline) {
        console.warn(
          `Cannot fit all sessions for "${assignment.name}" before deadline ${assignment.deadline}. Skipping remaining ${sessionsNeeded - i} sessions.`
        );
        break;
      }

      const sessionEnd = new Date(sessionStart.getTime() + sessionMinutes * 60_000);
      if (sessionEnd > deadline) {
        console.warn(
          `Session for "${assignment.name}" would finish after deadline ${assignment.deadline}. Skipping remaining ${sessionsNeeded - i} sessions.`
        );
        break;
      }

      schedule.push({
        id: String(sessionId++),
        date: formatLocalDate(sessionStart),
        startTime: minutesToTime(minutesIntoDay),
        endTime: minutesToTime(minutesIntoDay + sessionMinutes),
        task: `${assignment.type === 'exam' ? 'Study' : 'Work on'} ${assignment.name}${
          i === sessionsNeeded - 1 ? ' - Final review' : ''
        }`,
        subject: assignment.subject,
        type: (i === sessionsNeeded - 1 ? 'review' : 'study') as 'review' | 'study',
        duration: sessionMinutes,
      });

      minutesStudiedToday += sessionMinutes;
      minutesIntoDay += sessionMinutes + breakMinutes;

      // If we run past the end of the day (e.g., long break), start fresh tomorrow
      if (minutesIntoDay >= 24 * 60) {
        advanceToNextDay();
      }
    }
  }

  // Deduplicate sessions (safety check for mock mode)
  const uniqueSessions = new Map<string, StudySession>();
  schedule.forEach((session) => {
    const key = `${session.date}-${session.startTime}-${session.endTime}-${session.task}`;
    if (!uniqueSessions.has(key)) {
      uniqueSessions.set(key, session);
    }
  });
  
  const deduplicatedSchedule = Array.from(uniqueSessions.values());
  const uniqueDates = new Set(deduplicatedSchedule.map((session) => session.date));

  return {
    schedule: deduplicatedSchedule,
    rationale: `Created ${deduplicatedSchedule.length} study sessions across ${uniqueDates.size} day(s). Sessions stay within your peak hours (${preferences.peakHours}) with ${sessionMinutes}-minute focus blocks and ${breakMinutes}-minute breaks to promote consistent progress.`,
    tips: [
      'Take a 5-10 minute break between study sessions to refresh your mind',
      'Review your notes from each session before starting the next one',
      'Stay hydrated and maintain good posture while studying',
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: ScheduleRequest = await req.json();
    const { assignments, preferences } = body;

    // Validate input
    if (!assignments || assignments.length === 0) {
      return NextResponse.json(
        { error: 'At least one assignment is required' },
        { status: 400 }
      );
    }

    const effectivePreferences: UserPreferences = { ...preferences };

    // Check if mock mode is enabled
    if (process.env.USE_MOCK_MODE === 'true') {
      console.log('Using MOCK mode - generating fake schedule');
      try {
        const mockSchedule = generateMockSchedule(assignments, effectivePreferences);
        return NextResponse.json(mockSchedule);
      } catch (mockError) {
        console.error('Mock schedule generation failed:', mockError);
        const message =
          mockError instanceof Error ? mockError.message : 'Failed to generate mock schedule';
        return NextResponse.json(
          { error: message },
          { status: 400 }
        );
      }
    }

    // Check API key
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.error('GOOGLE_GEMINI_API_KEY is not set');
      return NextResponse.json(
        { error: 'Google Gemini API key is not configured. Set USE_MOCK_MODE=true in .env.local for demo mode.' },
        { status: 500 }
      );
    }

    // Generate the prompt using our patterns
    const prompt = generatePrompt(assignments, effectivePreferences);
    
    // Check which AI provider to use
    const provider = process.env.AI_PROVIDER || 'gemini';
    console.log(`Generating schedule using ${provider.toUpperCase()} API`);

    let responseText: string;

    if (provider === 'openai') {
      // OpenAI (GPT-4o-mini) - Fast and affordable
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
      }

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a study planning assistant. Return only valid JSON.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error('OpenAI API error:', errorText);
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const openaiData = await openaiResponse.json();
      responseText = openaiData.choices[0].message.content;
      console.log('OpenAI response received');

    } else {
      // Gemini (default) - Free
      if (!process.env.GOOGLE_GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
      }

      const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`;
      
      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API error:', errorText);
        throw new Error(`Gemini API error: ${geminiResponse.status}`);
      }

      const geminiData = await geminiResponse.json();
      responseText = geminiData.candidates[0].content.parts[0].text;
      console.log('Gemini response received');
    }

    // Parse the JSON response
    let scheduleData: ScheduleResponse;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      scheduleData = JSON.parse(cleanedResponse);
      console.log('Successfully parsed schedule with', scheduleData.schedule.length, 'sessions');
      
      // Deduplicate sessions (AI safety check)
      const uniqueSessions = new Map<string, typeof scheduleData.schedule[number]>();
      scheduleData.schedule.forEach((session) => {
        const key = `${session.date}-${session.startTime}-${session.endTime}-${session.task}`;
        if (!uniqueSessions.has(key)) {
          uniqueSessions.set(key, session);
        }
      });
      
      scheduleData.schedule = Array.from(uniqueSessions.values());
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError, responseText);
      return NextResponse.json(
        { error: 'Failed to parse schedule data. AI response was not valid JSON.', details: responseText.substring(0, 200) },
        { status: 500 }
      );
    }

    return NextResponse.json(scheduleData);
  } catch (error) {
    console.error('Error generating schedule:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to generate schedule', details: message },
      { status: 500 }
    );
  }
}
