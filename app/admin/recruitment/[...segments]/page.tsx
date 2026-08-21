import { AdminCrudRoute } from "@/features/admin/routing/AdminCrudRoute";

export default async function AdminRecruitmentCrudPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  return <AdminCrudRoute module="recruitment" segments={segments} />;
}
