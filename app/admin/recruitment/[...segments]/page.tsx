import { redirect } from "next/navigation";

import { AdminCrudRoute } from "@/features/admin/routing/AdminCrudRoute";

export default async function AdminRecruitmentCrudPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  if (segments.length === 1 && segments[0] === "jobs") {
    redirect("/admin/recruitment");
  }
  return <AdminCrudRoute module="recruitment" segments={segments} />;
}
