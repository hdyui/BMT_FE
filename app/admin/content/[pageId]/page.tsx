import type { Metadata } from "next";

import { ContentWorkspace } from "@/features/admin/content/ContentWorkspace";

export const metadata: Metadata = { title: "Nội dung trang" };

export default async function AdminContentDetailPage({ params }: PageProps<"/admin/content/[pageId]">) {
  const { pageId } = await params;
  return <ContentWorkspace selectedId={pageId} />;
}
