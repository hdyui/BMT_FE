import { AdminCrudRoute } from "@/features/admin/routing/AdminCrudRoute";

export default async function AdminContactsCrudPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  return <AdminCrudRoute module="contacts" segments={segments} />;
}
