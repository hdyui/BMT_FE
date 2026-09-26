"use client";

import { createContext, useContext } from "react";

export type ImageUploader = (file: File) => Promise<string>;

/**
 * Cho phép từng khu vực admin bật upload ảnh thật lên backend. Ngoài các khu
 * vực đó (giá trị `null`), `ImageField` giữ cách cũ: chỉ xem trước tạm bằng
 * blob URL.
 */
const ImageUploadContext = createContext<ImageUploader | null>(null);

export const ImageUploadProvider = ImageUploadContext.Provider;

export function useImageUploader() {
  return useContext(ImageUploadContext);
}
