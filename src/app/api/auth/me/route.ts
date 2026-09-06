import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { id: session.id as string },
      select: {
        id: true,
        studentId: true,
        name: true,
        email: true,
        educationLevel: true,
        gradeClass: true,
        percentage: true,
        age: true,
        gender: true,
        category: true,
        department: true,
        semester: true,
        cgpa: true,
        annualIncomeLPA: true,
        isDifferentlyAbled: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    return NextResponse.json({ user: student });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch user profile' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();

    if (!session || !session.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      educationLevel,
      gradeClass,
      percentage,
      age,
      gender,
      category,
      department,
      semester,
      cgpa,
      annualIncomeLPA,
      isDifferentlyAbled
    } = body;

    const updated = await prisma.student.update({
      where: { id: session.id as string },
      data: {
        ...(name && { name: name.trim() }),
        ...(educationLevel && { educationLevel }),
        ...(gradeClass !== undefined && { gradeClass: gradeClass || null }),
        ...(percentage !== undefined && { percentage: percentage ? parseFloat(percentage) : null }),
        ...(age !== undefined && { age: parseInt(age) || 20 }),
        ...(gender && { gender }),
        ...(category && { category }),
        ...(department && { department: department || 'General' }),
        ...(semester && { semester: semester || 'S1' }),
        ...(cgpa !== undefined && { cgpa: cgpa ? parseFloat(cgpa) : 8.0 }),
        ...(annualIncomeLPA !== undefined && { annualIncomeLPA: annualIncomeLPA ? parseFloat(annualIncomeLPA) : 4.0 }),
        ...(isDifferentlyAbled !== undefined && { isDifferentlyAbled: isDifferentlyAbled === true || isDifferentlyAbled === 'true' }),
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully', 
      user: updated 
    });

  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update user profile' }, { status: 500 });
  }
}
