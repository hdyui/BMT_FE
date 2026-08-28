import type { Metadata } from "next";

import { AdminShell } from "@/features/admin/components/AdminShell";
import { AdminThemeProvider } from "@/features/admin/components/AdminThemeProvider";
import { AdminCrudProvider } from "@/features/admin/components/editor/AdminCrudProvider";

export const metadata: Metadata = {
  title: {
    default: "BMT Admin",
    template: "%s | BMT Admin",
  },
  description: "Không gian quản lý nội dung website BMT Decor",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AdminThemeProvider>
      <AdminCrudProvider>
        <AdminShell>{children}</AdminShell>
      </AdminCrudProvider>
    </AdminThemeProvider>
  );
}
