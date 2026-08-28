"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/shared/lib/utils";

type TrustCardRevealProps = React.ComponentProps<"div"> & {
  delay?: number;
  motionClassName?: string;
};

export function TrustCardReveal({
  children,
  className,
  delay = 0,
  motionClassName,
  ...props
}: TrustCardRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let revealAnimation: Animation | undefined;

    if (!prefersReducedMotion) {
      element.style.opacity = "0";
      element.style.transform = "translate3d(0, 24px, 0)";
    }

    const reveal = () => {
      if (prefersReducedMotion || typeof element.animate !== "function") {
        element.style.opacity = "1";
        element.style.transform = "none";
        return;
      }

      revealAnimation = element.animate(
        [
          { opacity: 0, transform: "translate3d(0, 24px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ],
        {
          duration: 620,
          delay: Math.min(delay, 420),
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        },
      );

      revealAnimation.onfinish = () => {
        element.style.opacity = "1";
        element.style.transform = "none";
        element.style.willChange = "auto";
        revealAnimation?.cancel();
      };
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        reveal();
        observer.unobserve(entry.target);
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      revealAnimation?.cancel();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "will-change-[opacity,transform] motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "motion-reduce:transform-none motion-reduce:transition-none",
          motionClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
