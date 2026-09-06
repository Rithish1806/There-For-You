import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import crypto from 'crypto';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY || 're_fallback');

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.student.update({
      where: { email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Note: If no real RESEND API key, this will fail or log.
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'There For You <onboarding@resend.dev>', // Update this with verified domain later
        to: email,
        subject: 'Password Reset - There For You',
        html: `
          <h1>Reset Your Password</h1>
          <p>Hi ${student.name},</p>
          <p>You requested a password reset. Click the link below to set a new password:</p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#4F46E5;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      });
    } else {
      console.log('--- DEVELOPMENT MODE: Password Reset Token ---');
      console.log('Link:', resetUrl);
    }

    return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
