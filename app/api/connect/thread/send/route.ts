/**
 * Connect Thread Send Message API Route
 * Frontend wrapper for the backend connect messages endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { threadId, body: messageBody } = body;

    if (!threadId || !messageBody) {
      return NextResponse.json(
        { ok: false, error: 'Missing threadId or body' },
        { status: 400 }
      );
    }

    // Get user session
    const supabase = await createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { ok: false, error: 'not_authenticated' },
        { status: 401 }
      );
    }

    // Call backend API
    const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '');
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/connect/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          threadId,
          body: messageBody
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: data.error || data.message || 'Failed to send message' },
        { status: response.status }
      );
    }

    return NextResponse.json({ ok: true, message: data });

  } catch (error: any) {
    console.error('Connect thread send error:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
