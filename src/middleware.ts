// middleware.ts
// HOTMESS LONDON - Route Middleware
// Handles legacy redirects and auth session refresh

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { matchLegacyRedirect } from "@/lib/routes";
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: req,
  });

  const url = req.nextUrl;
  const pathname = url.pathname;

  // Create Supabase client for session refresh
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if expired - this is crucial for auth to work
  const { data: { user } } = await supabase.auth.getUser();

  // Check for legacy redirects
  const redirectTarget = matchLegacyRedirect(pathname, url);

  if (redirectTarget) {
    // Parse target to separate pathname and search
    const [targetPath, targetSearch] = redirectTarget.split("?");

    // Create new URL with redirect target
    const redirectUrl = url.clone();
    redirectUrl.pathname = targetPath;

    // Merge or replace search params
    if (targetSearch) {
      redirectUrl.search = targetSearch;
    }

    console.log(
      `[Middleware] Legacy redirect: ${pathname} → ${redirectUrl.pathname}${redirectUrl.search}`
    );

    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Match patterns for routes that might need redirects or auth
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};