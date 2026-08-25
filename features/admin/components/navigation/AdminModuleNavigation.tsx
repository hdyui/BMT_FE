"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

import type {
  AdminModuleNavigationGroup,
  AdminNavigationContext,
} from "@/lib/admin/types/crud";
import { cn } from "@/lib/utils";

export function AdminModuleNavigation({
  navigation,
  className,
}: {
  navigation?: AdminNavigationContext;
  className?: string;
}) {
  if (!navigation) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <NavigationGroup group={navigation.primary} />
      {navigation.secondary && (
        <NavigationGroup group={navigation.secondary} secondary />
      )}
    </div>
  );
}

function NavigationGroup({
  group,
  secondary,
}: {
  group: AdminModuleNavigationGroup;
  secondary?: boolean;
}) {
  const pathname = usePathname();
  const activeHref = useMemo(
    () =>
      group.items
        .filter(
          (item) =>
            pathname === item.href || pathname.startsWith(`${item.href}/`),
        )
        .sort((a, b) => b.href.length - a.href.length)[0]?.href,
    [group.items, pathname],
  );
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeHref]);

  return (
    <nav aria-label={group.label}>
      <div
        className={cn(
          "admin-scrollbar overflow-x-auto rounded-lg border bg-card p-1.5 shadow-[0_1px_2px_rgb(16_24_40/.03)]",
          secondary && "bg-muted/20",
        )}
      >
        <div className="flex min-w-max items-center gap-1.5">
          {group.items.map((item) => {
            const active = item.href === activeHref;
            return (
              <Link
                ref={active ? activeRef : undefined}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-9 items-center rounded-lg px-3 text-[13px] font-medium whitespace-nowrap text-muted-foreground outline-none transition-[background-color,color,box-shadow] duration-200 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/20 sm:text-sm",
                  active && "bg-brand/10 font-semibold text-brand shadow-[inset_0_0_0_1px_rgb(244_122_42/.06)]",
                  secondary && "h-8 text-xs",
                )}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
