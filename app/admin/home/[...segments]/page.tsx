import { AdminCrudRoute } from "@/features/admin/routing/AdminCrudRoute";

export default async function AdminHomeCrudPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  return <AdminCrudRoute module="home" segments={segments} />;
}
