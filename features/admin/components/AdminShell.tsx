"use client";

import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const routeDepth = pathname.split("/").filter(Boolean).length;
  const projectContentEditorWithoutSidebar = [
    "/admin/projects/page-hero",
    "/admin/projects/details",
    "/admin/projects/related",
    "/admin/projects/related-section-content",
  ].some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const contentEditorWithoutSidebar =
    (pathname.startsWith("/admin/home/") && routeDepth >= 3) ||
    (pathname.startsWith("/admin/about/") && routeDepth >= 3) ||
    (pathname.startsWith("/admin/contacts/") && routeDepth >= 3) ||
    projectContentEditorWithoutSidebar ||
    (pathname.startsWith("/admin/news/") &&
      !pathname.startsWith("/admin/news/list")) ||
    (pathname.startsWith("/admin/recruitment/") &&
      !pathname.startsWith("/admin/recruitment/jobs")) ||
    [
      "/admin/settings/branding",
      "/admin/settings/navigation",
      "/admin/settings/footer",
      "/admin/settings/locations",
      "/admin/settings/company",
    ].some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const fullWidthEditor =
    contentEditorWithoutSidebar ||
    (pathname.startsWith("/admin/services/") && routeDepth >= 4) ||
    (pathname.startsWith("/admin/quotation/") && routeDepth >= 3) ||
    (pathname.startsWith("/admin/capability-profile/") && routeDepth >= 3) ||
    pathname === "/admin/settings/capability-profile";

  return (
    <SidebarProvider
      defaultOpen
      className="admin-shell min-h-dvh overflow-x-clip bg-background text-foreground"
    >
      {!fullWidthEditor && <AppSidebar />}
      <SidebarInset className="min-h-dvh min-w-0">
        <AdminHeader hideNavigation={fullWidthEditor} />
        <div className="min-w-0 flex-1 pt-16">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
