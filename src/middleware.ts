/**
 * HOTMESS LONDON - NEXT.JS MIDDLEWARE
 * Enforces auth gates, age verification, and men-only access
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const PROTECTED_RIGHT_NOW = ['/right-now'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!PROTECTED_RIGHT_NOW.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const accessToken = req.cookies.get('sb-access-token')?.value;
  if (!accessToken) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('gender, dob, shadow_banned')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    const url = req.nextUrl.clone();
    url.pathname = '/onboarding';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (profile.shadow_banned) {
    const url = req.nextUrl.clone();
    url.pathname = '/banned';
    return NextResponse.redirect(url);
  }

  if (profile.gender !== 'man') {
    const url = req.nextUrl.clone();
    url.pathname = '/not-eligible';
    return NextResponse.redirect(url);
  }

  if (profile.dob) {
    const dob = new Date(profile.dob);
    const ageYears = (Date.now() - dob.getTime()) / (365.25 * 24 * 3600 * 1000);
    if (ageYears < 18) {
      const url = req.nextUrl.clone();
      url.pathname = '/not-eligible';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/right-now/:path*'],
};