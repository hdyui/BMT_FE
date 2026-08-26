import type { Metadata } from "next";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { ContentGroupGrid } from "@/features/admin/components/ContentGroupGrid";
import { getResourceFieldCount } from "@/lib/admin/content-pages";
import { adminSettingsGroups } from "@/lib/admin/settings-groups";

export const metadata: Metadata = { title: "Cấu hình website" };

export default function AdminSettingsPage() {
  const totalFieldCount = adminSettingsGroups.reduce(
    (total, group) => total + getResourceFieldCount(group.resourceKey),
    0,
  );

  return (
    <div className="min-w-0 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="pb-6">
          <AdminPageHeader
            eyebrow="Hệ thống"
            title="Cấu hình website"
            description="Thông tin chung hiển thị ở đầu trang và cuối trang của toàn website BMT Decor."
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {totalFieldCount} nội dung có thể chỉnh sửa
          </p>
        </div>
        <ContentGroupGrid
          items={adminSettingsGroups.map((group) => ({
            title: group.title,
            description: group.description,
            count: `${getResourceFieldCount(group.resourceKey)} trường`,
            href: group.href,
          }))}
        />
      </div>
    </div>
  );
}
