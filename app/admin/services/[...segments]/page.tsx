import { AdminCrudRoute } from "@/features/admin/routing/AdminCrudRoute";

export default async function AdminServicesCrudPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  return <AdminCrudRoute module="services" segments={segments} />;
}
