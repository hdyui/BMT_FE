import type { Metadata } from "next";

import { ResourceListPage } from "@/features/admin/components/editor/ResourceListPage";
import { getAdminResource } from "@/features/admin/lib/mock-data/resource-registry";

export const metadata: Metadata = { title: "Nội dung Tuyển dụng" };

export default function AdminRecruitmentPage() {
  return <ResourceListPage config={getAdminResource("recruitment/jobs")} />;
}
