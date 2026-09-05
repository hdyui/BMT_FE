"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { services } from "@/shared/constants/site";
import { Reveal } from "@/shared/components/Reveal";
import {
  homeMobileServiceLabels as mobileServiceLabels,
  homeServiceDetails as serviceDetails,
} from "@/features/home/data/home-content";

const SERVICE_CLOSE_DURATION = 320;
const SERVICE_OPEN_DURATION = 460;
const SERVICE_IMAGE_OPEN_DURATION = 460;
const SERVICE_COPY_DELAY = 90;
type TransitionPhase = "idle" | "closing" | "swapping" | "opening";

function AccordionControl({ active }: { active: boolean }) {
  return (
    <span
      className="relative block size-[clamp(22px,6vw,36px)] shrink-0 lg:size-11"
      aria-hidden="true"
    >
      <Image
        className="object-contain"
        src={
          active
            ? "/images/home/service-accordion-minus-circle.png"
            : "/images/home/service-accordion-plus-ring.png"
        }
        alt=""
        fill
        sizes="(max-width:1023px) 36px, 44px"
        unoptimized
      />
      <span
        className={
          active
            ? "absolute top-1/2 left-1/2 h-[3px] w-3 -translate-x-1/2 -translate-y-1/2 sm:h-1 sm:w-4 lg:h-[5px] lg:w-[19px]"
            : "absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 sm:size-4 lg:size-[18px]"
        }
      >
        <Image
          className="object-contain"
          src={
            active
              ? "/images/home/service-accordion-minus.png"
              : "/images/home/service-accordion-plus.png"
          }
          alt=""
          fill
          sizes="19px"
          unoptimized
        />
      </span>
    </span>
  );
}

export function ServiceShowcase() {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [showcaseVisible, setShowcaseVisible] = useState(false);
  const [preloadDesktopImages, setPreloadDesktopImages] = useState(false);
  const [preloadMobileImages, setPreloadMobileImages] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0 });
  const showcaseRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstSwapFrame = useRef<number | null>(null);
  const secondSwapFrame = useRef<number | null>(null);
  const firstRevealFrame = useRef<number | null>(null);
  const secondRevealFrame = useRef<number | null>(null);
  const desktopImageRefs = useRef<Array<HTMLImageElement | null>>([]);
  const mobileImageRefs = useRef<Array<HTMLImageElement | null>>([]);
  const detail = serviceDetails[active];
  const isTransitioning = phase !== "idle";
  const isOpeningOrIdle = phase === "opening" || phase === "idle";
  const motionVisible = showcaseVisible && isOpeningOrIdle;
  const motionDuration =
    phase === "closing" ? "duration-[320ms]" : "duration-[460ms]";

  useEffect(
    () => () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
      if (firstSwapFrame.current) cancelAnimationFrame(firstSwapFrame.current);
      if (secondSwapFrame.current)
        cancelAnimationFrame(secondSwapFrame.current);
      if (firstRevealFrame.current)
        cancelAnimationFrame(firstRevealFrame.current);
      if (secondRevealFrame.current)
        cancelAnimationFrame(secondRevealFrame.current);
    },
    [],
  );

  useEffect(() => {
    const element = showcaseRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setShowcaseVisible(true);
          return;
        }

        firstRevealFrame.current = requestAnimationFrame(() => {
          secondRevealFrame.current = requestAnimationFrame(() => {
            setShowcaseVisible(true);
          });
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const enableDesktopPreload = () => {
      if (desktopQuery.matches) setPreloadDesktopImages(true);
    };

    enableDesktopPreload();
    desktopQuery.addEventListener("change", enableDesktopPreload);
    return () => desktopQuery.removeEventListener("change", enableDesktopPreload);
  }, []);

  useEffect(() => {
    const element = showcaseRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (!window.matchMedia("(max-width: 1023px)").matches) return;
        setPreloadMobileImages(true);
        observer.disconnect();
      },
      { rootMargin: "900px 0px", threshold: 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!preloadDesktopImages) return;

    const frame = requestAnimationFrame(() => {
      desktopImageRefs.current.forEach((image) => {
        if (!image) return;
        void image.decode().catch(() => undefined);
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [preloadDesktopImages]);

  useEffect(() => {
    if (!preloadMobileImages) return;

    const frame = requestAnimationFrame(() => {
      mobileImageRefs.current.forEach((image) => {
        if (!image) return;
        void image.decode().catch(() => undefined);
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [preloadMobileImages]);

  useEffect(() => {
    const container = tabsRef.current;
    const button = buttonRefs.current[active];
    if (!container || !button) return;

    const updateIndicator = () => {
      const gridItem = button.parentElement;
      if (!gridItem) return;
      const isMobile = window.innerWidth < 640;

      setIndicator({
        left:
          gridItem.offsetLeft +
          button.offsetLeft +
          button.offsetWidth * (isMobile ? 0.12 : 0.29),
        top: isMobile
          ? container.offsetHeight
          : gridItem.offsetTop + button.offsetTop + button.offsetHeight,
        width: Math.max(30, button.offsetWidth * (isMobile ? 0.76 : 0.42)),
      });
    };

    const frame = requestAnimationFrame(updateIndicator);
    const resizeObserver = new ResizeObserver(updateIndicator);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [active, showcaseVisible]);

  const selectService = (index: number) => {
    if (isTransitioning || index === active) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(index);
      setPhase("idle");
      return;
    }

    setPhase("closing");
    transitionTimer.current = setTimeout(() => {
      setPhase("swapping");
      setActive(index);

      firstSwapFrame.current = requestAnimationFrame(() => {
        secondSwapFrame.current = requestAnimationFrame(() => {
          setPhase("opening");
          transitionTimer.current = setTimeout(() => {
            setPhase("idle");
            transitionTimer.current = null;
          }, SERVICE_OPEN_DURATION);
        });
      });
    }, SERVICE_CLOSE_DURATION);
  };

  return (
    <div ref={showcaseRef} className="mt-8">
      <div className="grid gap-4 lg:hidden">
        {services.map((service, index) => {
          const isActive = active === index;
          const isExpanded = isActive && isOpeningOrIdle;
          const panelId = `mobile-service-panel-${index}`;
          const buttonId = `mobile-service-button-${index}`;

          return (
            <Reveal delay={index * 100} key={service.href}>
              <div>
                <button
                  id={buttonId}
                  className="group relative block aspect-[3600/295] w-full overflow-hidden rounded-full text-left outline-none transition-transform duration-200 active:translate-y-px focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 disabled:pointer-events-none motion-reduce:transition-none"
                  disabled={isTransitioning}
                  onClick={() => selectService(index)}
                  aria-controls={panelId}
                  aria-expanded={isExpanded}
                  type="button"
                >
                  <Image
                    className="object-fill"
                    src={
                      isActive
                        ? "/images/home/mobile-service-active-bg.png"
                        : "/images/home/mobile-service-collapsed-frame.png"
                    }
                    alt=""
                    fill
                    sizes="calc(100vw - 2.25rem)"
                    unoptimized
                  />
                  <span
                    className={`absolute inset-0 flex items-center justify-between gap-3 px-4 text-[clamp(12px,3.8vw,16px)] font-extrabold uppercase leading-tight tracking-[-0.025em] ${
                      isActive ? "text-white" : "text-charcoal"
                    }`}
                  >
                    <span>{service.label}</span>
                    <AccordionControl active={isActive} />
                  </span>
                </button>

                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows,opacity] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${motionDuration} ${
                    isExpanded
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isExpanded}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`px-4 pt-5 pb-5 text-left text-[14px] leading-[1.48] text-charcoal transition-[opacity,translate] duration-[420ms] ease-in-out motion-reduce:translate-y-0 motion-reduce:transition-none ${
                        isExpanded
                          ? "translate-y-0 opacity-100 delay-[220ms]"
                          : "translate-y-3 opacity-0"
                      }`}
                    >
                      {serviceDetails[index].copy}
                    </p>
                    <div
                      className={`relative aspect-[3460/2108] w-full overflow-hidden rounded-[24px] transition-[clip-path,opacity,transform] duration-[460ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transform-none motion-reduce:transition-none ${
                        isExpanded
                          ? "translate-y-0 [clip-path:inset(0_0_0_0_round_24px)] opacity-100 delay-100"
                          : "-translate-y-3 [clip-path:inset(0_0_100%_0_round_24px)] opacity-0"
                      }`}
                    >
                      <Image
                        className="object-cover"
                        src={serviceDetails[index].image}
                        alt={service.label}
                        fill
                        loading={preloadMobileImages ? "eager" : "lazy"}
                        fetchPriority="low"
                        ref={(element) => {
                          mobileImageRefs.current[index] = element;
                        }}
                        sizes="calc(100vw - 2.25rem)"
                        quality={75}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="hidden">
        <div
          ref={tabsRef}
          className="relative grid grid-cols-4 gap-x-2 gap-y-3 border-b border-neutral-300 sm:grid-cols-2 sm:gap-x-4"
        >
          {services.map((service, index) => (
            <Reveal delay={index * 120} key={service.href}>
              <button
                className={`w-full px-3 py-5 text-sm font-extrabold uppercase leading-snug transition-[color,translate] duration-300 ease-out sm:text-base max-sm:flex max-sm:h-14 max-sm:items-center max-sm:justify-center max-sm:px-0 max-sm:py-1.5 max-sm:text-[10px] max-sm:font-black max-sm:leading-[1.06] max-sm:tracking-[-0.035em] ${
                  active === index
                    ? "text-brand"
                    : "hover:-translate-y-0.5 hover:text-brand"
                }`}
                disabled={isTransitioning}
                onClick={() => selectService(index)}
                ref={(element) => {
                  buttonRefs.current[index] = element;
                }}
                aria-pressed={active === index}
                type="button"
              >
                <span className="max-sm:hidden">{service.label}</span>
                <span className="hidden w-full text-center max-sm:block">
                  <span className="block whitespace-nowrap">
                    {mobileServiceLabels[index][0]}
                  </span>
                  <span className="mt-0.5 block whitespace-nowrap">
                    {mobileServiceLabels[index][1]}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}

          <span
            aria-hidden="true"
            className={`pointer-events-none absolute h-0.5 bg-brand transition-[left,top,width,opacity] duration-500 ease-out motion-reduce:transition-none ${
              showcaseVisible ? "opacity-100" : "opacity-0"
            }`}
            style={indicator}
          />
        </div>

        <div className="relative mx-auto mt-8 max-w-[1200px]">
          <div className="relative px-2 py-2 sm:hidden">
            <div
              aria-hidden="true"
              className={`absolute inset-y-6 right-0 left-0 rounded-[22px] bg-brand transition-[opacity,translate] ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none min-[480px]:inset-y-11 ${motionDuration} ${
                motionVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: motionVisible ? "100ms" : "0ms" }}
            />

            <div className="relative grid min-h-[clamp(265px,49vw,290px)] grid-cols-[54%_46%] items-center">
              <div
                className={`relative z-20 min-h-[clamp(265px,49vw,290px)] transition-[opacity,translate] ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none ${motionDuration} ${
                  motionVisible
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-[2px] z-0 translate-x-1.5 -translate-y-1.5 rounded-[23px] border border-brand"
                />
                <div className="relative z-10 h-full min-h-[clamp(265px,49vw,290px)] overflow-hidden rounded-[22px] bg-white shadow-[0_10px_28px_rgb(47_38_34/.14)]">
                  <Image
                    className="object-cover"
                    src={detail.image}
                    alt={services[active].label}
                    fill
                    sizes="54vw"
                    quality={70}
                  />
                </div>
              </div>

              <article
                className={`relative z-20 flex min-h-[190px] flex-col items-center justify-center px-3 py-4 text-center text-white transition-[opacity,translate] ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none ${motionDuration} ${
                  motionVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: motionVisible ? "100ms" : "0ms" }}
              >
                <div
                  className={`transition-[opacity,translate] duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                    motionVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-0"
                  }`}
                  style={{ transitionDelay: motionVisible ? "220ms" : "0ms" }}
                >
                  <h3 className="text-[18px] font-extrabold uppercase leading-[1.08]">
                    {services[active].label}
                  </h3>
                  <span className="mx-auto mt-3 block h-0.5 w-20 bg-white/90" />
                </div>
                <p
                  className={`mt-3 text-[11px] leading-[1.45] text-white/95 transition-[opacity,translate] duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                    motionVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-0"
                  }`}
                  style={{ transitionDelay: motionVisible ? "300ms" : "0ms" }}
                >
                  {detail.copy}
                </p>
              </article>
            </div>
          </div>

          <div className="relative grid items-center max-sm:hidden">
            <div
              className={`relative z-10 transition-[opacity,translate] ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none ${motionDuration} ${
                motionVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-8 opacity-0"
              }`}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 translate-x-3 -translate-y-3 rounded-[3rem] border border-brand"
              />
              <div className="relative z-20 min-h-[480px] overflow-hidden rounded-[3rem] bg-white">
                <Image
                  className="object-cover"
                  src={detail.image}
                  alt={services[active].label}
                  fill
                  sizes="(max-width:1023px) calc(100vw - 2.25rem), 1px"
                  quality={70}
                />
              </div>
            </div>

            <article
              className={`relative z-20 -mt-8 flex flex-col items-center justify-center rounded-3xl bg-brand p-8 text-center text-white transition-[opacity,translate] ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none ${motionDuration} ${
                motionVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: motionVisible ? "100ms" : "0ms" }}
            >
              <div
                className={`transition-[opacity,translate] duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                  motionVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: motionVisible ? "240ms" : "0ms" }}
              >
                <h3 className="text-3xl font-bold uppercase">
                  {services[active].label}
                </h3>
                <span className="mx-auto mt-5 block h-0.5 w-36 bg-white/90" />
              </div>
              <p
                className={`mt-5 max-w-lg text-base leading-relaxed text-white/90 transition-[opacity,translate] duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                  motionVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: motionVisible ? "340ms" : "0ms" }}
              >
                {detail.copy}
              </p>
            </article>
          </div>
        </div>

        <div className="mt-[42px] flex justify-center gap-[10px]">
          {services.map((service, index) => (
            <button
              className={`size-[22px] shrink-0 rounded-full border-[3px] transition-[border-color,background-color,transform] duration-300 hover:scale-110 ${
                active === index
                  ? "border-brand bg-brand shadow-[inset_0_0_0_4px_white]"
                  : "border-charcoal bg-white"
              }`}
              disabled={isTransitioning}
              key={service.href}
              onClick={() => selectService(index)}
              aria-label={`Chọn ${service.label}`}
              aria-current={active === index ? "true" : undefined}
              type="button"
            />
          ))}
        </div>
      </div>

      <div
        className={`hidden gap-10 transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none lg:grid lg:grid-cols-2 xl:gap-14 ${
          showcaseVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
      >
        <div className="flex aspect-[2376/2108] min-h-0 flex-col justify-between">
          {services.map((service, index) => {
            const isActive = active === index;
            const isExpanded = isActive && isOpeningOrIdle;
            const panelId = `featured-service-panel-${index}`;
            const buttonId = `featured-service-button-${index}`;

            return (
              <div className="shrink-0" key={service.href}>
                <button
                  id={buttonId}
                  className="group relative block aspect-[2376/295] w-full overflow-hidden rounded-full text-left outline-none transition-transform duration-200 active:translate-y-px focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 disabled:pointer-events-none motion-reduce:transition-none"
                  disabled={isTransitioning}
                  onClick={() => selectService(index)}
                  aria-controls={panelId}
                  aria-expanded={isExpanded}
                  type="button"
                >
                  <Image
                    className="object-fill"
                    src={
                      isActive
                        ? "/images/home/service-accordion-active-bg.png"
                        : "/images/home/service-accordion-collapsed-frame.png"
                    }
                    alt=""
                    fill
                    sizes="(max-width:1279px) 50vw, 572px"
                    unoptimized
                  />
                  <span
                    className={`absolute inset-0 flex items-center justify-between gap-5 px-7 text-[clamp(15px,1.25vw,19px)] font-extrabold uppercase leading-tight xl:px-8 ${
                      isActive ? "text-white" : "text-charcoal"
                    }`}
                  >
                    <span>{service.label}</span>
                    <AccordionControl active={isActive} />
                  </span>
                </button>

                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows,opacity] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                    isExpanded
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isExpanded}
                  style={{
                    transitionDuration: `${
                      phase === "closing"
                        ? SERVICE_CLOSE_DURATION
                        : SERVICE_OPEN_DURATION
                    }ms`,
                  }}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`mx-auto w-[86%] pt-5 pb-3 text-justify text-[17px] leading-relaxed text-charcoal transition-[opacity,translate] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
                        isExpanded
                          ? "translate-y-0 opacity-100"
                          : "translate-y-2 opacity-0"
                      }`}
                      style={{
                        transitionDelay: isExpanded
                          ? `${SERVICE_COPY_DELAY}ms`
                          : "0ms",
                        transitionDuration: `${
                          phase === "closing"
                            ? SERVICE_CLOSE_DURATION
                            : SERVICE_OPEN_DURATION - SERVICE_COPY_DELAY
                        }ms`,
                      }}
                    >
                      {serviceDetails[index].copy}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative isolate aspect-[2376/2108] w-full overflow-hidden [contain:layout_paint]">
          {serviceDetails.map((serviceDetail, index) => {
            const isActiveImage = active === index;
            const isVisibleImage = isActiveImage && isOpeningOrIdle;

            return (
              <div
                className={`absolute inset-0 transition-[clip-path,opacity] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                  isVisibleImage
                    ? "[clip-path:inset(0_0_0_0)] opacity-100"
                    : "[clip-path:inset(0_0_100%_0)] opacity-60"
                } ${
                  isActiveImage && isTransitioning
                    ? "will-change-[clip-path,opacity]"
                    : ""
                }`}
                aria-hidden={!isActiveImage}
                key={serviceDetail.desktopImage}
                style={{
                  transitionDuration: `${
                    phase === "closing"
                      ? SERVICE_CLOSE_DURATION
                      : SERVICE_IMAGE_OPEN_DURATION
                  }ms`,
                }}
              >
                <Image
                  className={`pointer-events-none object-contain transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] backface-hidden motion-reduce:translate-y-0 motion-reduce:transition-none ${
                    isVisibleImage ? "translate-y-0" : "-translate-y-1.5"
                  }`}
                  src={serviceDetail.desktopImage}
                  alt={isActiveImage ? services[index].label : ""}
                  fill
                  loading={preloadDesktopImages ? "eager" : "lazy"}
                  fetchPriority="low"
                  ref={(element) => {
                    desktopImageRefs.current[index] = element;
                  }}
                  sizes="(max-width:1279px) 50vw, 572px"
                  quality={70}
                  style={{
                    transitionDuration: `${SERVICE_IMAGE_OPEN_DURATION}ms`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
