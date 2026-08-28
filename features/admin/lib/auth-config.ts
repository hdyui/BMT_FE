export const ADMIN_AUTH_COOKIE = "bmt_admin_session";
export const ADMIN_LOCATION_COOKIE = "bmt_admin_location";
export const ADMIN_MOCK_SESSION = "bmt-mock-admin-session-v1";

export const MOCK_ADMIN_ACCOUNT = {
  email: "admin@bmtdecor.vn",
  password: "BMT@123456",
  displayName: "BMT Admin",
} as const;

export const DEFAULT_ADMIN_LOCATION = "/admin/dashboard";

export function sanitizeAdminLocation(value?: string | null) {
  if (!value) return DEFAULT_ADMIN_LOCATION;

  const location = value.trim();
  if (
    !location.startsWith("/admin") ||
    location.startsWith("//") ||
    location.startsWith("/admin/login") ||
    /[\r\n]/.test(location)
  ) {
    return DEFAULT_ADMIN_LOCATION;
  }

  return location;
}