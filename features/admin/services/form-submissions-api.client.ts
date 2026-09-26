"use client";

import type {
  FormSubmissionItem,
  FormSubmissionStatus,
  FormSubmissionsPage,
} from "@/features/admin/services/catalog-api.types";

type ApiEnvelope<T> = {
  isSuccess?: boolean;
  value?: T;
  message?: string;
};

async function readEnvelope<T>(response: Response) {
  const payload = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | null;

  if (!response.ok || payload?.isSuccess === false) {
    throw new Error(
      payload?.message ?? `Admin API request failed (HTTP ${response.status}).`,
    );
  }

  return payload?.value as T;
}

export const formSubmissionsApiClient = {
  async getList(params: {
    pageIndex?: number;
    pageSize?: number;
    status?: FormSubmissionStatus;
  } = {}) {
    const query = new URLSearchParams({
      pageIndex: String(params.pageIndex ?? 1),
      pageSize: String(params.pageSize ?? 100),
    });
    if (params.status) query.set("status", params.status);

    const response = await fetch(`/api/admin/form-submissions?${query}`, {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });

    return readEnvelope<FormSubmissionsPage>(response);
  },

  async updateStatus(id: string, status: FormSubmissionStatus) {
    const response = await fetch("/api/admin/form-submissions", {
      method: "PATCH",
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    return readEnvelope<FormSubmissionItem>(response);
  },

  async remove(id: string) {
    const response = await fetch("/api/admin/form-submissions", {
      method: "DELETE",
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    return readEnvelope<null>(response);
  },
};
