import type { Metadata } from "next";

import { ResourceListPage } from "@/features/admin/components/editor/ResourceListPage";
import { getAdminResource } from "@/features/admin/lib/mock-data/resource-registry";

export const metadata: Metadata = { title: "Nội dung Tin tức" };

export default function AdminNewsPage() {
  return <ResourceListPage config={getAdminResource("news/list")} />;
}
