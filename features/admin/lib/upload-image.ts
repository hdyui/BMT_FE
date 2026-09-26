import { api } from "@/shared/lib/api/client";

/** Cloudinary (phía backend) từ chối ảnh lớn hơn ~10 MB. */
export const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;

/**
 * Upload ảnh qua backend, trả về URL Cloudinary dùng để lưu vào nội dung.
 * Upload xong chưa tự lưu nội dung trang.
 */
export function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("imageUrl", file);
  return api.post<string>("/admin/upload", form);
}
