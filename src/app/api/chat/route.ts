import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API key is missing. Please check .env.local.' },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Prepare messages with system prompt
    const groqMessages = [
      {
        role: 'system',
        content:
          'You are an empathetic, intelligent, and highly knowledgeable AI academic & career assistant for a student platform called "There For You". You help students with academic planning, scholarships, career guidance, study habits, and wellness. Be encouraging, concise, structured, and give direct, accurate answers to student questions.',
      },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API Error response:', errText);
      return NextResponse.json(
        { error: `AI provider error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response at this moment.';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error while communicating with AI.' },
      { status: 500 }
    );
  }
}
