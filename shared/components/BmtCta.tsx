import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

type BmtCtaProps = {
  children: ReactNode;
  href: string;
  variant?: "hero" | "compact";
  className?: string;
};

export function BmtCta({
  children,
  href,
  variant = "hero",
  className,
}: BmtCtaProps) {
  const variantClass =
    variant === "hero"
      ? "mt-[1vw] w-[clamp(190px,17.2vw,330px)] p-0 text-[clamp(18px,1.65vw,30px)] font-extrabold leading-[.95] tracking-[-.035em] animate-[fade-in_.85s_.76s_cubic-bezier(.22,1,.36,1)_both] motion-reduce:animate-none max-lg:mt-7 max-lg:w-[min(17rem,84vw)] max-lg:text-2xl"
      : "grid min-h-8 w-[clamp(148px,42vw,172px)] grid-cols-[minmax(0,4fr)_minmax(0,1fr)] p-0 text-[clamp(11px,3.05vw,13px)] font-extrabold shadow-[0_.55rem_1rem_rgb(137_52_8/.28)] transition-[transform,filter,box-shadow] duration-[260ms] ease-out active:shadow-[0_.45rem_.9rem_rgb(137_52_8/.24)] sm:max-lg:min-h-0 sm:max-lg:w-60 sm:max-lg:text-xl";

  const labelClass =
    variant === "hero"
      ? "inline-flex h-full w-4/5 items-center justify-center"
      : "col-start-1 w-full text-center";

  return (
    <Link
      className={cn(
        "relative inline-flex aspect-[1366/291] items-center rounded-full border-0 bg-[url('/images/careers/careers-cta.jpg')] bg-center bg-[length:100%_100%] bg-no-repeat text-center font-semibold leading-none whitespace-nowrap text-white shadow-[0_.75rem_1.45rem_rgb(137_52_8/.30)] [text-shadow:0_1px_1px_rgb(126_42_3/.25)] transition-[filter,box-shadow,transform] duration-300 hover:-translate-y-[5px] hover:scale-[1.02] hover:shadow-[0_1rem_2rem_rgb(137_52_8/.42)] hover:[filter:brightness(1.04)_saturate(1.03)] active:translate-y-0.5 active:scale-[.99] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand",
        variantClass,
        className,
      )}
      href={href}
    >
      <span className={labelClass}>{children}</span>
    </Link>
  );
}
