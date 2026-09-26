export type ApiQueryValue = string | number | boolean | null | undefined;

export type ApiQuery = Record<string, ApiQueryValue | ApiQueryValue[]>;

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  query?: ApiQuery;
  token?: string;
  body?: unknown;
}

export interface ApiEnvelope<T> {
  value: T;
  isSuccess: boolean;
  isFailed: boolean;
  error: unknown;
  traceId?: string;
  timestampUtc?: string;
}

export class ApiError<T = unknown> extends Error {
  readonly status: number;
  readonly data: T | undefined;

  constructor(message: string, status: number, data?: T) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? "";

function resolveUrl(path: string, query?: ApiQuery) {
  const isAbsoluteUrl = /^https?:\/\//i.test(path);

  if (!isAbsoluteUrl && !API_BASE_URL && typeof window === "undefined") {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is required for API requests from the server.",
    );
  }

  const url = isAbsoluteUrl
    ? new URL(path)
    : new URL(path, API_BASE_URL || window.location.origin);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== null && item !== undefined) {
            url.searchParams.append(key, String(item));
          }
        });
      } else if (value !== null && value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;

  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(data: unknown, fallback: string) {
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object") {
    const payload = data as { message?: unknown; title?: unknown };
    if (typeof payload.message === "string") return payload.message;
    if (typeof payload.title === "string") return payload.title;
  }
  return fallback;
}

async function request<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { query, token, headers, body, ...requestInit } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const requestHeaders = new Headers(headers);

  requestHeaders.set("Accept", "application/json");
  if (!isFormData && body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  const requestBody: BodyInit | undefined =
    body === undefined
      ? undefined
      : !isFormData && typeof body !== "string"
        ? JSON.stringify(body)
        : (body as BodyInit);

  const response = await fetch(resolveUrl(path, query), {
    ...requestInit,
    body: requestBody,
    credentials: "include",
    headers: requestHeaders,
  });
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, `API request failed with status ${response.status}`),
      response.status,
      data,
    );
  }

  return data as T;
}

export const apiClient = {
  request,
  get<T>(path: string, options?: Omit<ApiRequestOptions, "body" | "method">) {
    return request<T>(path, { ...options, method: "GET" });
  },
  post<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "body" | "method">) {
    return request<T>(path, { ...options, body, method: "POST" });
  },
  put<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "body" | "method">) {
    return request<T>(path, { ...options, body, method: "PUT" });
  },
  patch<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "body" | "method">) {
    return request<T>(path, { ...options, body, method: "PATCH" });
  },
  delete<T>(path: string, options?: Omit<ApiRequestOptions, "body" | "method">) {
    return request<T>(path, { ...options, method: "DELETE" });
  },
};
