"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function BuildingRule({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
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
      <Image
        className={cn(
          "origin-left object-contain object-right transition-[scale] duration-700 ease-out motion-reduce:scale-x-100 motion-reduce:transition-none",
          visible ? "scale-x-100" : "scale-x-0",
          light && "brightness-0 invert",
        )}
        src="/images/home/section-rule.png"
        alt=""
        fill
        sizes="430px"
      />
    </div>
  );
}
