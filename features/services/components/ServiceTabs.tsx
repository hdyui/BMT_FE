"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/lib/components/shared/Reveal";
import { serviceTabs } from "@/features/services/data/overview";
import { cn } from "@/lib/utils";

const FADE_DURATION = 240;

export function ServiceTabs() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const [faded, setFaded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function select(index: number) {
    if (index === active) return;
    setActive(index);
    setFaded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setShown(index);
      setFaded(false);
    }, FADE_DURATION);
  }

  const detail = serviceTabs[shown];

  return (
    <>
      <div
        className="grid border-b-4 border-neutral-300 sm:grid-cols-2 lg:grid-cols-4"
        role="tablist"
        aria-label="Các dịch vụ"
      >
        {serviceTabs.map((service, index) => (
          <Reveal delay={index * 110} from="left" key={service.label}>
            <button
              className={cn(
                "relative w-full px-3 py-4 text-center text-sm font-medium transition-colors duration-300 hover:text-brand",
                "after:absolute after:inset-x-0 after:-bottom-1 after:h-1 after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-out",
                index === active && "text-brand after:scale-x-100",
              )}
              onClick={() => select(index)}
              type="button"
              role="tab"
              aria-selected={index === active}
            >
              {service.label.toUpperCase()}
            </button>
          </Reveal>
        ))}
      </div>

      <div
        className={cn(
          "grid items-center gap-12 pt-12 transition-opacity ease-out lg:grid-cols-2 lg:gap-20",
          faded ? "opacity-0 duration-200" : "opacity-100 duration-500",
        )}
      >
        <Reveal className="group" from="left">
          <Image
            className="h-auto w-full drop-shadow-md transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.03] group-hover:drop-shadow-2xl"
            src={detail.image}
            alt={detail.label}
            width={1600}
            height={1093}
            sizes="(max-width: 1024px) 92vw, 46vw"
            priority
          />
        </Reveal>

        <div className="max-w-[510px]">
          <Reveal from="left">
            <span className="block text-7xl leading-none font-light text-neutral-400">
              {String(shown + 1).padStart(2, "0")}.
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mt-3 text-4xl font-normal uppercase">
              {detail.label}
            </h2>
            <p className="mt-3 text-sm">{detail.tagline}</p>
            <span className="mt-5 mb-2 block h-0.5 w-36 bg-brand" />
            <p className="text-base leading-relaxed text-pretty">{detail.copy}</p>
          </Reveal>
        </div>
      </div>
    </>
  );
}
