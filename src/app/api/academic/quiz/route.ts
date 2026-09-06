import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY environment variable is not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { subject = 'General Computer Science', topic = 'Core Concepts', count = 4 } = body;

    const systemPrompt = `You are an expert academic tutor and exam creator for students. 
Generate a high-quality, educational multiple choice quiz.
Output ONLY a JSON array with exactly ${count} question objects.
Each object must strictly match this TypeScript interface:
{
  "id": number,
  "question": string,
  "options": string[], // Exactly 4 options
  "answerIndex": number, // 0, 1, 2, or 3
  "explanation": string // Clear concise educational explanation
}`;

    const userPrompt = `Generate a ${count}-question quiz on the subject: "${subject}", focusing on the topic: "${topic}". Make sure the questions test real conceptual understanding.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq Quiz Error:', errText);
      return NextResponse.json({ error: 'Failed to generate quiz from AI provider' }, { status: response.status });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    let parsedQuestions: any[] = [];
    try {
      const parsed = JSON.parse(rawContent);
      if (Array.isArray(parsed)) {
        parsedQuestions = parsed;
      } else if (parsed.questions && Array.isArray(parsed.questions)) {
        parsedQuestions = parsed.questions;
      } else if (parsed.quiz && Array.isArray(parsed.quiz)) {
        parsedQuestions = parsed.quiz;
      } else {
        // Find first array property
        const arrayProp = Object.values(parsed).find(v => Array.isArray(v));
        if (arrayProp) parsedQuestions = arrayProp as any[];
      }
    } catch (e) {
      console.error('Failed to parse AI JSON:', rawContent);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      subject,
      topic,
      questions: parsedQuestions 
    });

  } catch (error: any) {
    console.error('AI Quiz Generation Error:', error);
    return NextResponse.json({ error: error?.message || 'Unexpected quiz generation error' }, { status: 500 });
  }
}
