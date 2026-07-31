"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 15, label: "Năm kinh nghiệm" },
  { value: 500, label: "Dự án đã triển khai" },
  { value: 60, label: "Nhân sự" },
] as const;

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
    <div className="mx-auto grid w-[min(900px,calc(100%-2.25rem))] grid-cols-1 gap-8 text-center sm:grid-cols-3">
      {stats.map((stat, index) => (
        <div
          className="group transition-all duration-500 hover:-translate-y-1"
          key={stat.label}
        >
          <strong className="block text-6xl font-black transition-colors group-hover:text-brand sm:text-7xl">
            <CountUpNumber value={stat.value} delay={index * 140} />
          </strong>
          <span className="mx-auto mt-3 block max-w-48 border-t-2 border-brand pt-3 text-xs font-bold uppercase">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
