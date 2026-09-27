/**
 * Origin của backend BMT (ASP.NET). Chỉ dùng ở phía server (next.config.ts,
 * server action, server component). Trình duyệt luôn gọi cùng origin
 * `/api/v1/*` và Next chuyển tiếp sang backend, nhờ vậy cookie đăng nhập của
 * backend (SameSite=Lax) trở thành cookie first-party của website.
 */
export const API_ORIGIN = (
  process.env.BMT_API_ORIGIN ?? "https://bmt-deploy-latest.onrender.com"
).replace(/\/+$/, "");

export const API_BASE_PATH = "/api/v1";
