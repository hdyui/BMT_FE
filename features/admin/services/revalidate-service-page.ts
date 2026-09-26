"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";

import { ADMIN_ACCESS_COOKIE } from "@/features/admin/lib/auth-config";
import { SERVICE_PAGE_CODES, type ServicePageCode } from "@/features/services/api/spec";
import { serviceContentTag } from "@/features/services/api/tags";
import { API_BASE_PATH, API_ORIGIN } from "@/shared/lib/api/config";

/**
 * Xóa cache nội dung công khai của một trang dịch vụ sau khi admin lưu, để
 * website hiện thay đổi ngay thay vì chờ hết hạn cache. Chỉ chạy khi có phiên
 * admin hợp lệ (hỏi lại backend), tránh bị người ngoài gọi để xả cache liên tục.
 */
export async function revalidateServicePage(pageCode: ServicePageCode) {
  if (!SERVICE_PAGE_CODES.includes(pageCode)) return;

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) return;

  const session = await fetch(`${API_ORIGIN}${API_BASE_PATH}/auth/me`, {
    headers: { Cookie: `${ADMIN_ACCESS_COOKIE}=${accessToken}` },
    cache: "no-store",
  }).catch(() => null);
  if (!session?.ok) return;

  updateTag(serviceContentTag(pageCode));
}
