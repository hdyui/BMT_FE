"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Building2 } from "lucide-react";

const contentContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.25,
    },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const bodyItemVariants: Variants = {
  hidden: { opacity: 0, y: 44 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const slides = [
  {
    image: "/images/home/hero-background-01.png",
    alt: "Mẫu nhà phố do BMT Decor thiết kế",
    title: "BMT Decor - Đơn vị thiết kế và thi công trọn gói",
    copy: "Đồng hành cùng khách hàng từ tư vấn, thiết kế đến thi công hoàn thiện, mang đến những không gian bền vững, tối ưu công năng và giá trị sử dụng.",
    href: "/gioi-thieu",
  },
  {
    image: "/images/home/hero-background-02.png",
    alt: "Không gian nội thất do BMT Decor thực hiện",
    title: "Đáp ứng đa dạng nhu cầu xây dựng & cải tạo",
    copy: "Dù là xây mới, cải tạo hay hoàn thiện nội thất, BMT Decor đều xây dựng giải pháp phù hợp với từng loại hình công trình, quy mô đầu tư và mục tiêu sử dụng.",
    href: "/dich-vu/xay-dung-tron-goi",
  },
  {
    image: "/images/home/hero-background-03.png",
    alt: "Công trình thương mại đã hoàn thiện",
    title: "Những công trình đã hoàn thiện",
    copy: "Từ nhà ở, văn phòng, showroom đến các công trình thương mại, mỗi dự án đều là minh chứng cho năng lực thiết kế, thi công và cam kết chất lượng.",
    href: "/du-an",
  },
  {
    image: "/images/home/hero-background-04.png",
    alt: "Hồ sơ năng lực BMT Decor",
    title: "Hồ sơ năng lực BMT Decor",
    copy: "Khám phá năng lực của BMT Decor thông qua đội ngũ chuyên môn, quy trình triển khai, lĩnh vực hoạt động và các dự án tiêu biểu.",
    href: "/ho-so-nang-luc",
  },
] as const;

export function HomeHero() {
  const [selected, setSelected] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pointerStart = useRef<{ x: number; y: number; id: number } | null>(
    null,
  );

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setTimeout(
      () => setSelected((current) => (current + 1) % slides.length),
      6000,
    );
    return () => window.clearTimeout(timer);
  }, [isPaused, selected]);

  function selectRelative(direction: 1 | -1) {
    setSelected(
      (current) => (current + direction + slides.length) % slides.length,
    );
  }

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const target = event.target;
    if (target instanceof Element && target.closest("a, button")) return;

    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
      id: event.pointerId,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsPaused(true);
  }

  function handlePointerUp(event: PointerEvent<HTMLElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    setIsPaused(false);

    if (!start || start.id !== event.pointerId) return;

    const distanceX = event.clientX - start.x;
    const distanceY = event.clientY - start.y;
    const isHorizontalSwipe =
      Math.abs(distanceX) >= 48 &&
      Math.abs(distanceX) > Math.abs(distanceY) * 1.2;

    if (!isHorizontalSwipe) return;

    selectRelative(distanceX < 0 ? 1 : -1);
  }

  function handlePointerCancel(event: PointerEvent<HTMLElement>) {
    if (pointerStart.current?.id === event.pointerId) {
      pointerStart.current = null;
      setIsPaused(false);
    }
  }

  return (
    <section
      className="relative h-[calc(75svh-64px)] min-h-[520px] touch-pan-y cursor-grab select-none overflow-hidden bg-charcoal outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset lg:min-h-[640px]"
      aria-label="Banner giới thiệu BMT Decor"
      aria-roledescription="carousel"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") selectRelative(-1);
        if (event.key === "ArrowRight") selectRelative(1);
      }}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      tabIndex={0}
    >
      {slides.map((slide, index) => {
        const isActive = selected === index;

        return (
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              isActive
                ? "z-10 opacity-100"
                : "pointer-events-none z-0 opacity-0"
            }`}
            aria-hidden={!isActive}
            key={slide.image}
          >
            <div
              className={`absolute inset-0 transform-gpu transition-transform duration-[6000ms] ease-out motion-reduce:transform-none ${
                isActive ? "scale-[1.01]" : "scale-100"
              }`}
            >
              <Image
                className="pointer-events-none object-cover object-center"
                src={slide.image}
                alt={slide.alt}
                draggable={false}
                fill
                priority={index === 0}
                sizes="100vw"
                unoptimized
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />

            <div className="relative mx-auto flex h-full w-[min(1380px,calc(100%-2.5rem))] items-end pb-20 sm:pb-24 lg:pb-28">
              <motion.div
                className="max-w-[660px] text-white"
                animate={isActive ? "visible" : "hidden"}
                initial="hidden"
                variants={contentContainerVariants}
              >
                <motion.h1
                  className="text-3xl leading-[1.08] font-bold text-balance uppercase drop-shadow-lg sm:text-5xl"
                  variants={titleVariants}
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  className="mt-5 max-w-xl text-xl leading-relaxed text-white/90 sm:text-base"
                  variants={bodyItemVariants}
                >
                  <Building2 className="mr-2 inline size-4" />
                  {slide.copy}
                </motion.p>
                <motion.div className="mt-6" variants={bodyItemVariants}>
                  <Link
                    className="inline-flex items-center gap-2 rounded-full border border-white px-5 py-2 text-sm transition-[color,background-color,border-color,transform] duration-700 ease-out hover:scale-105 hover:border-brand hover:bg-brand hover:text-white active:scale-95"
                    href={slide.href}
                    tabIndex={isActive ? 0 : -1}
                  >
                    TÌM HIỂU THÊM <ArrowUpRight className="size-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        );
      })}

      <div className="absolute inset-x-0 bottom-7 z-20 flex justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            className={`size-3 rounded-full border border-white transition-all duration-300 ${
              selected === index
                ? "scale-110 bg-brand ring-2 ring-brand/30"
                : "bg-transparent hover:bg-white/40"
            }`}
            key={slide.image}
            onClick={() => setSelected(index)}
            aria-label={`Chuyển đến banner ${index + 1}`}
            aria-current={selected === index}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
