"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";

import { ADMIN_ACCESS_COOKIE } from "@/features/admin/lib/auth-config";
import { SERVICE_PAGE_CODES } from "@/features/services/api/spec";
import { API_BASE_PATH, API_ORIGIN } from "@/shared/lib/api/config";
import { publicContentTag } from "@/shared/lib/api/public-content";

/** Các endpoint công khai mà admin được phép xóa cache sau khi lưu. */
const REVALIDATABLE_PATHS = new Set<string>([
  ...SERVICE_PAGE_CODES.map((code) => `/pages/${code}`),
  "/pages/quotation",
  "/pages/capability-profile",
  "/capability-profile/pages",
]);

/**
 * Xóa cache nội dung công khai của một endpoint sau khi admin lưu, để website
 * hiện thay đổi ngay thay vì chờ hết hạn cache. Chỉ chạy khi có phiên admin hợp
 * lệ (hỏi lại backend), tránh bị người ngoài gọi để xả cache liên tục.
 */
export async function revalidatePublicContent(path: string) {
  if (!REVALIDATABLE_PATHS.has(path)) return;

  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) return;

  const session = await fetch(`${API_ORIGIN}${API_BASE_PATH}/auth/me`, {
    headers: { Cookie: `${ADMIN_ACCESS_COOKIE}=${accessToken}` },
    cache: "no-store",
  }).catch(() => null);
  if (!session?.ok) return;

  updateTag(publicContentTag(path));
}
