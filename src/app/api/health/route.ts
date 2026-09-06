import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const studentCount = await prisma.student.count();
    return NextResponse.json({
      status: 'connected',
      message: '✅ Database is connected successfully!',
      database: 'Supabase PostgreSQL',
      totalStudentsRegistered: studentCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: '❌ Database connection failed',
      error: error?.message || 'Unknown database connection error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
