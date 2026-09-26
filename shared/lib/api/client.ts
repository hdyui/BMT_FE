import { API_BASE_PATH, API_ORIGIN } from "@/shared/lib/api/config";
import { ApiError, readApiError } from "@/shared/lib/api/errors";

/**
 * HTTP client dùng chung cho trình duyệt và server component.
 *  - Trình duyệt gọi cùng origin `/api/v1/*` (Next rewrite sang backend), nên
 *    cookie đăng nhập đi kèm tự động.
 *  - Server component gọi thẳng backend và chỉ dùng cho endpoint công khai
 *    (không chuyển tiếp cookie).
 * Kết quả trả về là `value` đã bóc khỏi envelope.
 */

type Query = Record<string, string | number | boolean | null | undefined>;

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  /** Object/mảng được gửi dưới dạng JSON; `FormData` được gửi nguyên (upload). */
  body?: unknown;
  query?: Query;
  /**
   * Endpoint công khai: không gửi cookie. Nhờ vậy access token admin hết hạn
   * không làm request công khai bị 401.
   */
  public?: boolean;
  signal?: AbortSignal;
  /** Chỉ có tác dụng khi gọi từ server component (cache/revalidate của Next). */
  next?: RequestInit["next"];
  cache?: RequestCache;
}

const isBrowser = typeof window !== "undefined";

// Backend trả `MissingAccessToken` khi cookie access token đã rụng nhưng còn
// refresh token, `ExpiredAccessToken` khi JWT hết hạn — cả hai đều xin lại
// phiên được. `InvalidAccessToken` nghĩa là không có phiên nào để xin lại.
const REFRESHABLE_CODES = new Set(["MissingAccessToken", "ExpiredAccessToken"]);

function buildUrl(path: string, query?: Query) {
  const base = isBrowser ? API_BASE_PATH : `${API_ORIGIN}${API_BASE_PATH}`;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) search.set(key, String(value));
  }
  const suffix = search.size > 0 ? `?${search}` : "";
  return `${base}${path}${suffix}`;
}

interface Envelope {
  isSuccess: boolean;
  isFailed?: boolean;
  value: unknown;
  error?: unknown;
}

function isEnvelope(value: unknown): value is Envelope {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as Envelope).isSuccess === "boolean" &&
    "value" in (value as object)
  );
}

/**
 * Bóc envelope; bóc tiếp khi backend bọc đôi (Home hero, danh sách admin của
 * hồ sơ năng lực trả `value.value`).
 */
function unwrap<T>(body: unknown, status: number): T {
  let current = body;
  while (isEnvelope(current)) {
    if (current.isSuccess === false || current.isFailed === true) {
      throw new ApiError({
        status,
        message: typeof current.error === "string" ? current.error : "Yêu cầu không thành công.",
      });
    }
    current = current.value;
  }
  return current as T;
}

let refreshInFlight: Promise<boolean> | null = null;

/** Xin phiên mới bằng refresh token; nhiều request cùng lúc chỉ gọi một lần. */
function refreshSession(): Promise<boolean> {
  refreshInFlight ??= fetch(`${API_BASE_PATH}/auth/refresh`, {
    method: "POST",
    credentials: "same-origin",
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

/**
 * Phiên hết hạn hoặc bị thu hồi: về trang đăng nhập. `expired=1` báo cho
 * proxy xóa cookie cũ, nếu không proxy thấy cookie sẽ đẩy ngược lại admin.
 */
function redirectToLogin() {
  const { pathname, search } = window.location;
  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) return;
  const next = encodeURIComponent(`${pathname}${search}`);
  window.location.assign(`/admin/login?expired=1&next=${next}`);
}

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", body, query, signal, next, cache } = options;
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  const send = () =>
    fetch(buildUrl(path, query), {
      method,
      headers: body === undefined || isForm ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
      credentials: options.public ? "omit" : "same-origin",
      signal,
      next,
      cache,
    });

  let res = await send();

  if (res.status === 401 && isBrowser && !options.public && !path.startsWith("/auth/")) {
    const error = await readApiError(res);
    const refreshable = error.code !== null && REFRESHABLE_CODES.has(error.code);
    if (refreshable && (await refreshSession())) {
      res = await send();
    } else {
      redirectToLogin();
      throw error;
    }
  }

  if (!res.ok) throw await readApiError(res);
  if (res.status === 204) return undefined as T;

  const text = await res.text();
  return unwrap<T>(text ? JSON.parse(text) : null, res.status);
}

type CallOptions = Omit<ApiRequestOptions, "method" | "body">;

export const api = {
  get: <T = unknown>(path: string, options?: CallOptions) =>
    apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T = unknown>(path: string, body?: unknown, options?: CallOptions) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),
  patch: <T = unknown>(path: string, body?: unknown, options?: CallOptions) =>
    apiRequest<T>(path, { ...options, method: "PATCH", body }),
  delete: <T = unknown>(path: string, options?: CallOptions) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
};
