import { NextResponse } from "next/server";

import {
  isAdminApiResourceKey,
  loadAdminApiRecord,
  loadAdminApiResource,
  mutateAdminApiResource,
  replaceAdminApiResource,
} from "@/features/admin/services/catalog-api.server";
import type { AdminCrudRecord } from "@/features/admin/lib/types/crud";
import type { AdminApiResourceKey } from "@/features/admin/services/catalog-api.types";

function errorResponse(error: unknown, status = 500) {
  const message =
    error instanceof Error ? error.message : "Unexpected admin API error.";
  const normalizedStatus = message === "Unauthorized." ? 401 : status;
  return NextResponse.json(
    { isSuccess: false, message },
    { status: normalizedStatus },
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const resourceKey = url.searchParams.get("resourceKey") ?? "";
  if (!isAdminApiResourceKey(resourceKey)) {
    return NextResponse.json(
      { isSuccess: false, message: "Unsupported admin resource." },
      { status: 400 },
    );
  }

  try {
    const id = url.searchParams.get("id");
    const value = id
      ? await loadAdminApiRecord(resourceKey, id)
      : await loadAdminApiResource(resourceKey);
    return NextResponse.json({ isSuccess: true, value });
  } catch (error) {
    return errorResponse(error);
  }
}

async function readMutation(request: Request) {
  const body = (await request.json()) as {
    resourceKey?: string;
    id?: string;
    input?: AdminCrudRecord;
  };

  if (!body.resourceKey || !isAdminApiResourceKey(body.resourceKey)) {
    throw new Error("Unsupported admin resource.");
  }

  return body as {
    resourceKey: AdminApiResourceKey;
    id?: string;
    input?: AdminCrudRecord;
  };
}

export async function POST(request: Request) {
  try {
    const body = await readMutation(request);
    const record = await mutateAdminApiResource({
      resourceKey: body.resourceKey,
      method: "POST",
      input: body.input,
    });
    return NextResponse.json({ isSuccess: true, value: record });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await readMutation(request);
    const record = await mutateAdminApiResource({
      resourceKey: body.resourceKey,
      method: "PATCH",
      id: body.id,
      input: body.input,
    });
    return NextResponse.json({ isSuccess: true, value: record });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await readMutation(request);
    await mutateAdminApiResource({
      resourceKey: body.resourceKey,
      method: "DELETE",
      id: body.id,
    });
    return NextResponse.json({ isSuccess: true, value: null });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      resourceKey?: string;
      records?: AdminCrudRecord[];
    };
    if (!body.resourceKey || !isAdminApiResourceKey(body.resourceKey)) {
      return NextResponse.json(
        { isSuccess: false, message: "Unsupported admin resource." },
        { status: 400 },
      );
    }
    const records = await replaceAdminApiResource(
      body.resourceKey,
      body.records ?? [],
    );
    return NextResponse.json({ isSuccess: true, value: records });
  } catch (error) {
    return errorResponse(error);
  }
}
