import { RemoteResourceGate } from "@/features/admin/components/editor/RemoteResourceGate";
import { AdminCrudRoute } from "@/features/admin/routing/AdminCrudRoute";

export default async function AdminSettingsCrudPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  return (
    <RemoteResourceGate resourceKey={`settings/${segments.join("/")}`}>
      <AdminCrudRoute module="settings" segments={segments} />
    </RemoteResourceGate>
  );
}
