import { redirect } from "next/navigation";

import { AdminCrudRoute } from "@/features/admin/routing/AdminCrudRoute";

const contentPageByService: Record<string, string> = {
  overview: "services-overview",
  "xay-dung-tron-goi": "turnkey",
  "thiet-ke-kien-truc-noi-that": "design",
  "thi-cong-xay-dung": "construction",
  "cai-tao-sua-chua": "renovation",
};

export default async function AdminServicesCrudPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  if (segments.join("/") === "overview/hero-content") {
    redirect("/admin/services/overview/hero-cards");
  }
  if (segments.length === 1 && contentPageByService[segments[0]]) {
    redirect(`/admin/content/${contentPageByService[segments[0]]}`);
  }
  return <AdminCrudRoute module="services" segments={segments} />;
}
