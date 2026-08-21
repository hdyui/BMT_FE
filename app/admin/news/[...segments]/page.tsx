import { AdminCrudRoute } from "@/features/admin/routing/AdminCrudRoute";

export default async function AdminNewsCrudPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  return <AdminCrudRoute module="news" segments={segments} />;
}
