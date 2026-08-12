"use client";

import Link from "next/link";
import Image from "next/image";
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

export function SiteHeader({
  mobileServiceMockup = false,
}: {
  mobileServiceMockup?: boolean;
} = {}) {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[85px] opacity-85 bg-charcoal text-white shadow-md max-sm:bg-charcoal/85 max-sm:opacity-100">
      <div className="mx-auto flex h-full w-[min(1510px,calc(100%-2.5rem))] items-center gap-5 max-sm:w-[calc(100%-1.5rem)]">
        <BrandLogo
          className={cn(
            "w-[180px] shrink-0 xl:mr-12 xl:w-[210px] 2xl:mr-20 2xl:w-[232px]",
            mobileServiceMockup && "max-md:w-[7.25rem]",
          )}
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
                    "flex items-center text-[16px] font-extrabold whitespace-nowrap transition-colors duration-200 hover:text-brand",
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
                  <div className="invisible absolute top-[85px] left-0 w-[380px] -translate-y-2 overflow-hidden rounded-b-[28px] bg-white text-charcoal opacity-0 shadow-2xl transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((service, index) => (
                      <Link
                        className="flex h-[50px] translate-y-2 items-center gap-4 px-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-charcoal/85 hover:text-white"
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
                        <span className="text-[16px] font-extrabold uppercase leading-none tracking-[-0.015em]">
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
            "ml-auto hidden h-[49px] min-w-[190px] rounded-full bg-orange-500 px-8 text-[16px] font-extrabold text-white shadow-none transition-all duration-300 hover:bg-brand-dark hover:text-white hover:shadow-xl xl:inline-flex",
          )}
          href="/lien-he"
        >
          LIÊN HỆ
        </Link>

        <Sheet>
          <SheetTrigger
            className="ml-auto inline-flex size-10 items-center justify-center rounded-full border border-white/20 xl:hidden max-sm:size-12 max-sm:border-white max-sm:bg-white max-sm:text-charcoal max-sm:shadow-md"
            aria-label="Mở menu"
            style={
              mobileServiceMockup
                ? {
                    backgroundColor: "white",
                    borderColor: "white",
                    color: "#242122",
                  }
                : undefined
            }
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
                        className="block py-4 font-extrabold hover:text-brand"
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
