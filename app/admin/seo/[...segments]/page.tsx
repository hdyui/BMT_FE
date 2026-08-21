import { AdminCrudRoute } from "@/features/admin/routing/AdminCrudRoute";

export default async function AdminSeoCrudPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  return <AdminCrudRoute module="seo" segments={segments} />;
}
