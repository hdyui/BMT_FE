"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

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
  const motionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const motionElement = motionRef.current;
    if (!element || !motionElement) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let fadeAnimation: Animation | undefined;
    let movementAnimation: Animation | undefined;

    const reveal = () => {
      if (prefersReducedMotion || typeof element.animate !== "function") {
        element.style.opacity = "1";
        motionElement.style.removeProperty("transform");
        return;
      }

      fadeAnimation = element.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 420,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards",
      });

      movementAnimation = motionElement.animate(
        [
          { transform: "translate3d(0, 64px, 0)" },
          { transform: "translate3d(0, 0, 0)" },
        ],
        {
          duration: 1050,
          delay: 500 + Math.min(delay, 720),
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        },
      );

      fadeAnimation.onfinish = () => {
        element.style.opacity = "1";
        element.style.willChange = "auto";
        fadeAnimation?.cancel();
      };

      movementAnimation.onfinish = () => {
        motionElement.style.removeProperty("transform");
        motionElement.style.willChange = "auto";
        movementAnimation?.cancel();
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
      fadeAnimation?.cancel();
      movementAnimation?.cancel();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "opacity-0 will-change-[opacity] motion-reduce:opacity-100",
        className,
      )}
      {...props}
    >
      <div
        ref={motionRef}
        className={cn(
          "will-change-transform motion-reduce:transform-none motion-reduce:transition-none",
          motionClassName,
        )}
        style={{ transform: "translate3d(0, 64px, 0)" }}
      >
        {children}
      </div>
    </div>
  );
}
