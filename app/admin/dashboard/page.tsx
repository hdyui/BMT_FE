import type { Metadata } from "next";

import { DashboardView } from "@/features/admin/dashboard/DashboardView";
import { projectContentService } from "@/lib/admin/services/project-content.service";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const projectContent = await projectContentService.getAll();
  return <DashboardView projectContent={projectContent} />;
}
