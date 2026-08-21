import type { Metadata } from "next";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";

export const metadata: Metadata = { title: "Nội dung Tuyển dụng" };

export default function AdminRecruitmentPage() {
  return (
    <AdminModuleShell
      title="Nội dung Tuyển dụng"
      description="Quản lý nội dung Career Hero và danh sách vị trí theo layout Job Card có sẵn."
      items={[
        {
          title: "Career Hero",
          description: "Tiêu đề, mô tả và các hero image đang sử dụng.",
          priority: "P2",
          href: "/admin/recruitment/hero",
        },
        {
          title: "Career Jobs",
          description:
            "Tên vị trí, phòng ban, địa điểm, lịch làm việc, thu nhập, trách nhiệm và phúc lợi.",
          priority: "P2",
          href: "/admin/recruitment/jobs",
        },
      ]}
    />
  );
}
