import type { Metadata } from "next";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";

export const metadata: Metadata = {
  title: "Nội dung Dự án",
};

export default function AdminProjectsPage() {
  return (
    <AdminModuleShell
      title="Nội dung Dự án"
      description="Projects Page Cards, Project Detail và Related Projects tiếp tục là các nhóm dữ liệu độc lập."
      items={[
        { title: "Danh mục", description: "Label và bộ icon Desktop/Mobile riêng của Projects Page.", priority: "P1", count: "4 danh mục", href: "/admin/projects/categories" },
        { title: "Danh sách Projects Page", description: "Card list riêng gồm title, ảnh, category group, slug và thứ tự.", priority: "P1", count: "8 cards mẫu", href: "/admin/projects/list" },
        { title: "Project Details", description: "Thông tin chung, hình ảnh và nội dung chi tiết theo slug.", priority: "P1", count: "1 detail mẫu", href: "/admin/projects/details" },
        { title: "Dự án liên quan", description: "Data riêng, không tự liên kết với list hoặc detail.", priority: "P2", count: "4 items", href: "/admin/projects/related" },
      ]}
    />
  );
}
