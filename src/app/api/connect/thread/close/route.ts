/**
 * Close Connect Thread API Route
 * Frontend wrapper for closing a connect thread
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { threadId, reason } = body;

    if (!threadId) {
      return NextResponse.json(
        { ok: false, error: 'Missing threadId' },
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
      `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/connect/threads/${threadId}/close`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ reason: reason || null })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: data.error || data.message || 'Failed to close thread' },
        { status: response.status }
      );
    }

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error('Close thread error:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
