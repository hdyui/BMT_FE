import type { Metadata } from "next";

import { MediaAssetBrowser } from "@/features/admin/media/MediaAssetBrowser";

export const metadata: Metadata = { title: "Thư viện ảnh" };

export default function AdminMediaPage() {
  return <MediaAssetBrowser />;
}
