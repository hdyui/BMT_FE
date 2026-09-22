import { redirect } from "next/navigation";

import { ProjectEditorPage } from "@/features/admin/projects/ProjectEditorPage";
import { ResourceEditorPage } from "@/features/admin/components/editor/ResourceEditorPage";
import { AdminCrudRoute } from "@/features/admin/routing/AdminCrudRoute";
import { getAdminResource } from "@/features/admin/lib/mock-data/resource-registry";

export default async function AdminProjectsCrudPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;

  if (segments[0] === "list-section-content") {
    redirect("/admin/projects");
  }

  if (segments[0] === "list") {
    const suffix = segments.slice(1).join("/");
    redirect(suffix ? `/admin/projects/${suffix}` : "/admin/projects");
  }

  if (segments[0] === "details" && segments.length === 2 && segments[1] !== "new") {
    return <ProjectEditorPage recordId={segments[1]} detailRoute />;
  }

  const directResource = getAdminResource(`projects/${segments[0]}`);
  if (!directResource && segments.length === 1) {
    if (segments[0] !== "new") return <ProjectEditorPage recordId={segments[0]} />;
    const listConfig = getAdminResource("projects/list");
    return (
      <ResourceEditorPage
        config={listConfig}
        mode={segments[0] === "new" ? "create" : "edit"}
        recordId={segments[0] === "new" ? undefined : segments[0]}
        baseHref="/admin/projects"
      />
    );
  }

  return <AdminCrudRoute module="projects" segments={segments} />;
}
