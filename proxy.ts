import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  ADMIN_AUTH_COOKIE,
  ADMIN_LOCATION_COOKIE,
  ADMIN_MOCK_SESSION,
  sanitizeAdminLocation,
} from "@/lib/admin/auth-config";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAuthenticated =
    request.cookies.get(ADMIN_AUTH_COOKIE)?.value === ADMIN_MOCK_SESSION;

  if (isLoginPage) {
    if (!isAuthenticated) return NextResponse.next();

    const requestedLocation = request.nextUrl.searchParams.get("next");
    const storedLocation = request.cookies.get(ADMIN_LOCATION_COOKIE)?.value;
    const destination = sanitizeAdminLocation(requestedLocation || storedLocation);
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (isAuthenticated) return NextResponse.next();

  const location = sanitizeAdminLocation(`${pathname}${search}`);
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", location);

  const response = NextResponse.redirect(loginUrl);
  response.cookies.set(ADMIN_LOCATION_COOKIE, location, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};