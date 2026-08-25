"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { adminNavigation } from "@/lib/admin/constants/navigation";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-2 pb-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="BMT Admin"
              render={<Link href="/admin/dashboard" />}
              onClick={() => isMobile && setOpenMobile(false)}
              className="data-active:bg-sidebar-accent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1!"
            >
              <span className="flex min-w-0 items-baseline gap-2 whitespace-nowrap group-data-[collapsible=icon]:gap-0">
                <span className="text-[27px] font-bold leading-none tracking-[-0.045em] text-brand group-data-[collapsible=icon]:text-[9px] group-data-[collapsible=icon]:tracking-[-0.04em]">
                  BMT
                </span>
                <span className="text-[25px] font-normal leading-none tracking-[-0.035em] text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                  Admin
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="admin-scrollbar">
        {adminNavigation.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="text-[10px] font-semibold tracking-[0.1em] uppercase">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const active =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={item.label}
                        render={<Link href={item.href} />}
                        onClick={() => isMobile && setOpenMobile(false)}
                        className="text-[13px] hover:bg-brand/10 data-active:font-semibold data-active:text-brand data-active:hover:bg-sidebar-accent data-active:hover:text-brand"
                      >
                        <Icon strokeWidth={1.8} />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
