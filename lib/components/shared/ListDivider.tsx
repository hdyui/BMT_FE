"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

const {
  props: { srcSet: mobileDividerSrcSet },
} = getImageProps({
  src: "/images/careers/mobile/job-divider-line.png",
  alt: "",
  width: 3612,
  height: 12,
  sizes: "(max-width: 639px) calc(100vw - 36px), 1px",
});

const {
  props: { srcSet: desktopDividerSrcSet, ...desktopDividerProps },
} = getImageProps({
  src: "/images/careers/job-divider.jpg",
  alt: "",
  width: 5010,
  height: 123,
  sizes: "(min-width: 1200px) 1180px, calc(100vw - 36px)",
});

export function ListDivider({ delay = 0 }: { delay?: number }) {
  const dividerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = dividerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={dividerRef}
      className="relative mt-5 aspect-[5010/123] w-full overflow-hidden max-sm:mt-3 max-sm:h-px max-sm:aspect-auto"
      aria-hidden="true"
      data-list-divider
    >
      <picture>
        <source media="(max-width: 639px)" srcSet={mobileDividerSrcSet} />
        <source media="(min-width: 640px)" srcSet={desktopDividerSrcSet} />
        <img
          {...desktopDividerProps}
          alt=""
          className={`absolute inset-0 size-full object-contain transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none max-sm:object-fill ${visible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}`}
          style={{
            transformOrigin: "left center",
            transitionDelay: `${delay}ms`,
          }}
        />
      </picture>
    </div>
  );
}
