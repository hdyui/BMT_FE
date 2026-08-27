"use client";

import Image from "next/image";
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
              tooltip="BMT Decor Admin"
              render={
                <Link
                  href="/admin/dashboard"
                  aria-label="BMT Decor Admin - Tổng quan"
                />
              }
              onClick={() => isMobile && setOpenMobile(false)}
              className="h-11 justify-start rounded-lg px-3 hover:bg-transparent hover:text-inherit active:bg-transparent active:text-inherit focus-visible:ring-0 data-open:hover:bg-transparent data-open:hover:text-inherit data-active:bg-transparent data-active:text-inherit group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1!"
            >
              <span className="flex h-8 w-[174px] shrink-0 items-center overflow-hidden group-data-[collapsible=icon]:w-[29px]">
                <Image
                  className="h-[29px] w-auto max-w-none shrink-0 object-contain object-left"
                  src="/images/cai-tao-sua-chua/logo.png"
                  alt="BMT Decor"
                  width={1196}
                  height={207}
                  sizes="174px"
                  priority
                />
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
              <SidebarMenu className="gap-1">
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
                        className="h-9 px-3 text-[13px] hover:bg-brand/10 data-active:font-semibold data-active:text-brand data-active:hover:bg-sidebar-accent data-active:hover:text-brand group-data-[collapsible=icon]:px-2!"
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
