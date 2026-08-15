"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = React.ComponentProps<"div"> & {
  delay?: number;
  duration?: number;
  distance?: "normal" | "long";
  from?: "bottom" | "left" | "right" | "zoom" | "fade";
};

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 700,
  distance = "normal",
  from = "bottom",
  style,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      const fallbackTimer = globalThis.setTimeout(() => setVisible(true), 0);
      return () => globalThis.clearTimeout(fallbackTimer);
    }

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

  const useLongDistance = distance === "long";
  const hiddenDirection = {
    bottom: useLongDistance ? "translate-y-14" : "translate-y-8",
    left: useLongDistance ? "-translate-x-14" : "-translate-x-8",
    right: useLongDistance ? "translate-x-14" : "translate-x-8",
    zoom: "scale-75",
    fade: "",
  }[from];
  const visibleState =
    from === "fade"
      ? "opacity-100"
      : "translate-x-0 translate-y-0 scale-100 opacity-100";

  return (
    <div
      ref={ref}
      data-visible={visible}
      className={cn(
        "transition-[opacity,translate,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none",
        visible ? visibleState : cn(hiddenDirection, "opacity-0"),
        className,
      )}
      style={{
        transitionDelay: `${Math.min(delay, 1500)}ms`,
        transitionDuration: `${Math.min(duration, 2000)}ms`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
