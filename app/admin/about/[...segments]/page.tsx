import { AdminCrudRoute } from "@/features/admin/routing/AdminCrudRoute";

export default async function AdminAboutCrudPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  return <AdminCrudRoute module="about" segments={segments} />;
}
