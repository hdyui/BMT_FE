import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResourceEditorPage } from "@/features/admin/components/editor/ResourceEditorPage";
import { getAdminResource } from "@/features/admin/lib/mock-data/resource-registry";

export const metadata: Metadata = { title: "Nội dung Hồ sơ năng lực" };

export default function AdminCapabilityProfileContentPage() {
  const config = getAdminResource("settings/capability-profile");
  if (!config) notFound();

  return <ResourceEditorPage config={config} mode="singleton" />;
}
