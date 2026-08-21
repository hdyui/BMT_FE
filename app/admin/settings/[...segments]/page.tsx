import { AdminCrudRoute } from "@/features/admin/routing/AdminCrudRoute";

export default async function AdminSettingsCrudPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  return <AdminCrudRoute module="settings" segments={segments} />;
}
