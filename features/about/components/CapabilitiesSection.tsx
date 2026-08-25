"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { aboutCapabilities as capabilities } from "@/features/about/data/about-content";

export function CapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCapability, setHoveredCapability] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.16 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="overflow-hidden bg-white py-24 max-sm:py-12 sm:py-28 lg:py-32"
      id="nang-luc"
      ref={sectionRef}
    >
      <svg className="absolute size-0" aria-hidden="true">
        <defs>
          <filter id="turnkey-line-orange" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.957
                      0 0 0 0 0.478
                      0 0 0 0 0.165
                      0 1.916 0 0 -0.916"
            />
          </filter>
        </defs>
      </svg>

      <div className="mx-auto w-[calc(100%-1.25rem)] sm:w-[min(1380px,calc(100%-2.25rem))]">
        <div className="mx-auto flex flex-col items-center text-center">
          <h2
            className={`whitespace-nowrap text-4xl sm:text-5xl font-extrabold uppercase leading-none tracking-[-0.025em] text-charcoal transition-[opacity,translate] duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 max-sm:text-[24px] ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-16 opacity-0"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            Năng lực nổi bật
          </h2>

          <div
            className={`relative mt-5 h-7 w-full max-w-[390px] origin-left transition-[opacity,scale] duration-800 ease-out motion-reduce:scale-x-100 motion-reduce:opacity-100 max-sm:mt-2 max-sm:h-4 max-sm:max-w-[140px] ${
              isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            }`}
            style={{ transitionDelay: "340ms" }}
            aria-hidden="true"
          >
            <Image
              className="object-contain"
              src="/images/home/section-rule.png"
              alt=""
              fill
              sizes="390px"
            />
          </div>
        </div>

        <div className="mt-7 grid gap-y-2 sm:hidden">
          {capabilities.map(
            (
              {
                number,
                title,
                mobileTitle,
                description,
                normalImage,
                mobileSymbolClass,
              },
              index,
            ) => (
              <article
                className={`grid grid-cols-[clamp(5.5rem,23vw,6rem)_minmax(0,1fr)] items-start gap-x-[10px] transition-[opacity,translate] duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-16 opacity-0"
                }`}
                style={{ transitionDelay: `${520 + index * 150}ms` }}
                key={`mobile-${number}`}
              >
                <div className="relative col-start-1 row-start-1 size-[clamp(5.5rem,23vw,6rem)] self-center justify-self-center overflow-hidden rounded-full bg-white">
                  {index === 0 ? (
                    <Image
                      className="object-contain"
                      src={normalImage}
                      alt=""
                      fill
                      sizes="(max-width: 417px) 23vw, 96px"
                    />
                  ) : (
                    <>
                      <Image
                        className="object-contain"
                        src="/images/about/source/capability-ring.png"
                        alt=""
                        fill
                        sizes="(max-width: 417px) 23vw, 96px"
                      />
                      <Image
                        className={`object-contain ${mobileSymbolClass ?? ""}`}
                        src={normalImage}
                        alt=""
                        fill
                        sizes="(max-width: 417px) 48px, 52px"
                      />
                    </>
                  )}
                </div>

                <div className="col-start-2 row-start-1 min-w-0">
                  <span className="block text-[32px] font-extrabold leading-none tabular-nums text-brand">
                    {index === capabilities.length - 1 ? "01" : number}
                  </span>
                  <div
                    className="mt-1.5 flex w-[60px] items-center"
                    aria-hidden="true"
                  >
                    <span className="size-[5px] shrink-0 rounded-full bg-charcoal" />
                    <span className="h-px flex-1 bg-charcoal" />
                  </div>
                  <h3 className="mt-2 text-[clamp(15.5px,3.85vw,17px)] font-extrabold leading-[1.2] text-brand">
                    {mobileTitle ?? title}
                  </h3>
                  <p className="mt-1.5 text-justify text-[clamp(13px,3.15vw,14px)] leading-[1.35] text-neutral-700 [text-align-last:left] [text-justify:inter-character]">
                    {description}
                  </p>
                </div>

                {index < capabilities.length - 1 && (
                  <svg
                    className="col-start-1 row-start-2 mt-1.5 h-3 w-7 justify-self-center overflow-visible text-brand"
                    viewBox="0 0 28 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 2L14 10L26 2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </article>
            ),
          )}
        </div>

        <div className="mt-14 hidden gap-x-8 gap-y-14 sm:grid sm:grid-cols-2 lg:mt-16 xl:grid-cols-4">
          {capabilities.map(
            (
              {
                number,
                title,
                description,
                normalImage,
                hoverImage,
                symbolClass,
                hoverSymbolClass,
                extractWhiteArtwork,
                hoverComposite,
                mobileTitle,
              },
              index,
            ) => {
              const isHovered = hoveredCapability === index;
              const [titleLead, ...titleRest] = title.split(" ");
              const [mobileTitleLead, ...mobileTitleRest] = (
                mobileTitle ?? title
              ).split(" ");

              return (
                <article
                  className={`relative outline-none transition-[opacity,translate] duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 max-sm:grid max-sm:grid-cols-[78px_minmax(0,1fr)] max-sm:items-start max-sm:gap-x-4 ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-20 opacity-0"
                  }`}
                  style={{ transitionDelay: `${520 + index * 150}ms` }}
                  onMouseEnter={() => setHoveredCapability(index)}
                  onMouseLeave={() => setHoveredCapability(null)}
                  onFocus={() => setHoveredCapability(index)}
                  onBlur={() => setHoveredCapability(null)}
                  tabIndex={0}
                  key={number}
                >
                  <div className="flex items-center gap-4 max-sm:contents">
                    <div
                      className={`relative size-24 shrink-0 overflow-hidden rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] max-sm:size-[78px] sm:size-28 ${
                        isHovered ? "scale-[1.04]" : "scale-100"
                      }`}
                    >
                      <Image
                        className={`object-contain transition-opacity duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                          isHovered ? "opacity-0" : "opacity-100"
                        }`}
                        src="/images/about/source/capability-ring.png"
                        alt=""
                        fill
                        sizes="112px"
                      />

                      <Image
                        className={`object-contain transition-opacity duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${symbolClass ?? ""} ${
                          isHovered ? "opacity-0" : "opacity-100"
                        }`}
                        style={
                          extractWhiteArtwork
                            ? { filter: "url(#turnkey-line-orange)" }
                            : undefined
                        }
                        src={normalImage}
                        alt=""
                        fill
                        sizes="72px"
                      />

                      <div
                        className={`absolute inset-0 overflow-hidden rounded-full transition-opacity duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                          isHovered ? "opacity-100" : "opacity-0"
                        }`}
                        aria-hidden="true"
                      >
                        {hoverComposite ? (
                          <Image
                            className={`object-contain ${hoverSymbolClass ?? symbolClass ?? ""}`}
                            src={hoverImage}
                            alt=""
                            fill
                            sizes="112px"
                          />
                        ) : (
                          <>
                            <Image
                              className="object-contain"
                              src="/images/about/source/capability-turnkey.png"
                              alt=""
                              fill
                              sizes="112px"
                            />
                            <span
                              className="absolute inset-[6px] rounded-full"
                              style={{ backgroundColor: "#f47a2a" }}
                            />
                            <Image
                              className={`object-contain ${symbolClass ?? ""}`}
                              src={hoverImage}
                              alt=""
                              fill
                              sizes="72px"
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="relative h-24 min-w-0 flex-1 max-sm:h-[78px] sm:h-28">
                      <span
                        className={`absolute left-6 top-[28px] text-5xl font-bold leading-none transition-colors duration-500 ease-[cubic-bezier(.22,1,.36,1)] max-sm:left-0 max-sm:top-1 max-sm:text-[36px] sm:top-[34px] ${
                          isHovered ? "text-brand" : "text-charcoal"
                        }`}
                      >
                        {number}
                      </span>
                      <div
                        className="absolute bottom-[12px] left-0 right-0 flex items-center max-sm:bottom-4"
                        aria-hidden="true"
                      >
                        <span className="size-2 shrink-0 rounded-full bg-charcoal" />
                        <span className="h-px flex-1 bg-charcoal" />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`transition-[opacity,translate] duration-800 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 max-sm:col-start-2 max-sm:row-start-2 ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-12 opacity-0"
                    }`}
                    style={{ transitionDelay: `${650 + index * 150}ms` }}
                  >
                    <h3 className="mt-16 text-[18px] font-extrabold leading-tight text-charcoal max-sm:mt-0 max-sm:text-[15px]">
                      <span className="max-sm:hidden">
                        <span className="inline-block border-b border-brand pb-1">
                          {titleLead}
                        </span>{" "}
                        {titleRest.join(" ")}
                      </span>{" "}
                      <span className="hidden max-sm:inline">
                        <span className="inline-block border-b border-brand pb-1">
                          {mobileTitleLead}
                        </span>{" "}
                        {mobileTitleRest.join(" ")}
                      </span>
                    </h3>
                    <p className="mt-3 text-justify text-xl leading-6 text-neutral-700 [text-align-last:left] [text-justify:inter-character] max-sm:mt-2 max-sm:text-left max-sm:text-[13px] max-sm:leading-[1.45]">
                      {description}
                    </p>
                  </div>

                  {index < capabilities.length - 1 && (
                    <ChevronRight
                      className="absolute -right-8 top-[7.5rem] hidden size-10 stroke-[1.2] text-brand xl:block"
                      aria-hidden="true"
                    />
                  )}
                </article>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
