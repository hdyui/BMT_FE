import { api, refreshSession } from "@/shared/lib/api/client";

/**
 * Toàn bộ API xác thực của backend (`AuthController`). Backend đặt phiên trong
 * cookie HttpOnly (`accessToken` 2 giờ + `refreshToken` 24 giờ) nên FE không
 * đọc hay lưu token; Next chuyển tiếp `/api/v1/*` nên cookie là first-party.
 */

/** Tài khoản admin đang đăng nhập. */
export interface AdminAccount {
  id: string;
  email: string;
}

export interface AdminCredentials {
  email: string;
  password: string;
}

/** `POST /auth/login` — Admin UI đăng nhập; backend giới hạn 5 lần/phút. */
export function loginAdmin(credentials: AdminCredentials) {
  return api.post<AdminAccount>("/auth/login", credentials);
}

/** `POST /auth/logout` — thu hồi refresh token, backend xóa hai cookie phiên. */
export function logoutAdmin() {
  return api.post<void>("/auth/logout");
}

/**
 * `POST /auth/refresh` — xin phiên mới bằng refresh token (backend xoay token).
 * HTTP client tự gọi khi access token hết hạn; trả `false` nếu không xin lại được.
 */
export function refreshAdminSession() {
  return refreshSession();
}

/** `GET /auth/me` — tài khoản của phiên hiện tại; 401 nếu chưa đăng nhập hoặc tài khoản không còn hoạt động. */
export function getCurrentAdmin() {
  return api.get<AdminAccount>("/auth/me");
}

/**
 * `POST /auth` — tạo tài khoản admin ban đầu. Đây là API SETUP của backend
 * (đang public, chưa có phân quyền) nên KHÔNG có giao diện nào gọi; chỉ dùng
 * khi khởi tạo hệ thống, ví dụ từ script.
 */
export function createAdminAccount(credentials: AdminCredentials) {
  return api.post<string>("/auth", credentials);
}
