"use client";

import type { AdminCrudRecord } from "@/features/admin/lib/types/crud";
import type { AdminApiResourceKey } from "@/features/admin/services/catalog-api.types";

type ApiEnvelope<T> = {
  isSuccess?: boolean;
  isFailed?: boolean;
  value?: T;
  message?: string;
};

async function request<T>(method: string, body: unknown) {
  const response = await fetch("/api/admin/catalog", {
    method,
    cache: "no-store",
    signal: AbortSignal.timeout(60_000),
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | null;

  if (!response.ok || !payload || payload.isSuccess === false || payload.isFailed === true) {
    throw new Error(
      payload?.message ?? `Admin API request failed (HTTP ${response.status}).`,
    );
  }

  return payload?.value as T;
}

const client = {
  async getList(resourceKey: AdminApiResourceKey) {
    const response = await fetch(
      `/api/admin/catalog?resourceKey=${encodeURIComponent(resourceKey)}`,
      {
        method: "GET",
        cache: "no-store",
    signal: AbortSignal.timeout(60_000),
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
        },
      },
    );

    const payload = (await response.json().catch(() => null)) as
      | ApiEnvelope<AdminCrudRecord[]>
      | null;

    if (!response.ok || !payload || payload.isSuccess === false || payload.isFailed === true) {
      throw new Error(
        payload?.message ??
          `Admin API request failed (HTTP ${response.status}).`,
      );
    }

    return payload?.value ?? [];
  },

  async getOne(resourceKey: AdminApiResourceKey, id: string) {
    const response = await fetch(
      `/api/admin/catalog?resourceKey=${encodeURIComponent(resourceKey)}&id=${encodeURIComponent(id)}`,
      {
        method: "GET",
        cache: "no-store",
    signal: AbortSignal.timeout(60_000),
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
        },
      },
    );

    const payload = (await response.json().catch(() => null)) as
      | ApiEnvelope<AdminCrudRecord>
      | null;

    if (!response.ok || !payload || payload.isSuccess === false || payload.isFailed === true) {
      throw new Error(
        payload?.message ??
          `Admin API request failed (HTTP ${response.status}).`,
      );
    }

    return payload?.value as AdminCrudRecord;
  },

  create(resourceKey: AdminApiResourceKey, input: AdminCrudRecord) {
    return request<AdminCrudRecord>("POST", { resourceKey, input });
  },

  update(
    resourceKey: AdminApiResourceKey,
    id: string,
    input: AdminCrudRecord,
  ) {
    return request<AdminCrudRecord>("PATCH", { resourceKey, id, input });
  },

  remove(resourceKey: AdminApiResourceKey, id: string) {
    return request<null>("DELETE", { resourceKey, id });
  },

  replace(resourceKey: AdminApiResourceKey, records: AdminCrudRecord[]) {
    return request<AdminCrudRecord[]>("PUT", { resourceKey, records });
  },
};

// Share concurrent GETs (including Strict Mode mounts), never cache writes.
const reads = new Map<string, Promise<unknown>>();
function dedupe<T>(key: string, load: () => Promise<T>): Promise<T> {
  const existing = reads.get(key);
  if (existing) return existing as Promise<T>;
  const request = load().finally(() => { if (reads.get(key) === request) reads.delete(key); });
  reads.set(key, request);
  return request;
}
export const adminCatalogApiClient = {
  ...client,
  getList: (key: AdminApiResourceKey) => dedupe(key, () => client.getList(key)),
  getOne: (key: AdminApiResourceKey, id: string) => dedupe(key + ":" + id, () => client.getOne(key, id)),
};
