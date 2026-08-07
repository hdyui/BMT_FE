"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = React.ComponentProps<"div"> & {
  delay?: number;
  from?: "bottom" | "left" | "right" | "zoom" | "fade";
};

export function Reveal({
  children,
  className,
  delay = 0,
  from = "bottom",
  style,
  ...props
}: RevealProps) {
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
      { threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const hiddenDirection = {
    bottom: "translate-y-8",
    left: "-translate-x-8",
    right: "translate-x-8",
    zoom: "scale-75",
    fade: "",
  }[from];

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,translate,scale] duration-700 ease-out motion-reduce:translate-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none",
        visible
          ? "translate-x-0 translate-y-0 scale-100 opacity-100"
          : cn(hiddenDirection, "opacity-0"),
        className,
      )}
      style={{ transitionDelay: `${Math.min(delay, 1200)}ms`, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
