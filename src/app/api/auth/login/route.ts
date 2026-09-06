import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = body; // identifier can be email or studentId

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Please provide both Student ID/Email and Password' }, { status: 400 });
    }

    // Find user by email or studentId
    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { email: identifier },
          { studentId: identifier }
        ]
      }
    });

    if (!student || !student.password) {
      return NextResponse.json({ error: 'Invalid credentials. Please try again.' }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials. Please try again.' }, { status: 401 });
    }

    // Create session
    await createSession({
      id: student.id,
      email: student.email,
      name: student.name,
      studentId: student.studentId
    });

    return NextResponse.json({ success: true, message: 'Logged in successfully' });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
