import type { Metadata } from "next";

import { DashboardView } from "@/features/admin/dashboard/DashboardView";
import { projectContentService } from "@/features/admin/services/project-content.service";

export const metadata: Metadata = {
  title: "Tổng quan",
};

export default async function DashboardPage() {
  const projectContent = await projectContentService.getAll();
  return <DashboardView projectContent={projectContent} />;
}
