"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/lib/components/shared/BrandLogo";
import { buttonVariants } from "@/lib/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/lib/components/ui/sheet";
import { navigation } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[85px] bg-charcoal text-white shadow-md">
      <div className="mx-auto flex h-full w-[min(1510px,calc(100%-2.5rem))] items-center gap-5">
        <BrandLogo
          className="w-[180px] shrink-0 xl:mr-12 xl:w-[210px] 2xl:mr-20 2xl:w-[232px]"
          inverted
        />

        <nav
          className="hidden h-full items-center gap-6 xl:flex 2xl:gap-8"
          aria-label="Điều hướng chính"
        >
          {navigation.map((item) => {
            const isActive =
              "children" in item && pathname.startsWith("/dich-vu")
                ? true
                : item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

            return (
              <div
                className="group relative flex h-full items-center"
                key={item.href}
              >
                <Link
                  className={cn(
                    "flex items-center text-[11px] font-semibold whitespace-nowrap transition-colors duration-200 hover:text-brand",
                    isActive && "text-brand",
                  )}
                  href={item.href}
                >
                  <span
                    className={cn(
                      "relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:after:scale-x-100",
                      isActive && "after:scale-x-100",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
                {"children" in item && (
                  <div className="invisible absolute top-16 left-1/2 w-72 -translate-x-1/2 -translate-y-2 rounded-b-xl bg-white p-2 text-charcoal opacity-0 shadow-2xl transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((service, index) => {
                      const isCurrentService = pathname === service.href;

                      return (
                        <Link
                          className={cn(
                            "group/service flex translate-y-2 items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold opacity-0 transition-[color,background-color,opacity,translate] duration-300 group-hover:translate-y-0 group-hover:opacity-100",
                            isCurrentService
                              ? "bg-charcoal text-white"
                              : "hover:bg-neutral-100 hover:text-brand",
                          )}
                          href={service.href}
                          style={{ transitionDelay: `${index * 70}ms` }}
                          key={service.href}
                        >
                          {/* Icon của mục đang chọn luôn cam như mockup; các
                              mục còn lại đổi đen sang cam khi hover. */}
                          <span
                            className={cn(
                              "size-5 shrink-0 transition-colors duration-300",
                              isCurrentService
                                ? "bg-brand"
                                : "bg-charcoal group-hover/service:bg-brand",
                            )}
                            style={{
                              maskImage: `url(${service.icon})`,
                              maskPosition: "center",
                              maskRepeat: "no-repeat",
                              maskSize: "contain",
                              WebkitMaskImage: `url(${service.icon})`,
                              WebkitMaskPosition: "center",
                              WebkitMaskRepeat: "no-repeat",
                              WebkitMaskSize: "contain",
                            }}
                            aria-hidden="true"
                          />
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

        <Link
          className={cn(
            buttonVariants({ size: "sm" }),
            "ml-auto hidden h-[49px] min-w-[190px] rounded-full bg-brand px-8 text-[16px] font-extrabold text-white shadow-none transition-all duration-300 hover:bg-brand-dark hover:text-white hover:shadow-xl xl:inline-flex",
          )}
          href="/lien-he"
        >
          LIÊN HỆ
        </Link>

        <Sheet>
          <SheetTrigger
            className="ml-auto inline-flex size-10 items-center justify-center rounded-full border border-white/20 xl:hidden"
            aria-label="Mở menu"
          >
            <Menu />
          </SheetTrigger>
          <SheetContent
            className="w-[88vw] max-w-sm bg-charcoal text-white"
            side="right"
          >
            <SheetHeader className="border-b border-white/10">
              <SheetTitle className="text-white">BMT DECOR</SheetTitle>
              <SheetDescription className="text-white/60">
                Điều hướng website
              </SheetDescription>
            </SheetHeader>
            <nav className="grid px-4">
              {navigation.map((item) => (
                <div className="border-b border-white/10" key={item.href}>
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link
                        className="block py-4 hover:text-brand"
                        href={item.href}
                      />
                    }
                  >
                    {item.label}
                  </SheetClose>
                  {"children" in item && (
                    <div className="grid pb-3 pl-4">
                      {item.children.map((service) => (
                        <SheetClose
                          nativeButton={false}
                          render={
                            <Link
                              className="py-2 text-sm text-white/65 hover:text-brand"
                              href={service.href}
                            />
                          }
                          key={service.href}
                        >
                          {service.label}
                        </SheetClose>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
