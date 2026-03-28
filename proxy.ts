import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/register",
  "/api/register",
  "/login",
  "/api/login",
  "/_next",
  "/favicon.ico",
  "/assets",
  "/",
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const session = req.cookies.get("session_user_id");
  // Prevent logged-in users from reaching /login
  if (pathname.startsWith("/login") && session) {
    const adminUrl = new URL("/admin", req.url);
    return NextResponse.redirect(adminUrl);
  }
  if (!isPublic && !session) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|assets).*)"],
};
