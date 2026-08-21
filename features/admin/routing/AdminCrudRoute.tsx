import Link from "next/link";
import { CircleAlert } from "lucide-react";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";
import { ResourceEditorPage } from "@/features/admin/components/editor/ResourceEditorPage";
import { ResourceListPage } from "@/features/admin/components/editor/ResourceListPage";
import {
  getAdminResource,
  getAdminResourceGroup,
} from "@/lib/admin/mock-data/resource-registry";
import type { AdminModuleKey } from "@/lib/admin/types/crud";
import { Button } from "@/lib/components/ui/button";

export function AdminCrudRoute({
  module,
  segments,
}: {
  module: AdminModuleKey;
  segments: string[];
}) {
  const fullKey = `${module}/${segments.join("/")}`;
  const group = getAdminResourceGroup(fullKey);

  if (group) {
    return (
      <AdminModuleShell
        title={group.title}
        description={group.description}
        items={group.items}
      />
    );
  }

  const exactResource = getAdminResource(fullKey);
  if (exactResource) {
    return exactResource.kind === "collection" ? (
      <ResourceListPage config={exactResource} />
    ) : (
      <ResourceEditorPage config={exactResource} mode="singleton" />
    );
  }

  const tail = segments.at(-1);
  const resourceKey = `${module}/${segments.slice(0, -1).join("/")}`;
  const parentResource = getAdminResource(resourceKey);

  if (parentResource?.kind === "collection" && tail === "new") {
    return <ResourceEditorPage config={parentResource} mode="create" />;
  }

  if (parentResource?.kind === "collection" && tail) {
    return (
      <ResourceEditorPage
        config={parentResource}
        mode="edit"
        recordId={tail}
      />
    );
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center p-6 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-brand">
          <CircleAlert className="size-5" />
        </span>
        <h1 className="mt-4 text-xl font-bold">Route quản trị chưa tồn tại</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Resource này chưa được khai báo trong Admin Content Registry.
        </p>
        <Button
          className="mt-5"
          nativeButton={false}
          render={<Link href={`/admin/${module}`} />}
        >
          Quay lại module
        </Button>
      </div>
    </div>
  );
}
