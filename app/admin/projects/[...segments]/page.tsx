import { AdminCrudRoute } from "@/features/admin/routing/AdminCrudRoute";

export default async function AdminProjectsCrudPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  return <AdminCrudRoute module="projects" segments={segments} />;
}
