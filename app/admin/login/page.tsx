import type { Metadata } from "next";

import { AdminLoginForm } from "@/features/admin/auth/AdminLoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập khu vực quản trị BMT Decor",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const location = typeof params.next === "string" ? params.next : "";

  return <AdminLoginForm location={location} />;
}