"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { services } from "@/config/site";
import { Reveal } from "@/lib/components/shared/Reveal";

const serviceDetails = [
  {
    image: "/images/home/trust-card-interior.png",
    copy: "Cung cấp giải pháp xây dựng trọn gói từ tư vấn, thiết kế, thi công đến hoàn thiện, đảm bảo chất lượng, tiến độ và tối ưu chi phí.",
  },
  {
    image: "/images/home/trust-card-design.png",
    copy: "Thiết kế không gian hài hòa giữa công năng và thẩm mỹ, mang đến giải pháp phù hợp với nhu cầu sử dụng và phong cách của từng khách hàng.",
  },
  {
    image: "/images/home/trust-card-build.png",
    copy: "Thi công công trình theo đúng bản vẽ và tiêu chuẩn kỹ thuật, đảm bảo chất lượng, an toàn và tiến độ trong suốt quá trình thực hiện.",
  },
  {
    image: "/images/home/trust-card-site.png",
    copy: "Nâng cấp, cải tạo và sửa chữa công trình hiện hữu, tối ưu công năng, làm mới không gian và gia tăng giá trị sử dụng.",
  },
] as const;

const mobileServiceLabels = [
  ["XÂY DỰNG", "TRỌN GÓI"],
  ["THIẾT KẾ KIẾN TRÚC &", "NỘI THẤT"],
  ["THI CÔNG", "XÂY DỰNG"],
  ["CẢI TẠO &", "SỬA CHỮA"],
] as const;

const SERVICE_FADE_DURATION = 280;
type TransitionPhase = "idle" | "leaving" | "entering";

export function ServiceShowcase() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(0);
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [tabsVisible, setTabsVisible] = useState(false);
  const [indicator, setIndicator] = useState({
    left: 0,
    top: 0,
    width: 0,
  });
  const tabsRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const detail = serviceDetails[active];
  const isTransitioning = phase !== "idle";
  const motionVisible = tabsVisible && phase === "idle";
  const motionDuration = phase === "leaving" ? "duration-300" : "duration-700";

  useEffect(
    () => () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      if (enterTimer.current) clearTimeout(enterTimer.current);
    },
    [],
  );

  useEffect(() => {
    const element = tabsRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setTabsVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = tabsRef.current;
    const button = buttonRefs.current[selected];
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
  }, [selected, tabsVisible]);

  const selectService = (index: number) => {
    if (isTransitioning || index === selected) return;

    setSelected(index);
    setPhase("leaving");
    fadeTimer.current = setTimeout(() => {
      setActive(index);
      setPhase("entering");
      enterTimer.current = setTimeout(() => setPhase("idle"), 30);
    }, SERVICE_FADE_DURATION);
  };

  return (
    <div className="mt-8">
      <div
        ref={tabsRef}
        className="relative grid grid-cols-4 gap-x-2 gap-y-3 border-b border-neutral-300 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-4"
      >
        {services.map((service, index) => (
          <Reveal delay={index * 120} key={service.href}>
            <button
              className={`w-full px-3 py-5 text-sm font-extrabold uppercase leading-snug transition-[color,translate] duration-300 ease-out sm:text-base max-sm:flex max-sm:h-14 max-sm:items-center max-sm:justify-center max-sm:px-0 max-sm:py-1.5 max-sm:text-[10px] max-sm:font-black max-sm:leading-[1.06] max-sm:tracking-[-0.035em] ${
                selected === index
                  ? "text-brand"
                  : "hover:-translate-y-0.5 hover:text-brand"
              }`}
              disabled={isTransitioning}
              onClick={() => selectService(index)}
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              aria-pressed={selected === index}
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
          className={`pointer-events-none absolute h-0.5 bg-brand transition-[left,top,width,opacity] duration-500 ease-out ${
            tabsVisible ? "opacity-100" : "opacity-0"
          }`}
          style={indicator}
        />
      </div>

      <div className="relative mx-auto mt-8 max-w-[1200px]">
        <div className="relative px-2 py-2 sm:hidden">
          <div
            aria-hidden="true"
            className={`absolute inset-y-6 left-0 right-0 rounded-[22px] bg-brand transition-[opacity,translate] ease-out min-[480px]:inset-y-11 ${motionDuration} ${
              motionVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-4 opacity-0"
            }`}
            style={{
              transitionDelay: motionVisible ? "100ms" : "0ms",
            }}
          />

          <div className="relative grid min-h-[clamp(265px,49vw,290px)] grid-cols-[54%_46%] items-center">
            <div
              className={`relative z-20 min-h-[clamp(265px,49vw,290px)] transition-[opacity,translate] ease-out ${motionDuration} ${
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
                  className="object-cover [transform:scale(1)] transition-transform duration-700 ease-out"
                  src={detail.image}
                  alt={services[active].label}
                  fill
                  sizes="54vw"
                  unoptimized
                />
              </div>
            </div>

            <article
              className={`relative z-20 flex min-h-[190px] flex-col items-center justify-center px-3 py-4 text-center text-white transition-[opacity,translate] ease-out ${motionDuration} ${
                motionVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-4 opacity-0"
              }`}
              style={{
                transitionDelay: motionVisible ? "100ms" : "0ms",
              }}
            >
              <div
                className={`transition-[opacity,translate] duration-500 ease-out ${
                  motionVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
                }`}
                style={{
                  transitionDelay: motionVisible ? "220ms" : "0ms",
                }}
              >
                <h3 className="text-[18px] font-extrabold uppercase leading-[1.08]">
                  {services[active].label}
                </h3>
                <span className="mx-auto mt-3 block h-0.5 w-20 bg-white/90" />
              </div>

              <p
                className={`mt-3 text-[11px] leading-[1.45] text-white/95 transition-[opacity,translate] duration-500 ease-out ${
                  motionVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
                }`}
                style={{
                  transitionDelay: motionVisible ? "300ms" : "0ms",
                }}
              >
                {detail.copy}
              </p>
            </article>
          </div>
        </div>

        <div
          aria-hidden="true"
          className={`absolute inset-y-14 left-0 right-0 hidden rounded-3xl bg-brand transition-[opacity,translate] ease-out lg:block ${motionDuration} ${
            motionVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-8 opacity-0"
          }`}
          style={{
            transitionDelay: motionVisible ? "100ms" : "0ms",
          }}
        />

        <div className="relative grid items-center max-sm:hidden lg:grid-cols-[1.2fr_0.9fr]">
          <div
            className={`relative z-10 transition-[opacity,translate] ease-out lg:ml-4 ${motionDuration} ${
              motionVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-8 opacity-0"
            }`}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -right-3 z-0 hidden w-6 bg-white lg:block"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 translate-x-3 -translate-y-3 rounded-[3rem] border border-brand"
            />
            <div className="relative z-20 min-h-[480px] overflow-hidden rounded-[3rem] bg-white">
              <Image
                className="object-cover [transform:scale(1)] transition-transform duration-700 ease-out hover:[transform:scale(1.03)]"
                src={detail.image}
                alt={services[active].label}
                fill
                sizes="(max-width:1024px) 100vw, 55vw"
                unoptimized
              />
            </div>
          </div>

          <article
            className={`relative z-20 -mt-8 flex flex-col items-center justify-center rounded-3xl bg-brand p-8 text-center text-white transition-[opacity,translate] ease-out lg:-ml-6 lg:mt-0 lg:min-h-[23rem] lg:bg-transparent lg:px-12 lg:py-12 ${motionDuration} ${
              motionVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
            style={{
              transitionDelay: motionVisible ? "100ms" : "0ms",
            }}
          >
            <div
              className={`transition-[opacity,translate] duration-500 ease-out ${
                motionVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0"
              }`}
              style={{
                transitionDelay: motionVisible ? "240ms" : "0ms",
              }}
            >
              <h3 className="text-3xl font-bold uppercase lg:text-[42px] lg:leading-[1.08]">
                {services[active].label}
              </h3>
              <span className="mx-auto mt-5 block h-0.5 w-36 bg-white/90" />
            </div>

            <p
              className={`mt-5 max-w-lg text-base leading-relaxed text-white/90 transition-[opacity,translate] duration-500 ease-out lg:text-lg ${
                motionVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0"
              }`}
              style={{
                transitionDelay: motionVisible ? "340ms" : "0ms",
              }}
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
              selected === index
                ? "border-brand bg-brand shadow-[inset_0_0_0_4px_white]"
                : "border-charcoal bg-white"
            }`}
            disabled={isTransitioning}
            key={service.href}
            onClick={() => selectService(index)}
            aria-label={`Chọn ${service.label}`}
            aria-current={selected === index ? "true" : undefined}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
