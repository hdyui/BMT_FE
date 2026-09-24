import type { Metadata } from "next";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { ContactSubmissionsPanel } from "@/features/admin/dashboard/ContactSubmissionsPanel";

export const metadata: Metadata = {
  title: "Khách hàng liên hệ",
};

export default function ContactSubmissionsPage() {
  return (
    <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Khách hàng liên hệ"
        description="Danh sách thông tin người dùng gửi từ biểu mẫu liên hệ trên toàn bộ website."
      />

      <div className="mt-7">
        <ContactSubmissionsPanel />
      </div>
    </div>
  );
}