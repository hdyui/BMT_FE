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
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  useEffect(() => {
    const container = tabsRef.current;
    const button = buttonRefs.current[active];
    if (!container || !button) return;

    const updateIndicator = () => {
      const gridItem = button.parentElement;
      if (!gridItem) return;

      setIndicator({
        left: gridItem.offsetLeft + button.offsetLeft,
        width: button.offsetWidth,
      });
    };

    const frame = requestAnimationFrame(updateIndicator);
    const resizeObserver = new ResizeObserver(updateIndicator);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [active]);

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
        ref={tabsRef}
        className="relative grid border-b-4 border-neutral-300 sm:grid-cols-2 lg:grid-cols-4"
        role="tablist"
        aria-label="Các dịch vụ"
      >
        {serviceTabs.map((service, index) => (
          <Reveal delay={index * 110} from="left" key={service.label}>
            <button
              className={cn(
                "w-full px-3 py-4 text-center text-sm font-medium transition-colors duration-300 hover:text-brand",
                index === active && "text-brand",
              )}
              onClick={() => select(index)}
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              aria-selected={index === active}
            >
              {service.label.toUpperCase()}
            </button>
          </Reveal>
        ))}

        {/* Một gạch chân duy nhất trượt sang tab được chọn thay vì thu về 0
            rồi phóng lại ở tab mới. */}
        {indicator.width > 0 && (
          <span
            className="pointer-events-none absolute -bottom-1 h-1 bg-brand transition-[left,width] duration-500 ease-out"
            style={indicator}
            aria-hidden="true"
          />
        )}
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
            <span className="block text-7xl leading-none font-extrabold text-neutral-400">
              {String(shown + 1).padStart(2, "0")}.
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mt-3 text-4xl font-extrabold uppercase">
              {detail.label}
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-3 text-md font-extrabold max-w-fit">{detail.tagline}</p>
            <span className="mt-5 mb-2 block h-0.5 w-36 bg-brand" />
            <p className="text-base leading-relaxed text-pretty">{detail.copy}</p>
          </Reveal>
        </div>
      </div>
    </>
  );
}
