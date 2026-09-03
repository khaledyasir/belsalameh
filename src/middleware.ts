import { NextResponse, type NextRequest } from "next/server";

/**
 * Route protection for the admin area.
 *
 * PHASE 0: checks the presence of the demo-role cookie only. Phase 3 swaps
 * this for Auth.js `withAuth` middleware validating a signed session + role
 * claims, and enforcing the idle/absolute session lifetime.
 */
const COOKIE = "bsl_admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthed = Boolean(req.cookies.get(COOKIE)?.value);

  if (pathname.startsWith("/admin") && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
