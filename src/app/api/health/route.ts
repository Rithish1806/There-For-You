import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const directUrl = process.env.DIRECT_URL || '';
  const databaseUrl = process.env.DATABASE_URL || '';

  const diag = {
    hasDirectUrl: !!directUrl,
    hasDatabaseUrl: !!databaseUrl,
    directUrlPreview: directUrl ? `${directUrl.slice(0, 20)}...${directUrl.slice(-15)}` : 'MISSING',
    databaseUrlPreview: databaseUrl ? `${databaseUrl.slice(0, 20)}...${databaseUrl.slice(-15)}` : 'MISSING',
    hasJwtSecret: !!process.env.JWT_SECRET,
  };

  try {
    const studentCount = await prisma.student.count();
    return NextResponse.json({
      status: 'connected',
      message: '✅ Database is connected successfully!',
      database: 'Supabase PostgreSQL',
      totalStudentsRegistered: studentCount,
      diagnostics: diag,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: '❌ Database connection failed',
      errorName: error?.name,
      errorCode: error?.code,
      errorMessage: error?.message,
      driverAdapterError: error?.meta?.driverAdapterError ? String(error.meta.driverAdapterError) : null,
      diagnostics: diag,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
