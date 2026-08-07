"use client";

import type { PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const imageRoot = "/images/about/source";

const milestones = [
  {
    year: "2011",
    title: "Thành lập công ty",
    description:
      "Chính thức hoạt động trong lĩnh vực thiết kế kiến trúc, thiết kế nội thất và thi công công trình.",
    image: `${imageRoot}/journey-2011.png`,
  },
  {
    year: "2014",
    title: "Mở rộng hoạt động",
    description:
      "Triển khai dịch vụ thiết kế thi công trọn gói cho nhà ở và công trình thương mại.",
    image: `${imageRoot}/journey-2014.png`,
  },
  {
    year: "2017",
    title: "Phát triển đội ngũ",
    description:
      "Hoàn thiện quy trình thiết kế, thi công và quản lý dự án theo tiêu chuẩn chuyên nghiệp.",
    image: `${imageRoot}/journey-2017.png`,
  },
  {
    year: "2020",
    title: "Đẩy mạnh dự án",
    description:
      "Mở rộng triển khai nhiều công trình nhà ở, văn phòng, showroom và không gian kinh doanh.",
    image: `${imageRoot}/journey-2020.png`,
  },
  {
    year: "2022",
    title: "Cột mốc 500+ dự án",
    description:
      "Hoàn thành hơn 500 dự án nhà ở, văn phòng, showroom và công trình thương mại trên nhiều quy mô.",
    image: `${imageRoot}/journey-2022.png`,
  },
  {
    year: "2026",
    title: "Kiến tạo giá trị",
    description:
      "Không ngừng nâng cao chất lượng dịch vụ, đồng hành cùng khách hàng từ ý tưởng đến công trình hoàn thiện.",
    image: `${imageRoot}/journey-2026.png`,
  },
] as const;

export function JourneyTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startX: 0, startScroll: 0, isDragging: false });
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let revealTimer: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        revealTimer = window.setTimeout(() => setIsVisible(true), 320);
        observer.unobserve(entry.target);
      },
      { threshold: 0.16 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (revealTimer) window.clearTimeout(revealTimer);
    };
  }, []);

  function scrollTimeline(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.72,
      behavior: "smooth",
    });
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    if (!scroller || (event.pointerType === "mouse" && event.button !== 0))
      return;

    dragRef.current = {
      startX: event.clientX,
      startScroll: scroller.scrollLeft,
      isDragging: true,
    };
    scroller.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    if (!scroller || !dragRef.current.isDragging) return;
    scroller.scrollLeft =
      dragRef.current.startScroll - (event.clientX - dragRef.current.startX);
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    if (scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
    dragRef.current.isDragging = false;
    setIsDragging(false);
  }

  return (
    <section className="bg-white py-24 sm:py-28 lg:py-32" ref={sectionRef}>
      <div className="mx-auto w-[min(1380px,calc(100%-2.25rem))]">
        <div className="mx-auto flex flex-col items-center text-center">
          <h2
            className={`max-w-full text-balance text-4xl sm:text-5xl font-extrabold uppercase leading-none tracking-[-0.025em] text-charcoal transition-[opacity,translate] delay-150 duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            Hành trình của BMT Decor
          </h2>
          <div
            className={`relative mt-5 h-7 w-full max-w-[390px] origin-left transition-[opacity,scale] delay-[420ms] duration-800 ease-out motion-reduce:scale-x-100 motion-reduce:opacity-100 ${
              isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            }`}
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

        <div className="group relative mt-12 sm:px-16 lg:mt-16">
          <button
            className="pointer-events-none absolute left-0 top-1/2 z-30 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-brand text-white opacity-0 shadow-[0_10px_28px_rgba(244,122,42,.32)] transition-[opacity,scale,background-color] duration-300 hover:scale-110 hover:bg-brand-dark group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:grid"
            type="button"
            onClick={() => scrollTimeline(-1)}
            aria-label="Xem các cột mốc trước"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            className="pointer-events-none absolute right-0 top-1/2 z-30 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-brand text-white opacity-0 shadow-[0_10px_28px_rgba(244,122,42,.32)] transition-[opacity,scale,background-color] duration-300 hover:scale-110 hover:bg-brand-dark group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:grid"
            type="button"
            onClick={() => scrollTimeline(1)}
            aria-label="Xem các cột mốc tiếp theo"
          >
            <ChevronRight className="size-6" />
          </button>

          <div
            className={`relative select-none overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            ref={scrollerRef}
            role="region"
            aria-label="Hành trình phát triển BMT Decor. Kéo ngang hoặc dùng nút mũi tên để xem các cột mốc."
            style={{ touchAction: "pan-y" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div className="relative flex w-max gap-7 px-1 pb-8 pt-4">
              <span
                className={`absolute left-0 right-0 top-[30px] origin-left border-t-2 border-dashed border-neutral-300 transition-[opacity,transform] delay-[520ms] duration-1000 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:scale-x-100 motion-reduce:opacity-100 ${
                  isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                }`}
                aria-hidden="true"
              />

              {milestones.map((milestone, index) => {
                const baseDelay = Math.min(index * 130 + 100, 760);

                return (
                  <article
                    className={`group/item relative w-[min(88vw,340px)] shrink-0 snap-start outline-none transition-[opacity,translate] duration-900 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 md:w-[340px] ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-24 opacity-0"
                    }`}
                    style={{ transitionDelay: `${baseDelay}ms` }}
                    tabIndex={0}
                    key={milestone.year}
                  >
                    <div
                      className={`absolute right-0 top-0 z-20 transition-[opacity,translate] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                        isVisible
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-0"
                      }`}
                      style={{ transitionDelay: `${baseDelay}ms` }}
                      aria-hidden="true"
                    >
                      <div className="grid size-7 place-items-center rounded-full bg-transparent transition-[scale,background-color] delay-0 duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover/item:scale-110 group-hover/item:bg-brand group-focus-visible/item:scale-110 group-focus-visible/item:bg-brand">
                        <span className="size-2.5 rounded-full bg-charcoal transition-transform duration-300 group-hover/item:scale-110 group-focus-visible/item:scale-110" />
                      </div>
                    </div>
                    <span
                      className="absolute right-[13px] top-[14px] h-[128px] border-l-2 border-dashed border-neutral-300"
                      aria-hidden="true"
                    />

                    <div className="grid grid-cols-[minmax(0,1fr)_54px] gap-3 pt-9">
                      <div className="min-w-0">
                        <div
                          className={`relative ml-auto mr-1 size-[40px] transition-[opacity,translate] duration-800 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                            isVisible
                              ? "translate-y-0 opacity-100"
                              : "translate-y-10 opacity-0"
                          }`}
                          style={{ transitionDelay: `${baseDelay + 70}ms` }}
                        >
                          <div className="relative size-full overflow-hidden rounded-full grayscale transition-[scale,filter] delay-0 duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover/item:scale-[1.06] group-hover/item:grayscale-0 group-focus-visible/item:scale-[1.06] group-focus-visible/item:grayscale-0">
                            <Image
                              className="object-cover"
                              src={milestone.image}
                              alt=""
                              fill
                              sizes="40px"
                            />
                          </div>
                        </div>

                        <div
                          className={`mt-2 text-left transition-[opacity,translate] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                            isVisible
                              ? "translate-y-0 opacity-100"
                              : "translate-y-12 opacity-0"
                          }`}
                          style={{ transitionDelay: `${baseDelay + 210}ms` }}
                        >
                          <h3 className="whitespace-nowrap text-right text-xl font-bold uppercase leading-tight text-charcoal">
                            {milestone.title}
                          </h3>
                          <p
                            className="mt-1.5 text-xl leading-[1.4] tracking-normal text-neutral-700"
                            style={{
                              textAlign: "justify",
                              textAlignLast: "right",
                              textJustify: "inter-character",
                              wordSpacing: "normal",
                            }}
                          >
                            {milestone.description}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex flex-col items-center pr-[16px] pt-4 transition-[opacity,translate] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                          isVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-12 opacity-0"
                        }`}
                        style={{ transitionDelay: `${baseDelay + 140}ms` }}
                      >
                        <span className="text-[34px] font-bold leading-none text-neutral-400 transition-colors duration-300 [writing-mode:vertical-rl] rotate-180 group-hover/item:text-brand group-focus-visible/item:text-brand">
                          {milestone.year}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
