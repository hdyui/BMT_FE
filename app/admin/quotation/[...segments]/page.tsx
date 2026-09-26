import { RemoteResourceGate } from "@/features/admin/components/editor/RemoteResourceGate";
import { AdminCrudRoute } from "@/features/admin/routing/AdminCrudRoute";

export default async function AdminQuotationCrudPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  return (
    <RemoteResourceGate resourceKey={`quotation/${segments.join("/")}`}>
      <AdminCrudRoute module="quotation" segments={segments} />
    </RemoteResourceGate>
  );
}
