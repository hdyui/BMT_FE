import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/shared/lib/api/server";

export async function POST(request: Request) {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    return NextResponse.json(
      { message: "API base URL is not configured." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" ||
      !("customerName" in body) || typeof body.customerName !== "string" || !body.customerName.trim() ||
      !("phone" in body) || typeof body.phone !== "string" || !body.phone.trim()) {
    return NextResponse.json({ message: "Vui lòng nhập tên và số điện thoại." }, { status: 400 });
  }

  try {
    const response = await fetch(`${apiBaseUrl}/form-submissions`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerName: body.customerName.trim(), phone: body.phone.trim() }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (response.status === 204) return new Response(null, { status: 204 });
    const responseBody = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    return NextResponse.json(
      typeof responseBody === "string"
        ? { message: responseBody }
        : responseBody,
      { status: response.status },
    );
  } catch {
    return NextResponse.json(
      { message: "Không thể kết nối tới máy chủ. Vui lòng thử lại." },
      { status: 502 },
    );
  }
}
