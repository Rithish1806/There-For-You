import { NextResponse } from 'next/server';
import { extractText } from 'unpdf';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY environment variable is not configured.' }, { status: 500 });
    }

    let documentText = '';
    let focusMode = 'comprehensive'; // 'comprehensive' | 'formulas' | 'cheatsheet' | 'flashcards'
    let subjectName = '';
    let totalPages = 1;

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const modeFromForm = formData.get('focusMode') as string | null;
      const subjectFromForm = formData.get('subject') as string | null;
      const textFromForm = formData.get('documentText') as string | null;

      if (modeFromForm) focusMode = modeFromForm;
      if (subjectFromForm) subjectName = subjectFromForm;

      if (file && file.size > 0) {
        const fileName = file.name.toLowerCase();
        const arrayBuffer = await file.arrayBuffer();

        if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
          try {
            const result = await extractText(new Uint8Array(arrayBuffer), { mergePages: true });
            documentText = Array.isArray(result.text) ? result.text.join('\n\n') : (result.text || '');
            totalPages = result.totalPages || 1;
          } catch (pdfErr: any) {
            console.error('PDF text extraction error:', pdfErr);
            return NextResponse.json({
              error: 'Failed to extract readable text from this PDF. Please check if the file is scanned/protected or paste the notes text directly.'
            }, { status: 400 });
          }
        } else {
          // Plain text, markdown, code
          const decoder = new TextDecoder('utf-8');
          documentText = decoder.decode(arrayBuffer);
        }
      } else if (textFromForm && textFromForm.trim()) {
        documentText = textFromForm.trim();
      }
    } else {
      // JSON body
      const body = await req.json();
      documentText = body.documentText || '';
      if (body.focusMode) focusMode = body.focusMode;
      if (body.subject) subjectName = body.subject;
    }

    documentText = (documentText || '').trim();

    if (!documentText || documentText.length < 50) {
      return NextResponse.json({
        error: 'The provided document is too short or empty. Please upload an informative lecture PDF or paste your study material.'
      }, { status: 400 });
    }

    // Limit text to avoid token limits (14,000 chars is ~3,000 tokens, perfect for high-density fast summarization)
    const truncatedText = documentText.slice(0, 14000);

    const systemPrompt = `You are a distinguished University Professor and Master Tutor specializing in academic synthesis, STEM education, and high-yield exam preparation.
Your goal is to parse lecture notes, textbooks, and laboratory manuals into deeply structured, crystal-clear study notes.

Current Focus Mode: "${focusMode}"
Subject/Context: "${subjectName || 'General Academic Course'}"

Generate a STRICT, VALID JSON response matching this exact TypeScript schema:
{
  "title": string, // Accurate, descriptive title of the lecture/topic
  "overview": string, // 2-3 paragraph thorough overview of the core concepts
  "readingTimeMinutes": number, // Estimated reading time in minutes
  "keyTakeaways": string[], // 4-6 high-impact takeaway bullets
  "sections": [
    {
      "heading": string,
      "summary": string,
      "bulletPoints": string[]
    }
  ],
  "formulasAndDefinitions": [
    {
      "term": string, // Law, definition, theorem, or formula name
      "definitionOrFormula": string, // The formula/equation or formal definition
      "exampleOrUsage": string // When/how to apply it in exams or lab experiments
    }
  ],
  "flashcards": [
    {
      "question": string,
      "answer": string
    }
  ],
  "examQuestions": [
    {
      "question": string,
      "answerKey": string
    }
  ]
}

Ensure the output is 100% valid JSON with NO markdown fences or preamble.`;

    const userPrompt = `Summarize and extract key study materials from this academic document content:\n\n--- DOCUMENT START ---\n${truncatedText}\n--- DOCUMENT END ---`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
    });

    if (!groqResponse.ok) {
      const err = await groqResponse.text();
      console.error('Groq PDF Summarize Error:', err);
      return NextResponse.json({ error: 'AI summarization provider failed to process the document.' }, { status: 502 });
    }

    const groqData = await groqResponse.json();
    const rawContent = groqData.choices?.[0]?.message?.content;

    let summaryData: any;
    try {
      summaryData = JSON.parse(rawContent);
    } catch (parseErr) {
      console.error('Failed to parse AI summary JSON:', rawContent);
      return NextResponse.json({ error: 'Failed to format the document summary.' }, { status: 500 });
    }

    summaryData.totalPages = totalPages;
    summaryData.originalLength = documentText.length;

    return NextResponse.json({
      success: true,
      data: summaryData
    });

  } catch (error: any) {
    console.error('PDF Summarizer unhandled error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to summarize document.' }, { status: 500 });
  }
}
