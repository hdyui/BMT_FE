import { NextResponse } from "next/server";

import {
  deleteFormSubmission,
  loadFormSubmissions,
  updateFormSubmissionStatus,
} from "@/features/admin/services/catalog-api.server";
import type { FormSubmissionStatus } from "@/features/admin/services/catalog-api.types";

function errorResponse(error: unknown, status = 500) {
  const message =
    error instanceof Error ? error.message : "Unexpected admin API error.";
  const normalizedStatus = message === "Unauthorized." ? 401 : status;
  return NextResponse.json(
    { isSuccess: false, message },
    { status: normalizedStatus },
  );
}

function parseStatus(value: string | null): FormSubmissionStatus | undefined {
  return value === "pending" || value === "done" ? value : undefined;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pageIndex = Number(url.searchParams.get("pageIndex") ?? "1") || 1;
    const pageSize = Number(url.searchParams.get("pageSize") ?? "100") || 100;
    const status = parseStatus(url.searchParams.get("status"));
    const value = await loadFormSubmissions({ pageIndex, pageSize, status });
    return NextResponse.json({ isSuccess: true, value });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: string; status?: string };
    if (!body.id || (body.status !== "pending" && body.status !== "done")) {
      throw new Error("Thiếu id hoặc status hợp lệ.");
    }
    const value = await updateFormSubmissionStatus(body.id, body.status);
    return NextResponse.json({ isSuccess: true, value });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as { id?: string };
    if (!body.id) throw new Error("Thiếu id.");
    await deleteFormSubmission(body.id);
    return NextResponse.json({ isSuccess: true, value: null });
  } catch (error) {
    return errorResponse(error);
  }
}
