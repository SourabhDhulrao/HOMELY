import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Please provide name, email, and message.' },
        { status: 400 }
      );
    }

    // In production, send via Resend, Sendgrid, or store in database
    console.log('[HOMELY Contact Submission]', { name, email, subject, message, date: new Date().toISOString() });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your note. Our editorial desk will be in touch shortly.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error sending message.' },
      { status: 500 }
    );
  }
}

