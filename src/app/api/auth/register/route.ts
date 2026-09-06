import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    if (!process.env.DIRECT_URL && !process.env.DATABASE_URL) {
      return NextResponse.json({
        error: 'Database connection is not configured on Render. Please add DATABASE_URL and DIRECT_URL in your Render Environment settings.'
      }, { status: 500 });
    }

    const body = await req.json();
    const {
      name,
      email,
      studentId,
      password,
      age,
      gender,
      category,
      educationLevel,
      gradeClass,
      percentage,
      department,
      semester,
      cgpa,
      annualIncomeLPA,
      isDifferentlyAbled
    } = body;

    if (!name || !email || !studentId || !password) {
      return NextResponse.json({ error: 'Missing required fields: Name, Email, Student ID, and Password are required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanStudentId = studentId.trim();

    // Check if user already exists
    const existingUser = await prisma.student.findFirst({
      where: {
        OR: [
          { email: { equals: cleanEmail, mode: 'insensitive' } },
          { studentId: { equals: cleanStudentId, mode: 'insensitive' } }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === cleanEmail) {
        return NextResponse.json({ error: 'An account with this email already exists. Please log in.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'An account with this Student ID already exists.' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const student = await prisma.student.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        studentId: cleanStudentId,
        password: hashedPassword,
        age: age ? parseInt(age) : 20,
        gender: gender || 'male',
        category: category || 'General',
        educationLevel: educationLevel || 'College',
        gradeClass: gradeClass || null,
        percentage: percentage ? parseFloat(percentage) : null,
        department: department || 'General',
        semester: semester || 'S1',
        cgpa: cgpa ? parseFloat(cgpa) : 8.0,
        annualIncomeLPA: annualIncomeLPA ? parseFloat(annualIncomeLPA) : 4.0,
        isDifferentlyAbled: isDifferentlyAbled === 'true' || isDifferentlyAbled === true,
      }
    });

    // Create session cookie
    await createSession({
      id: student.id,
      email: student.email,
      name: student.name,
      studentId: student.studentId
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful',
      user: { id: student.id, email: student.email, name: student.name, studentId: student.studentId }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'A student with this email or Student ID already exists.' }, { status: 409 });
    }
    if (error?.code === 'ECONNREFUSED' || error?.message?.includes('ECONNREFUSED') || error?.message?.includes('invocation:')) {
      return NextResponse.json({
        error: 'Database connection failed. Please ensure DATABASE_URL and DIRECT_URL are configured in your Render dashboard.'
      }, { status: 500 });
    }
    return NextResponse.json({ error: error?.message || 'Failed to register student. Please try again.' }, { status: 500 });
  }
}
