"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_AUTH_COOKIE,
  ADMIN_LOCATION_COOKIE,
  ADMIN_MOCK_SESSION,
  MOCK_ADMIN_ACCOUNT,
  sanitizeAdminLocation,
} from "@/features/admin/lib/auth-config";

export type AdminLoginState = {
  error: string | null;
};

const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function loginAdmin(
  _previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const email = String(formData.get("email") ?? "").trim().toLocaleLowerCase("vi");
  const password = String(formData.get("password") ?? "");

  if (
    email !== MOCK_ADMIN_ACCOUNT.email.toLocaleLowerCase("vi") ||
    password !== MOCK_ADMIN_ACCOUNT.password
  ) {
    return { error: "Email hoặc mật khẩu không đúng." };
  }

  const cookieStore = await cookies();
  const requestedLocation = String(formData.get("location") ?? "");
  const storedLocation = cookieStore.get(ADMIN_LOCATION_COOKIE)?.value;
  const location = sanitizeAdminLocation(requestedLocation || storedLocation);

  cookieStore.set(ADMIN_AUTH_COOKIE, ADMIN_MOCK_SESSION, sessionCookieOptions);
  cookieStore.delete(ADMIN_LOCATION_COOKIE);

  redirect(location);
}

export async function logoutAdmin(location: string) {
  const cookieStore = await cookies();
  const safeLocation = sanitizeAdminLocation(location);

  cookieStore.set(ADMIN_LOCATION_COOKIE, safeLocation, {
    ...sessionCookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });
  cookieStore.delete(ADMIN_AUTH_COOKIE);

  redirect("/admin/login");
}