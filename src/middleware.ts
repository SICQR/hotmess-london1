// middleware.ts
// HOTMESS LONDON - Route Middleware
// Handles legacy redirects to prevent drift

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { matchLegacyRedirect } from "@/lib/routes";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

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

  // No redirect needed
  return NextResponse.next();
}

// Match patterns for routes that might need redirects
export const config = {
  matcher: [
    "/tickets/:path*",
    "/connect/:path*",
  ],
};
