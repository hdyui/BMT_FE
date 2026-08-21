import { AdminCrudRoute } from "@/features/admin/routing/AdminCrudRoute";

export default async function AdminQuotationCrudPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  return <AdminCrudRoute module="quotation" segments={segments} />;
}
