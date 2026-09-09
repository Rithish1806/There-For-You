import { NextResponse } from 'next/server';

interface Lesson {
  subject: string;
  topic: string;
}

interface RequestBody {
  studentName?: string;
  educationLevel?: string;
  department?: string;
  subjects?: string[];
  completedLessons?: Lesson[];
  currentlyStudyingLessons?: Lesson[];
  targetHours?: number;
  intensity?: 'Light Review' | 'Balanced' | 'Intensive';
  scheduleWindow?: 'Full Day' | 'Morning' | 'Afternoon' | 'Evening';
  studentMood?: string;
  customFocus?: string;
}

function generateFallbackPlan(body: RequestBody) {
  const targetHours = body.targetHours || 4;
  const completed = body.completedLessons || [];
  const current = body.currentlyStudyingLessons || [];
  const mood = body.studentMood || 'Okay';
  const intensity = body.intensity || 'Balanced';

  // Determine starting time based on window
  let startHour = 9;
  if (body.scheduleWindow === 'Morning') startHour = 8;
  if (body.scheduleWindow === 'Afternoon') startHour = 13;
  if (body.scheduleWindow === 'Evening') startHour = 18;

  const formatTime = (hour: number, minute: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = minute < 10 ? `0${minute}` : minute;
    return `${displayHour}:${displayMinute} ${period}`;
  };

  const blocks: any[] = [];
  let currentHour = startHour;
  let currentMinute = 0;
  let blockId = 1;

  // Session duration based on mood & intensity
  const sessionDuration = (mood === 'Stressed' || mood === 'Low' || intensity === 'Light Review') ? 35 : 50;
  const breakDuration = (mood === 'Stressed' || mood === 'Low') ? 15 : 10;
  
  const totalSessionsNeeded = Math.max(2, Math.round((targetHours * 60) / (sessionDuration + breakDuration)));

  // Alternate: 1 Deep Focus (Current), 1 Revision (Completed), 1 Practice (Current)
  let currentIdx = 0;
  let completedIdx = 0;

  for (let i = 0; i < totalSessionsNeeded; i++) {
    const isRevision = i % 3 === 1 && completed.length > 0;
    const isBreakNeeded = i > 0 && i < totalSessionsNeeded;

    if (isBreakNeeded) {
      const breakStart = formatTime(currentHour, currentMinute);
      currentMinute += breakDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
      const breakEnd = formatTime(currentHour, currentMinute);

      blocks.push({
        id: `block-${blockId++}`,
        timeSlot: `${breakStart} - ${breakEnd}`,
        subject: 'Wellness & Cognitive Rest',
        lesson: 'Mindful Break & Hydration',
        type: 'break',
        durationMinutes: breakDuration,
        goal: mood === 'Stressed' 
          ? 'Step away from all screens. Drink 300ml water, do 5 deep belly breaths, and stretch.' 
          : 'Stand up, hydrate, and let your subconscious mind consolidate learned material.',
        priority: 'Medium',
        status: 'pending'
      });
    }

    const sessionStart = formatTime(currentHour, currentMinute);
    currentMinute += sessionDuration;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
    const sessionEnd = formatTime(currentHour, currentMinute);

    if (isRevision && completed.length > 0) {
      const targetLesson = completed[completedIdx % completed.length];
      completedIdx++;
      blocks.push({
        id: `block-${blockId++}`,
        timeSlot: `${sessionStart} - ${sessionEnd}`,
        subject: targetLesson.subject,
        lesson: targetLesson.topic,
        type: 'spaced_repetition',
        durationMinutes: sessionDuration,
        goal: `Spaced recall & quick test on "${targetLesson.topic}". Review key formulas, summaries, and solve 3 recall questions.`,
        priority: 'High',
        status: 'pending'
      });
    } else if (current.length > 0) {
      const targetLesson = current[currentIdx % current.length];
      currentIdx++;
      const isPractice = i % 2 === 1;
      blocks.push({
        id: `block-${blockId++}`,
        timeSlot: `${sessionStart} - ${sessionEnd}`,
        subject: targetLesson.subject,
        lesson: targetLesson.topic,
        type: isPractice ? 'practice_problems' : 'deep_study',
        durationMinutes: sessionDuration,
        goal: isPractice 
          ? `Hands-on active problem solving and test cases for "${targetLesson.topic}". Write down step-by-step solutions.`
          : `Deep conceptual learning on "${targetLesson.topic}". Read core theory, take synthesis notes, and clarify doubts.`,
        priority: 'High',
        status: 'pending'
      });
    } else {
      blocks.push({
        id: `block-${blockId++}`,
        timeSlot: `${sessionStart} - ${sessionEnd}`,
        subject: body.subjects?.[0] || 'Core Subject',
        lesson: 'Key Concepts & Exercises',
        type: 'deep_study',
        durationMinutes: sessionDuration,
        goal: 'Read foundational chapter notes and solve standard numericals or textbook questions.',
        priority: 'Medium',
        status: 'pending'
      });
    }
  }

  return {
    success: true,
    dayGoal: `Targeted mastery of currently studying topics with spaced revision of completed lessons.`,
    motivationalQuote: mood === 'Stressed' 
      ? "Take it one block at a time. Consistency beats intensity every single day." 
      : "Small daily progress compounds into massive academic success. Focus on today's goals!",
    pedagogicalTip: "Feynman Technique: After studying a current topic, explain it aloud in simple terms as if teaching a beginner.",
    totalMinutesPlanned: blocks.reduce((acc, b) => acc + b.durationMinutes, 0),
    blocks
  };
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.warn('GROQ_API_KEY not configured, using fallback plan generator');
      return NextResponse.json(generateFallbackPlan(body));
    }

    const completedStr = (body.completedLessons || [])
      .map(l => `${l.subject}: ${l.topic}`)
      .join(', ') || 'None specified';

    const currentStr = (body.currentlyStudyingLessons || [])
      .map(l => `${l.subject}: ${l.topic}`)
      .join(', ') || 'None specified';

    const systemPrompt = `You are a world-class academic cognitive science coach and personal study tutor.
Your job is to construct a rigorous, realistic, and highly motivating ONE-DAY STUDY PLAN for a student.

Rules for planning:
1. Focus heavily on active learning for **Currently Studying Lessons** (Deep Focus, Practice Problems, Concept Breakdown).
2. Strategically interleave **Completed Lessons** for active recall and spaced repetition (15-30 min recall quizzes, formula review) so the student does not forget prior material.
3. Include well-timed cognitive rest breaks (Pomodoro style) tailored to the student's mood. If the student is stressed or low energy, recommend slightly shorter focus blocks and nourishing breaks.
4. Distribute within the requested target hours (${body.targetHours || 4} hours) and schedule window (${body.scheduleWindow || 'Full Day'}).
5. Output ONLY valid JSON matching this schema:
{
  "dayGoal": string, // Inspiring 1-sentence daily objective
  "motivationalQuote": string, // Uplifting quote tailored to their situation
  "pedagogicalTip": string, // Actionable scientific study advice (e.g. Active Recall, Blurting, Feynman, Interleaving)
  "totalMinutesPlanned": number,
  "blocks": [
    {
      "id": string, // e.g. "block-1"
      "timeSlot": string, // e.g. "09:00 AM - 09:45 AM"
      "subject": string,
      "lesson": string,
      "type": "deep_study" | "spaced_repetition" | "practice_problems" | "break" | "quick_quiz",
      "durationMinutes": number,
      "goal": string, // 1-2 actionable, highly specific steps to accomplish in this block
      "priority": "High" | "Medium" | "Low",
      "status": "pending"
    }
  ]
}`;

    const userPrompt = `Generate a 1-day study plan with these parameters:
- Student Name: ${body.studentName || 'Student'}
- Education Level: ${body.educationLevel || 'College'} (${body.department || 'General'})
- Target Study Duration: ${body.targetHours || 4} hours
- Schedule Window: ${body.scheduleWindow || 'Full Day'}
- Intensity Level: ${body.intensity || 'Balanced'}
- Current Student Mood / Energy: ${body.studentMood || 'Okay'}
- Completed Lessons (Use for spaced repetition): ${completedStr}
- Currently Studying Lessons (Use for deep focus & problem solving): ${currentStr}
${body.customFocus ? `- Special Student Request/Exam: ${body.customFocus}` : ''}`;

    const modelsToTry = ['openai/gpt-oss-120b', 'llama-3.3-70b-versatile', 'llama3-70b-8192'];
    let aiResponseContent = null;

    for (const model of modelsToTry) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.4,
            response_format: { type: 'json_object' }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiResponseContent = data.choices?.[0]?.message?.content;
          if (aiResponseContent) break;
        } else {
          console.warn(`Model ${model} returned ${response.status}`);
        }
      } catch (err) {
        console.warn(`Model ${model} error:`, err);
      }
    }

    if (!aiResponseContent) {
      console.warn('All AI models failed, using fallback plan generator');
      return NextResponse.json(generateFallbackPlan(body));
    }

    try {
      const parsed = JSON.parse(aiResponseContent);
      return NextResponse.json({
        success: true,
        ...parsed
      });
    } catch (parseError) {
      console.error('Failed to parse AI response JSON:', parseError);
      return NextResponse.json(generateFallbackPlan(body));
    }

  } catch (error: any) {
    console.error('Study planner API error:', error);
    return NextResponse.json(generateFallbackPlan({}));
  }
}
