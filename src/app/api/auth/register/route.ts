import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
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
      return NextResponse.json({ error: 'Missing required basic fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.student.findFirst({
      where: {
        OR: [
          { email },
          { studentId }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Student with this email or ID already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const student = await prisma.student.create({
      data: {
        name,
        email,
        studentId,
        password: hashedPassword,
        age: parseInt(age) || 20,
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

    // Create session
    await createSession({
      id: student.id,
      email: student.email,
      name: student.name,
      studentId: student.studentId
    });

    return NextResponse.json({ success: true, message: 'Registration successful' });

  } catch (error: any) {
    console.error('Registration error:', error);
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'A student with this email or Student ID already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: error?.message || 'Failed to register student. Please try again.' }, { status: 500 });
  }
}
