// Tên cookie phiên do backend cấp khi đăng nhập (HttpOnly). FE chỉ dùng để
// biết "đã có phiên hay chưa" khi điều hướng; quyền thật do backend kiểm tra ở
// mọi API admin.
export const ADMIN_ACCESS_COOKIE = "accessToken";
export const ADMIN_REFRESH_COOKIE = "refreshToken";
export const ADMIN_LOCATION_COOKIE = "bmt_admin_location";

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
