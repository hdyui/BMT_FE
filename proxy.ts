import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  ADMIN_ACCESS_COOKIE,
  ADMIN_LOCATION_COOKIE,
  ADMIN_REFRESH_COOKIE,
  sanitizeAdminLocation,
} from "@/features/admin/lib/auth-config";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  // Phiên hết hạn hoặc bị thu hồi (client gọi API bị 401 và xin lại phiên
  // không được): xóa cookie cũ, nếu không dưới đây sẽ coi là đã đăng nhập và
  // đẩy ngược về admin, tạo vòng lặp.
  if (isLoginPage && request.nextUrl.searchParams.get("expired") === "1") {
    const response = NextResponse.next();
    response.cookies.delete(ADMIN_ACCESS_COOKIE);
    response.cookies.delete(ADMIN_REFRESH_COOKIE);
    return response;
  }

  // Chỉ biết "đã có phiên hay chưa" để điều hướng. Access token rụng sau 2 giờ
  // nhưng refresh token còn, khi đó client tự xin lại phiên ở lần gọi API kế
  // tiếp. Quyền thật do backend kiểm tra ở mọi API admin.
  const isAuthenticated =
    request.cookies.has(ADMIN_ACCESS_COOKIE) || request.cookies.has(ADMIN_REFRESH_COOKIE);

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
