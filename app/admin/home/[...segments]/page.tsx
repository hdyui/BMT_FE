import { AdminCrudRoute } from "@/features/admin/routing/AdminCrudRoute";
import { redirect } from "next/navigation";

export default async function AdminHomeCrudPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  if (segments[0] === "featured-projects") {
    redirect("/admin/projects");
  }
  return <AdminCrudRoute module="home" segments={segments} />;
}
