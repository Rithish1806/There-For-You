import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Please provide both Student ID/Email and Password' }, { status: 400 });
    }

    const cleanIdentifier = identifier.trim();

    // Find user by email (case-insensitive) or studentId (case-insensitive)
    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { email: { equals: cleanIdentifier, mode: 'insensitive' } },
          { studentId: { equals: cleanIdentifier, mode: 'insensitive' } }
        ]
      }
    });

    if (!student || !student.password) {
      return NextResponse.json({ error: 'Invalid credentials. No account found with that ID or Email.' }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password. Please check your password and try again.' }, { status: 401 });
    }

    // Create session
    await createSession({
      id: student.id,
      email: student.email,
      name: student.name,
      studentId: student.studentId
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Logged in successfully',
      user: { id: student.id, email: student.email, name: student.name, studentId: student.studentId }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error?.message || 'An unexpected error occurred during login.' }, { status: 500 });
  }
}
