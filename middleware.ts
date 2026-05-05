import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("isLoggedIn");
  const isLoggedIn = cookie?.value === "true";
  const { pathname } = request.nextUrl;

  const protectedPaths = [
    "/dashboard",
    "/vapi",
    "/automations",
    "/reviews",
    "/sync",
    "/builder",
    "/analytics"
  ];

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/vapi/:path*",
    "/automations/:path*",
    "/reviews/:path*",
    "/sync/:path*",
    "/builder/:path*",
    "/analytics/:path*",
    "/login"
  ],
};
