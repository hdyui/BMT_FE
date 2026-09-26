import "server-only";
import { cache } from "react";
import { publicApiTag } from "./cache-tags";

export function getApiBaseUrl() {
  const raw = process.env.API_CLIENT?.trim();
  if (!raw) return null;
  let base = raw.replace(/\/swagger\/index\.html\/?$/i, "").replace(/\/$/, "");
  if (!/\/api\/v1$/i.test(base)) base += "/api/v1";
  return base;
}

export class PublicApiError extends Error {
  constructor(public status: number, path: string) {
    super(`Public API ${path} failed (HTTP ${status}).`);
  }
}

// Deduplicate within a render; cache only anonymous public GETs across requests.
export const getPublicApiValue = cache(async (path: string): Promise<unknown> => {
  const base = getApiBaseUrl();
  if (!base) throw new Error("API_CLIENT is not configured.");
  const response = await fetch(base + path, {
    headers: { Accept: "application/json" },
    cache: "force-cache",
    next: { revalidate: 60, tags: [publicApiTag(path)] },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new PublicApiError(response.status, path);
  if (response.status === 204) return null;
  const body = await response.json();
  if (body?.isSuccess === false || body?.isFailed === true) throw new PublicApiError(502, path);
  return body && typeof body === "object" && "value" in body ? body.value : body;
});
