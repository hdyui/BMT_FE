"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { buttonVariants } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { navigation } from "@/shared/constants/site";
import { cn } from "@/shared/lib/utils";

const mobileNavigation = [
  ...navigation,
  { label: "LIÊN HỆ", href: "/contact" },
] as const;

export function SiteHeader({
  mobileServiceMockup = false,
}: {
  mobileServiceMockup?: boolean;
} = {}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRouteActive = (href: string, isServiceGroup = false) =>
    isServiceGroup && pathname.startsWith("/services")
      ? true
      : href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[60px] bg-charcoal text-white max-xl:bg-charcoal/90 max-xl:shadow-md max-xl:backdrop-blur-[2px] xl:h-[var(--site-header-desktop-height)]">
      <div className="relative mx-auto flex h-full w-[min(1510px,calc(100%-3.5rem))] items-center max-xl:w-[calc(100%-1.5rem)]">
        <BrandLogo
          className="hidden w-[172px] shrink-0 xl:block 2xl:w-[186px]"
          inverted
        />
        <Link
          className={cn(
            "relative block w-[112px] shrink-0 sm:w-[126px] xl:hidden",
            mobileServiceMockup && "max-md:w-[116px]",
          )}
          href="/"
          aria-label="BMT Decor - Trang chủ"
        >
          <Image
            className="h-auto w-full object-contain"
            src="/images/contact/mobile/header-logo.png"
            alt="BMT Decor"
            width={1066}
            height={186}
            preload
            sizes="(max-width: 639px) 112px, 126px"
          />
        </Link>

        <div className="ml-auto hidden h-full items-center gap-5 xl:flex 2xl:gap-6">
          <nav
            className="flex h-full items-center gap-5 2xl:gap-7"
            aria-label="Điều hướng chính"
          >
            {navigation.map((item) => {
              const isActive = isRouteActive(item.href, "children" in item);
              return (
                <div
                  className="group relative flex h-full items-center"
                  key={item.href}
                >
                  <Link
                    className={cn(
                      "flex items-center text-[14px] font-bold whitespace-nowrap transition-colors duration-200 hover:text-brand",
                      isActive && "text-brand",
                    )}
                    href={item.href}
                  >
                    <span
                      className={cn(
                        "relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300",
                        isActive && "after:scale-x-100",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                  {"children" in item && (
                    <div className="invisible absolute top-full left-0 w-[360px] -translate-y-2 overflow-hidden rounded-b-[24px] bg-white text-charcoal opacity-0 shadow-2xl transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      {item.children.map((service, index) => (
                        <Link
                          className="flex h-[46px] translate-y-2 items-center gap-4 px-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-charcoal/85 hover:text-white"
                          href={service.href}
                          style={{ transitionDelay: `${index * 70}ms` }}
                          key={service.href}
                        >
                          <span className="flex w-9 shrink-0 justify-center">
                            <Image
                              className="max-h-[38px] w-auto object-contain"
                              src={service.icon}
                              alt=""
                              width={48}
                              height={40}
                            />
                          </span>
                          <span className="text-[14px] font-bold uppercase leading-none tracking-[-0.015em]">
                            {service.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <Link
            className={cn(
              buttonVariants({ size: "sm" }),
              "inline-flex h-[42px] min-w-[164px] rounded-full bg-brand px-7 text-[14px] font-bold text-white shadow-none transition-[color,background-color,box-shadow,transform] duration-300 hover:scale-[1.02] hover:bg-brand hover:text-charcoal hover:shadow-[0_2px_6px_rgb(0_0_0/.2)] active:translate-y-0 active:scale-[1.02] active:bg-brand active:text-charcoal active:shadow-[0_1px_4px_rgb(0_0_0/.18)]",
            )}
            href="/contact"
          >
            LIÊN HỆ
          </Link>
        </div>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger
            className="relative ml-auto inline-flex size-9 items-center justify-center rounded-full xl:hidden"
            aria-label="Mở menu"
          >
            <Image
              className="object-contain"
              src="/images/contact/mobile/menu-circle.png"
              alt=""
              fill
              sizes="36px"
              unoptimized
            />
            <Image
              className="relative z-10 h-auto w-[18px] object-contain"
              src="/images/contact/mobile/menu-hamburger.png"
              alt=""
              width={155}
              height={134}
              sizes="18px"
              unoptimized
            />
          </SheetTrigger>
          <SheetContent
            className="w-[88vw] max-w-sm bg-charcoal text-white"
            side="right"
            showCloseButton={false}
          >
            <SheetClose
              className="absolute top-3 right-3 z-10 inline-flex size-9 items-center justify-center rounded-full"
              aria-label="Đóng menu"
            >
              <Image
                className="object-contain"
                src="/images/contact/mobile/menu-circle.png"
                alt=""
                fill
                sizes="36px"
                unoptimized
              />
              <Image
                className="relative z-10 h-auto w-[17px] object-contain"
                src="/images/contact/mobile/menu-close.png"
                alt=""
                width={112}
                height={112}
                sizes="17px"
                unoptimized
              />
            </SheetClose>
            <SheetHeader className="border-b border-white/10">
              <SheetTitle className="text-white">BMT DECOR</SheetTitle>
              <SheetDescription className="text-white/60">
                Điều hướng website
              </SheetDescription>
            </SheetHeader>
            <nav className="grid px-4">
              {mobileNavigation.map((item) => {
                const isActive = isRouteActive(item.href, "children" in item);
                return (
                  <div className="border-b border-white/10" key={item.href}>
                    <Link
                      className={cn(
                        "block py-4 font-bold transition-colors hover:text-brand",
                        isActive && "text-brand",
                      )}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {"children" in item && (
                      <div className="grid pb-3 pl-4">
                        {item.children.map((service) => {
                          const isServiceActive = isRouteActive(service.href);
                          return (
                            <Link
                              className={cn(
                                "py-2 text-sm text-white/65 transition-colors hover:text-brand",
                                isServiceActive && "text-brand",
                              )}
                              href={service.href}
                              aria-current={
                                isServiceActive ? "page" : undefined
                              }
                              onClick={() => setMobileMenuOpen(false)}
                              key={service.href}
                            >
                              {service.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
