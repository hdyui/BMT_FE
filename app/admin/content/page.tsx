import type { Metadata } from "next";

import { ContentWorkspace } from "@/features/admin/content/ContentWorkspace";

export const metadata: Metadata = { title: "Nội dung trang" };

export default function AdminContentPage() {
  return <ContentWorkspace />;
}
