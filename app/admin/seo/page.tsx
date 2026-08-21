import type { Metadata } from "next";

import { AdminModuleShell } from "@/features/admin/components/AdminModuleShell";

export const metadata: Metadata = { title: "SEO" };

export default function AdminSeoPage() {
  return (
    <AdminModuleShell
      title="SEO"
      description="Quản lý metadata dạng content, không expose implementation detail hoặc style."
      items={[
        {
          title: "Global SEO",
          description: "Site name, title, description và OG image.",
          priority: "P2",
          href: "/admin/seo/global",
        },
        {
          title: "Page SEO",
          description:
            "Meta title, meta description, OG image và slug khi page hỗ trợ.",
          priority: "P2",
          href: "/admin/seo/pages",
        },
      ]}
    />
  );
}
