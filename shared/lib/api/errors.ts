/**
 * Backend trả lỗi theo ba dạng khác nhau, ApiError gom cả ba:
 *  - `{ title, status, detail, messageCode, ... }` do middleware của backend;
 *  - ProblemDetails của ASP.NET (`errors` là object các mảng chuỗi);
 *  - văn bản thuần khi bị giới hạn tốc độ (429, kèm `Retry-After`).
 */
export class ApiError extends Error {
  readonly status: number;
  /** `messageCode` của backend, ví dụ `NOT_FOUND`, `ExpiredAccessToken`. */
  readonly code: string | null;
  readonly traceId: string | null;
  /** Số giây phải chờ khi bị 429. */
  readonly retryAfter: number | null;

  constructor(init: {
    status: number;
    message: string;
    code?: string | null;
    traceId?: string | null;
    retryAfter?: number | null;
  }) {
    super(init.message);
    this.name = "ApiError";
    this.status = init.status;
    this.code = init.code ?? null;
    this.traceId = init.traceId ?? null;
    this.retryAfter = init.retryAfter ?? null;
  }
}

export async function readApiError(res: Response): Promise<ApiError> {
  const text = await res.text().catch(() => "");
  let body: Record<string, unknown> = {};
  let isJson = false;
  try {
    const parsed: unknown = text ? JSON.parse(text) : null;
    if (parsed && typeof parsed === "object") {
      body = parsed as Record<string, unknown>;
      isJson = true;
    }
  } catch {
    // Không phải JSON (ví dụ 429 văn bản thuần).
  }

  const fieldError =
    body.errors && typeof body.errors === "object" && !Array.isArray(body.errors)
      ? Object.values(body.errors as Record<string, unknown>)
          .flat()
          .find((item): item is string => typeof item === "string")
      : undefined;
  const message =
    [body.detail, fieldError, body.title, isJson ? undefined : text]
      .find((item): item is string => typeof item === "string" && item.trim() !== "") ??
    `HTTP ${res.status}`;
  const retryAfter = Number(res.headers.get("Retry-After"));

  return new ApiError({
    status: res.status,
    message,
    code: typeof body.messageCode === "string" ? body.messageCode : null,
    traceId: typeof body.traceId === "string" ? body.traceId : null,
    retryAfter: Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : null,
  });
}
