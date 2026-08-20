"use client";

import { useEffect, useRef, useState } from "react";
import { homeStats as stats } from "@/features/home/data/home-content";

function CountUpNumber({
  value,
  delay,
}: {
  value: number;
  delay: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setDisplay(value);
          return;
        }

        const startTimer = window.setTimeout(() => {
          const startedAt = window.performance.now();
          const duration = 1300;

          const update = (now: number) => {
            const progress = Math.min((now - startedAt) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(value * eased));
            if (progress < 1) window.requestAnimationFrame(update);
          };

          window.requestAnimationFrame(update);
        }, delay);

        return () => window.clearTimeout(startTimer);
      },
      { threshold: 0.5 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, value]);

  return (
    <span ref={ref} className="tabular-nums">
      +{display}
    </span>
  );
}

export function CountUpStats() {
  return (
    <div className="mx-auto grid w-[min(1050px,calc(100%-2.25rem))] grid-cols-3 gap-2 text-center sm:grid-cols-3 sm:gap-16">
      {stats.map((stat, index) => (
        <div
          className="group transition-all duration-500 hover:-translate-y-1"
          key={stat.label}
        >
          <strong className="block text-[clamp(2.3rem,11vw,3.4rem)] font-extrabold leading-none tracking-[-0.06em] transition-colors group-hover:text-brand sm:text-[88px] lg:text-[96px]">
            <CountUpNumber value={stat.value} delay={index * 140} />
          </strong>
          <span className="mx-auto mt-3 block max-w-52 border-t-2 border-brand pt-3 text-sm font-extrabold uppercase sm:text-base max-sm:px-1 max-sm:text-[10px] max-sm:leading-tight">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
