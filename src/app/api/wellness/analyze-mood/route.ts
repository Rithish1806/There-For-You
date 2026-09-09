import { NextResponse } from 'next/server';

interface MoodRequestBody {
  mood: string;
  energyLevel: number; // 1 - 5
  triggers?: string[];
  reflection?: string;
  studentContext?: {
    name?: string;
    educationLevel?: string;
    department?: string;
    subjects?: string[];
  };
}

function generateFallbackMoodAnalysis(body: MoodRequestBody) {
  const mood = body.mood || 'Okay';
  const energy = body.energyLevel || 3;
  const triggers = body.triggers || [];
  const triggerList = triggers.length > 0 ? triggers.join(', ') : 'academic schedule';

  let burnoutRisk: 'Low' | 'Moderate' | 'High' = 'Low';
  let emotionalBandwidth = 'Healthy cognitive capacity with balanced focus.';
  let stateSummary = '';
  let studyStrategy = '';
  let sessionLength = 50;
  let breakLength = 10;
  let recommendedIntensity: 'Light Review' | 'Balanced' | 'Intensive' = 'Balanced';
  let techniqueTitle = 'Mindful Breathing Reset';
  let techniqueSteps = [
    'Sit comfortably with uncrossed legs and feet flat on the floor.',
    'Breathe in deeply through your nose for 4 seconds, feeling your diaphragm expand.',
    'Hold your breath gently for 4 seconds.',
    'Exhale slowly and completely through your mouth for 6 seconds.',
    'Repeat 4 cycles to activate your parasympathetic calming response.'
  ];
  let whyItWorks = 'Controlled prolonged exhalation signals your vagus nerve to slow down your heart rate and lower cortisol.';
  let affirmation = 'You are capable, resilient, and making steady progress. Honor your body and mind today.';

  if (mood === 'Overwhelmed' || mood === 'Stressed' || mood === 'Anxious' || energy <= 2) {
    burnoutRisk = mood === 'Overwhelmed' || energy === 1 ? 'High' : 'Moderate';
    emotionalBandwidth = 'Constrained cognitive bandwidth. High sympathetic nervous system arousal.';
    stateSummary = `You are carrying significant stress regarding ${triggerList}. When your energy is at level ${energy}/5, your prefrontal cortex enters fatigue, making difficult concepts seem twice as hard. Acknowledge this feeling without self-judgment—it is a physiological response, not a reflection of your competence.`;
    recommendedIntensity = 'Light Review';
    sessionLength = 25;
    breakLength = 15;
    studyStrategy = 'Adopt the 25/15 Pomodoro model. Do NOT attempt 3-hour marathon cramming today. Start by reviewing familiar, completed lessons to trigger dopamine and rebuild cognitive momentum before touching new topics.';
    techniqueTitle = '4-7-8 Parasympathetic Nerve Calmer';
    techniqueSteps = [
      'Inhale quietly through the nose for a count of 4 seconds.',
      'Hold your breath gently for a count of 7 seconds.',
      'Exhale completely through your mouth with a whoosh sound for 8 seconds.',
      'Perform 4 full cycles before returning to your desk or study materials.'
    ];
    whyItWorks = 'The 4-7-8 technique forcibly shifts blood flow from the fear-responsive amygdala back to the rational prefrontal cortex.';
    affirmation = 'You do not have to solve everything today. One small, calm step forward is more than enough.';
  } else if (mood === 'Low' || mood === 'Exhausted') {
    burnoutRisk = 'Moderate';
    emotionalBandwidth = 'Depleted physical and mental energy reserves.';
    stateSummary = `Your nervous system is signaling an urgent need for replenishment. With energy at ${energy}/5, retention rates decline sharply. The best academic decision you can make right now is restorative pacing rather than brute-force studying.`;
    recommendedIntensity = 'Light Review';
    sessionLength = 20;
    breakLength = 15;
    studyStrategy = 'Prioritize light passive-to-active review: listen to audio explanations, skim flashcards of completed modules, and keep hydration high. Stop studying early tonight to prioritize sleep.';
    techniqueTitle = '5-4-3-2-1 Sensory Grounding';
    techniqueSteps = [
      'Acknowledge 5 things you see around your room.',
      'Acknowledge 4 things you can physically feel (e.g. feet in shoes, chair back).',
      'Acknowledge 3 things you hear.',
      'Acknowledge 2 things you smell.',
      'Acknowledge 1 thing you are grateful for right now.'
    ];
    whyItWorks = 'Sensory grounding detaches your brain from rumination loops and anchors you in the present physical space.';
    affirmation = 'Rest is not a reward for work completed; rest is a biological requirement to do your best work.';
  } else if (mood === 'Great' || mood === 'Energized') {
    burnoutRisk = 'Low';
    emotionalBandwidth = 'Peak cognitive readiness and high mental stamina.';
    stateSummary = `You are in an optimal neurochemical state for deep learning and memory consolidation! High energy (${energy}/5) provides the mental resilience needed to conquer demanding new topics and challenging problem sets.`;
    recommendedIntensity = 'Intensive';
    sessionLength = 55;
    breakLength = 10;
    studyStrategy = 'Tackle your hardest "Currently Studying" topic first (Eat That Frog). Dedicate unbroken 50-55 minute blocks to algorithmic or theoretical problem solving while your focus is sharp.';
    techniqueTitle = 'Flow-State Activation';
    techniqueSteps = [
      'Eliminate all phone notifications and close irrelevant browser tabs.',
      'Write down the 1 single most important learning goal for the next hour.',
      'Put on non-lyrical focus music (binaural beats or lo-fi).',
      'Dive in with complete immersion for 50 minutes.'
    ];
    whyItWorks = 'Eliminating task-switching cognitive friction enables rapid entry into alpha-wave flow state.';
    affirmation = 'Ride this wave of momentum and focus. You are operating at your peak potential!';
  } else {
    // Okay / Calm / Good
    stateSummary = `You are in a balanced, receptive state. With an energy level of ${energy}/5, you have steady stamina for structured learning without high risk of immediate fatigue.`;
    recommendedIntensity = 'Balanced';
    sessionLength = 45;
    breakLength = 10;
    studyStrategy = 'Follow a classic 45/10 balanced study cycle. Spend the first 30 minutes on active problem solving of your currently studying lessons, and finish with a 15-minute recall session of completed lessons.';
  }

  return {
    success: true,
    analysis: {
      stateSummary,
      burnoutRisk,
      emotionalBandwidth,
      keyInsights: [
        `Identified emotional baseline: ${mood} (Energy: ${energy}/5)`,
        triggers.length > 0 ? `Primary stress drivers: ${triggers.join(', ')}` : 'Steady academic state with manageable pressure',
        `Recommended study session pacing: ${sessionLength} min study / ${breakLength} min rest`,
        `Study Intensity Mode: ${recommendedIntensity}`
      ],
      recommendedStudyAdjustment: {
        intensity: recommendedIntensity,
        sessionLengthMinutes: sessionLength,
        breakLengthMinutes: breakLength,
        focusStrategy: studyStrategy,
        warningOrCaution: mood === 'Stressed' || mood === 'Overwhelmed' 
          ? 'Avoid late-night study marathons. Excessive cortisol impairs hippocampus memory consolidation.' 
          : 'Maintain regular hydration and eye breaks every 45 minutes.'
      },
      copingTechnique: {
        title: techniqueTitle,
        type: 'breathing',
        instructions: techniqueSteps,
        scienceWhyItWorks: whyItWorks
      },
      affirmation
    }
  };
}

export async function POST(req: Request) {
  try {
    const body: MoodRequestBody = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.warn('GROQ_API_KEY not configured, returning clinical fallback analysis');
      return NextResponse.json(generateFallbackMoodAnalysis(body));
    }

    const systemPrompt = `You are a supportive, licensed academic psychologist and student well-being coach.
Analyze the student's emotional state, stress triggers, and personal reflections with deep empathy, clinical insight, and actionable pedagogical advice.

Output ONLY a valid JSON object matching this schema:
{
  "stateSummary": string, // 2-3 paragraph deeply empathetic, psychological breakdown of what the student is experiencing, validating their feelings and explaining why their brain/body is reacting this way.
  "burnoutRisk": "Low" | "Moderate" | "High",
  "emotionalBandwidth": string, // Short assessment of their mental capacity today (e.g. "Severely taxed", "Balanced & steady", "High focus bandwidth")
  "keyInsights": string[], // 3-4 bullet observations on their mindset and drivers
  "recommendedStudyAdjustment": {
    "intensity": "Light Review" | "Balanced" | "Intensive",
    "sessionLengthMinutes": number, // e.g. 25, 40, 50
    "breakLengthMinutes": number, // e.g. 10, 15
    "focusStrategy": string, // Direct instructions on how they should adapt their study today (e.g. should they focus on completed lesson review, or deep new lessons?)
    "warningOrCaution": string // Health or habit caution
  },
  "copingTechnique": {
    "title": string, // e.g. "Box Breathing 4-4-4-4", "Cognitive Grounding"
    "type": "breathing" | "grounding" | "reframing" | "rest",
    "instructions": string[], // 4-5 concrete step-by-step instructions
    "scienceWhyItWorks": string // 1-2 sentence neurological explanation
  },
  "affirmation": string // Personalized, inspiring affirmation
}`;

    const userPrompt = `Analyze this student's well-being check-in:
- Student Name: ${body.studentContext?.name || 'Student'}
- Academic Background: ${body.studentContext?.educationLevel || 'College'} (${body.studentContext?.department || 'General'})
- Current Reported Mood: "${body.mood}"
- Energy Level (1-5): ${body.energyLevel} / 5
- Contributing Triggers/Sources: ${body.triggers && body.triggers.length > 0 ? body.triggers.join(', ') : 'None specified'}
- Student Personal Reflection: "${body.reflection || 'No written reflection provided.'}"

Please provide compassionate, non-judgmental guidance and direct advice on how to structure their study session today.`;

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
            temperature: 0.5,
            response_format: { type: 'json_object' }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiResponseContent = data.choices?.[0]?.message?.content;
          if (aiResponseContent) break;
        } else {
          console.warn(`Model ${model} returned status ${response.status}`);
        }
      } catch (err) {
        console.warn(`Model ${model} error:`, err);
      }
    }

    if (!aiResponseContent) {
      console.warn('AI models unavailable, using fallback mood analysis');
      return NextResponse.json(generateFallbackMoodAnalysis(body));
    }

    try {
      const parsed = JSON.parse(aiResponseContent);
      return NextResponse.json({
        success: true,
        analysis: parsed
      });
    } catch (parseError) {
      console.error('Failed to parse AI mood response JSON:', parseError);
      return NextResponse.json(generateFallbackMoodAnalysis(body));
    }

  } catch (error: any) {
    console.error('Mood analysis API error:', error);
    return NextResponse.json(generateFallbackMoodAnalysis({ mood: 'Okay', energyLevel: 3 }));
  }
}
