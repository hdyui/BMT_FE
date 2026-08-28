import type { Metadata } from "next";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { ContentGroupGrid } from "@/features/admin/components/ContentGroupGrid";
import { getResourceFieldCount } from "@/features/admin/lib/content-pages";
import { adminSettingsGroups } from "@/features/admin/lib/settings-groups";

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
          title="Đầu trang"
          description="Các thành phần dùng chung ở header của toàn website."
          items={getSettingsItems(["settings/branding", "settings/navigation"])}
        />
        <ContentGroupGrid
          title="Đối tác"
          description="Danh sách 6 đối tác dùng chung ở Trang chủ và Giới thiệu."
          items={getSettingsItems(["settings/partners"])}
        />
        <ContentGroupGrid
          title="Cuối trang"
          description="Toàn bộ nội dung Footer được quản lý trong một màn hình duy nhất."
          items={getSettingsItems(["settings/footer"])}
        />
      </div>
    </div>
  );
}

function getSettingsItems(resourceKeys: string[]) {
  return resourceKeys.flatMap((resourceKey) => {
    const group = adminSettingsGroups.find((item) => item.resourceKey === resourceKey);
    if (!group) return [];
    return [{
      title: group.title,
      description: group.description,
      count: `${getResourceFieldCount(group.resourceKey)} trường`,
      href: group.href,
    }];
  });
}
