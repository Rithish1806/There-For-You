import { NextResponse } from 'next/server';
import { extractText } from 'unpdf';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not configured on the server.' }, { status: 500 });
    }

    let resumeText = '';
    let targetRole = 'Software Development Engineer';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const roleFromForm = formData.get('targetRole') as string | null;
      const textFromForm = formData.get('resumeText') as string | null;

      if (roleFromForm && roleFromForm.trim()) {
        targetRole = roleFromForm.trim();
      }

      if (file && file.size > 0) {
        const fileName = file.name.toLowerCase();
        const arrayBuffer = await file.arrayBuffer();

        if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
          try {
            const { text } = await extractText(new Uint8Array(arrayBuffer), { mergePages: true });
            resumeText = Array.isArray(text) ? text.join('\n\n') : (text || '');
          } catch (pdfErr: any) {
            console.error('PDF parsing error:', pdfErr);
            return NextResponse.json({ 
              error: 'Failed to extract text from this PDF. Please ensure the PDF is not scanned or password-protected, or paste the text directly.' 
            }, { status: 400 });
          }
        } else {
          // Plain text, markdown, etc.
          const decoder = new TextDecoder('utf-8');
          resumeText = decoder.decode(arrayBuffer);
        }
      } else if (textFromForm && textFromForm.trim()) {
        resumeText = textFromForm.trim();
      }
    } else {
      // JSON body
      const body = await req.json();
      resumeText = body.resumeText || '';
      if (body.targetRole && body.targetRole.trim()) {
        targetRole = body.targetRole.trim();
      }
    }

    resumeText = (resumeText || '').trim();

    if (!resumeText || resumeText.length < 40) {
      return NextResponse.json({
        error: 'The uploaded resume is too short or empty. Please upload an ATS-readable text/PDF resume or paste your resume content directly.'
      }, { status: 400 });
    }

    // Limit text to avoid token limits (first 12,000 characters is plenty for any 1-3 page resume)
    const truncatedResume = resumeText.slice(0, 12000);

    const systemPrompt = `You are a Principal Technical Recruiter and Applicant Tracking System (ATS) Specialist.
Your task is to analyze a student/candidate's resume against their specified Target Job Role: "${targetRole}".

You must evaluate:
1. Overall ATS Compliance Score (0 to 100) based on standard industry screening algorithms (Workday, Greenhouse, Taleo).
2. Category Breakdown Scores (0 to 100) and specific feedback for:
   - Impact & Metrics (presence of quantifiable numbers, percentages, scale, measurable outcomes)
   - Keywords & Technical Skills (exact matches for "${targetRole}", frameworks, core fundamentals)
   - Structure & ATS Readability (parseable headings, bullet point structure, lack of complex tables/graphics)
   - Experience & Project Relevance (depth of hands-on projects, real-world relevance to the role)
3. Key Strengths (3-4 specific bullet points).
4. Critical Weaknesses / Red Flags (3-4 specific bullet points).
5. Missing Keywords (list of 6 to 10 high-value keywords for "${targetRole}" that are absent from this resume).
6. Actionable Improvements (categorized step-by-step recommendations to increase the score).
7. Bullet Point Transformations (2-3 examples showing how to rewrite the candidate's actual weak bullets into high-impact, STAR/XYZ-method ATS-optimized bullets with metrics).

Output STRICT, VALID JSON with NO markdown formatting, matching this exact TypeScript structure:
{
  "atsScore": number,
  "rating": string,
  "summary": string,
  "breakdown": {
    "impactAndMetrics": { "score": number, "feedback": string },
    "keywordsAndSkills": { "score": number, "feedback": string },
    "structureAndFormat": { "score": number, "feedback": string },
    "experienceRelevance": { "score": number, "feedback": string }
  },
  "strengths": string[],
  "weaknesses": string[],
  "missingKeywords": string[],
  "improvements": [
    { "category": string, "priority": "High" | "Medium" | "Low", "recommendation": string }
  ],
  "bulletPointFixes": [
    { "original": string, "improved": string, "why": string }
  ]
}`;

    const userPrompt = `Target Role: "${targetRole}"\n\n--- RESUME CONTENT ---\n${truncatedResume}\n--- END RESUME CONTENT ---`;

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
      console.error('Groq Resume Analysis Error:', err);
      return NextResponse.json({ error: 'AI analysis provider failed to process resume' }, { status: 502 });
    }

    const groqData = await groqResponse.json();
    const rawContent = groqData.choices?.[0]?.message?.content;

    let analysis: any;
    try {
      analysis = JSON.parse(rawContent);
    } catch (parseErr) {
      console.error('Failed to parse AI JSON response:', rawContent);
      return NextResponse.json({ error: 'Failed to format resume analysis result' }, { status: 500 });
    }

    // Ensure atsScore is an integer between 0 and 100
    const atsScore = Math.max(0, Math.min(100, Math.round(Number(analysis.atsScore) || 70)));
    analysis.atsScore = atsScore;

    // Save to database if user is logged in
    try {
      const session = await getSession();
      if (session && session.id) {
        await prisma.student.update({
          where: { id: session.id as string },
          data: {
            resumeAtsScore: atsScore,
            resumeAnalysis: JSON.stringify({
              ...analysis,
              analyzedAt: new Date().toISOString(),
              targetRole
            })
          }
        });
      }
    } catch (dbErr) {
      console.warn('Could not save resume analysis to user profile:', dbErr);
    }

    return NextResponse.json({
      success: true,
      targetRole,
      analysis
    });

  } catch (err: any) {
    console.error('Resume analyzer unhandled error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to analyze resume' }, { status: 500 });
  }
}
