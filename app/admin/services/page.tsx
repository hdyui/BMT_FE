import type { Metadata } from "next";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";

export const metadata: Metadata = { title: "Nội dung Dịch vụ" };

export default function AdminServicesPage() {
  return (
    <AdminModuleShell
      title="Nội dung Dịch vụ"
      description="Mỗi service giữ data riêng để bảo toàn đúng cấu trúc và design của public page hiện tại."
      items={[
        {
          title: "Tổng quan dịch vụ",
          description: "Hero cards, service list, quy trình và FAQ.",
          priority: "P1",
          href: "/admin/services/overview",
        },
        {
          title: "Xây dựng trọn gói",
          description:
            "Hero, dự án tiêu biểu, solution cards và process steps riêng.",
          priority: "P1",
          href: "/admin/services/xay-dung-tron-goi",
        },
        {
          title: "Thiết kế KT & Nội thất",
          description: "Hero, gallery, solution, process content và hình ảnh.",
          priority: "P1",
          href: "/admin/services/thiet-ke-kien-truc-noi-that",
        },
        {
          title: "Thi công xây dựng",
          description:
            "Hero, dự án tiêu biểu, process, mobile content và hình ảnh.",
          priority: "P1",
          href: "/admin/services/thi-cong-xay-dung",
        },
        {
          title: "Cải tạo & sửa chữa",
          description:
            "Hero, featured project, solutions, mobile content và hình ảnh.",
          priority: "P1",
          href: "/admin/services/cai-tao-sua-chua",
        },
        {
          title: "FAQ",
          description: "Câu hỏi, câu trả lời, thứ tự và trạng thái hiển thị.",
          priority: "P2",
          href: "/admin/services/overview/faq",
        },
      ]}
      footnote="Các lớp trang trí, hiệu ứng và bố cục được khóa trong source code. Admin chỉ quản lý nội dung và hình ảnh."
    />
  );
}
