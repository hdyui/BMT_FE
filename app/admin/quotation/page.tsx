import type { Metadata } from "next";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";

export const metadata: Metadata = { title: "Nội dung Báo giá" };

export default function AdminQuotationPage() {
  return (
    <AdminModuleShell
      title="Nội dung Báo giá"
      description="Quản lý local content cho bảng giá và công cụ ước tính. Logic tính toán vẫn do developer kiểm soát."
      items={[
        {
          title: "Pricing Rule",
          description: "Tên dịch vụ, mức giá thấp và mức giá cao.",
          priority: "P1",
          href: "/admin/quotation/pricing-rules",
        },
        {
          title: "Estimator Content",
          description:
            "Nhãn bước, heading, instruction, placeholder và các option hiển thị.",
          priority: "P1",
          href: "/admin/quotation/estimator",
        },
      ]}
      footnote="Yêu cầu báo giá chưa được lưu tập trung, vì vậy bản này không hiển thị một danh sách yêu cầu giả."
    />
  );
}
