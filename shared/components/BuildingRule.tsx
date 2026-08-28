"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";

export function BuildingRule({
  className,
  delay = 0,
  light = false,
  fullWidth = false,
  compact = false,
  align = "right",
  src = "/images/home/section-rule.png",
}: {
  className?: string;
  delay?: number;
  light?: boolean;
  fullWidth?: boolean;
  compact?: boolean;
  /** Vị trí neo ảnh khi co theo `object-contain`. Mặc định "right" giữ đúng
   * hành vi cũ; đổi sang "center" cho các ảnh rule vốn được thiết kế để nằm
   * giữa khung (vd. các file có hậu tố "-center"). */
  align?: "right" | "center";
  src?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.4 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-10 w-full max-w-[430px] overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      {fullWidth ? (
        <>
          <span
            className={cn(
              "absolute inset-x-0 bottom-0 h-0.5 origin-left bg-current transition-transform duration-700 ease-out motion-reduce:scale-x-100 motion-reduce:transition-none",
              visible ? "scale-x-100" : "scale-x-0",
            )}
            style={{ transitionDelay: `${Math.min(delay, 600)}ms` }}
          />
          <span
            className={cn(
              compact
                ? "absolute right-0 bottom-0 h-5 w-7 overflow-hidden transition-opacity duration-500 motion-reduce:opacity-100 motion-reduce:transition-none"
                : "absolute right-0 bottom-0 h-10 w-12 overflow-hidden transition-opacity duration-500 motion-reduce:opacity-100 motion-reduce:transition-none",
              visible ? "opacity-100" : "opacity-0",
            )}
            style={{ transitionDelay: `${Math.min(delay + 240, 700)}ms` }}
          >
            <Image
              className={cn(
                compact
                  ? "absolute right-0 bottom-0 h-5 w-auto max-w-none"
                  : "absolute right-0 bottom-0 h-10 w-auto max-w-none",
                light && "brightness-0 invert",
              )}
              src="/images/home/section-rule.png"
              alt=""
              width={1388}
              height={128}
              decoding="sync"
              loading="eager"
              sizes={compact ? "217px" : "434px"}
              unoptimized
            />
          </span>
        </>
      ) : (
        <Image
          className={cn(
            "origin-left object-contain transition-[scale] duration-700 ease-out motion-reduce:scale-x-100 motion-reduce:transition-none",
            align === "center" ? "object-center" : "object-right",
            visible ? "scale-x-100" : "scale-x-0",
            light && "brightness-0 invert",
          )}
          style={{ transitionDelay: `${Math.min(delay, 1500)}ms` }}
          src={src}
          alt=""
          fill
          sizes="430px"
        />
      )}
    </div>
  );
}
