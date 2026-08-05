"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export type FeaturedProject = {
  id: string;
  image: string;
  tag: string;
  title: string;
};

type ProjectCarouselProps = {
  projects: readonly FeaturedProject[];
  backgroundImage?: string;
  prevIcon?: string;
  nextIcon?: string;
};

const DRAG_THRESHOLD = 50;

export function ProjectCarousel({
  projects: featuredProjects,
  backgroundImage,
  prevIcon,
  nextIcon,
}: ProjectCarouselProps) {
  const count = featuredProjects.length;
  /* Nhân bản danh sách 3 lần để lướt vòng: luôn còn thẻ ở cả hai phía nên
     hàng thẻ trượt liên tục cùng chiều, không bị giật ngược về đầu. */
  const slides = useMemo(
    () => [...featuredProjects, ...featuredProjects, ...featuredProjects],
    [featuredProjects],
  );
  const [active, setActive] = useState(count + Math.min(1, count - 1));
  const [offset, setOffset] = useState(0);
  const [animate, setAnimate] = useState(true);
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dragStartX = useRef<number | null>(null);

  const move = useCallback((direction: number) => {
    setAnimate(true);
    setActive((current) => current + direction);
  }, []);

  /* Toàn bộ hàng thẻ trượt ngang sao cho thẻ đang chọn nằm giữa khung nhìn.
     Đo bằng offsetLeft nên không phụ thuộc bề rộng thẻ hay khoảng cách. */
  useLayoutEffect(() => {
    const align = () => {
      const viewport = viewportRef.current;
      const card = cardRefs.current[active];
      if (!viewport || !card) return;
      setOffset(
        viewport.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2),
      );
    };

    align();
    const observer = new ResizeObserver(align);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [active]);

  /* Sau khi nhảy về bản sao giữa (không có transition), bật lại hiệu ứng. */
  useEffect(() => {
    if (animate) return;
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  /* Trượt xong mà đã lấn sang bản sao ngoài thì dời ngầm về bản sao giữa. */
  const handleTransitionEnd = () => {
    if (active >= count && active < count * 2) return;
    setAnimate(false);
    setActive(count + (((active % count) + count) % count));
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    const viewport = viewportRef.current;
    viewport?.addEventListener("keydown", onKey);
    return () => viewport?.removeEventListener("keydown", onKey);
  }, [move]);

  const endDrag = (endX: number) => {
    if (dragStartX.current === null) return;
    const distance = endX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(distance) < DRAG_THRESHOLD) return;
    move(distance > 0 ? -1 : 1);
  };

  return (
    <div className="relative w-full">
      {/*
        ===================================================================
        NOTE: ĐỔI LINK ẢNH BACKGROUND Ở ĐÂY NHA!
        ===================================================================
      */}
      <Image
        // Đã thêm object-bottom để hình neo sát dưới đáy và loang mờ lên trên
        className="-z-10 object-cover object-bottom"
        src={backgroundImage || "/images/home/blueprint-background.png"}
        alt="Background"
        fill
        sizes="100vw"
        quality={100} // Đã thêm quality={100} để giữ hình sắc nét, không bị mờ
        aria-hidden="true"
      />

      <div
        ref={viewportRef}
        className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-6"
        tabIndex={0}
        role="group"
        aria-label="Dự án tiêu biểu"
        onTouchStart={(event) => {
          dragStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => endDrag(event.changedTouches[0].clientX)}
        onPointerDown={(event) => {
          if (event.pointerType === "touch") return;
          dragStartX.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (event.pointerType === "touch") return;
          endDrag(event.clientX);
        }}
      >
        <div
          className={cn(
            "flex w-max items-center gap-6 sm:gap-8 lg:gap-[50px]",
            animate && "transition-transform duration-500 ease-out",
          )}
          style={{ transform: `translateX(${offset}px)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((project, index) => {
            const isActive = index === active;

            return (
              <div
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                className={cn(
                  "relative aspect-[3334/2653] w-[42vw] max-w-[600px] shrink-0 overflow-hidden rounded-[32px] transition-[transform,opacity] duration-500 ease-out",
                  isActive
                    ? "z-10 scale-100 opacity-100"
                    : "scale-[0.82] opacity-90",
                )}
                key={`${project.id}-${index}`}
              >
                <Image
                  className="object-cover"
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="42vw"
                  priority={index === 0}
                />

                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#F47A2A] via-[#F47A2A]/90 to-transparent"
                  aria-hidden="true"
                />

                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end p-5 pb-6 text-center text-white">
                  <p className="mb-1 text-[11px] font-semibold tracking-wider uppercase sm:text-xs">
                    {project.tag}
                  </p>
                  <h3 className="text-xl leading-tight font-bold uppercase sm:text-2xl lg:text-[26px]">
                    {project.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 mt-6 flex items-center justify-center gap-4">
        <button
          className="grid size-12 place-items-center overflow-hidden rounded-full bg-brand text-white shadow-[0_6px_20px_rgb(244_122_42/.4)] transition-all duration-300 hover:scale-110 hover:bg-brand-dark active:scale-95"
          onClick={() => move(-1)}
          aria-label="Dự án trước"
          type="button"
        >
          {prevIcon ? (
            <Image
              className="size-full object-cover"
              src={prevIcon}
              alt=""
              width={48}
              height={48}
              aria-hidden="true"
            />
          ) : (
            <svg
              className="ml-[-2px]"
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 8L14 0V16L0 8Z" />
            </svg>
          )}
        </button>
        <button
          className="grid size-12 place-items-center overflow-hidden rounded-full bg-brand text-white shadow-[0_6px_20px_rgb(244_122_42/.4)] transition-all duration-300 hover:scale-110 hover:bg-brand-dark active:scale-95"
          onClick={() => move(1)}
          aria-label="Dự án tiếp theo"
          type="button"
        >
          {nextIcon ? (
            <Image
              className="size-full object-cover"
              src={nextIcon}
              alt=""
              width={48}
              height={48}
              aria-hidden="true"
            />
          ) : (
            <svg
              className="mr-[-2px]"
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14 8L0 0V16L14 8Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
