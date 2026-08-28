import Link from "next/link";
import { redirect } from "next/navigation";
import { CircleAlert } from "lucide-react";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";
import { ResourceEditorPage } from "@/features/admin/components/editor/ResourceEditorPage";
import { ResourceListPage } from "@/features/admin/components/editor/ResourceListPage";
import { UnifiedResourceEditorPage } from "@/features/admin/components/editor/UnifiedResourceEditorPage";
import {
  getAdminResource,
  getAdminResourceGroup,
} from "@/features/admin/lib/mock-data/resource-registry";
import type { AdminModuleKey } from "@/features/admin/lib/types/crud";
import { Button } from "@/features/admin/components/ui/button";

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
    const directCollectionEditor =
      exactResource.kind === "collection" &&
      exactResource.collectionMode !== "dynamic";

    if (directCollectionEditor) {
      return (
        <UnifiedResourceEditorPage
          config={exactResource}
          companionConfig={
            exactResource.companionResourceKey
              ? getAdminResource(exactResource.companionResourceKey)
              : undefined
          }
        />
      );
    }

    return exactResource.kind === "collection" ? (
      <ResourceListPage
        config={exactResource}
        companionConfig={
          exactResource.companionResourceKey
            ? getAdminResource(exactResource.companionResourceKey)
            : undefined
        }
      />
    ) : (
      <ResourceEditorPage config={exactResource} mode="singleton" />
    );
  }

  const tail = segments.at(-1);
  const resourceKey = `${module}/${segments.slice(0, -1).join("/")}`;
  const parentResource = getAdminResource(resourceKey);

  // Bộ sưu tập cố định có số mục khớp layout website nên không mở đường tạo mới;
  // gõ tay `/new` sẽ quay về trang chỉnh sửa của bộ sưu tập đó.
  if (parentResource?.kind === "collection" && tail === "new") {
    if (parentResource.collectionMode !== "dynamic") {
      redirect(`/admin/${parentResource.module}/${parentResource.path}`);
    }
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
        <h1 className="mt-4 text-xl font-bold">Không tìm thấy trang quản trị</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Trang bạn đang tìm chưa sẵn sàng hoặc đường dẫn không đúng.
        </p>
        <Button
          className="mt-5"
          nativeButton={false}
          render={<Link href={`/admin/${module}`} />}
        >
          Quay lại trang trước
        </Button>
      </div>
    </div>
  );
}
