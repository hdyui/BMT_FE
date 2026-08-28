import type { Metadata } from "next";

import { ResourceListPage } from "@/features/admin/components/editor/ResourceListPage";
import { getAdminResource } from "@/features/admin/lib/mock-data/resource-registry";

export const metadata: Metadata = {
  title: "Nội dung Dự án",
};

export default function AdminProjectsPage() {
  return (
    <ResourceListPage
      config={getAdminResource("projects/list")}
      baseHref="/admin/projects"
    />
  );
}
