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
  mobileMockup?: boolean;
  mobileInitialIndex?: number;
};

const DRAG_THRESHOLD = 50;

export function ProjectCarousel({
  projects: featuredProjects,
  backgroundImage,
  prevIcon,
  nextIcon,
  mobileMockup = false,
  mobileInitialIndex,
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
  const logicalActive = ((active % count) + count) % count;

  useEffect(() => {
    if (
      mobileInitialIndex === undefined ||
      !window.matchMedia("(max-width: 767px)").matches
    ) {
      return;
    }

    const safeIndex = Math.min(Math.max(mobileInitialIndex, 0), count - 1);
    const frame = requestAnimationFrame(() => {
      setAnimate(false);
      setActive(count + safeIndex);
    });
    return () => cancelAnimationFrame(frame);
  }, [count, mobileInitialIndex]);

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
        className={cn(
          "relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-6",
          mobileMockup && "max-md:py-0",
        )}
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
            "flex w-max items-center gap-4 sm:gap-8 lg:gap-[3.125rem]",
            mobileInitialIndex !== undefined && "max-md:gap-[20vw]",
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
                  "relative aspect-3334/2653 w-[78vw] max-w-150 shrink-0 overflow-hidden rounded-[1.25rem] sm:w-[60vw] sm:rounded-[1.5rem] lg:w-[42vw] lg:rounded-[2rem] transition-[transform,opacity] duration-500 ease-out",
                  mobileMockup &&
                    "max-md:w-[86vw] max-md:rounded-[1.75rem]",
                  mobileInitialIndex !== undefined && "max-md:!w-[86vw]",
                  isActive
                    ? "z-10 scale-100 opacity-100"
                    : // Thêm cursor-pointer để hiện hình bàn tay khi hover vào các ảnh phụ
                      "scale-[0.82] opacity-90 cursor-pointer hover:opacity-100 active:opacity-100",
                )}
                key={`${project.id}-${index}`}
                // THÊM SỰ KIỆN onClick TẠI ĐÂY
                onClick={() => {
                  // Chỉ trượt khi ảnh được click không phải là ảnh đang active
                  if (!isActive) {
                    move(index - active);
                  }
                }}
              >
                <Image
                  className="object-cover"
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 60vw, 42vw"
                  priority={index === 0}
                />

                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#F47A2A] via-[#F47A2A]/90 to-transparent"
                  aria-hidden="true"
                />

                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end p-5 pb-6 text-center text-white">
                  <p
                    className={cn(
                      "mb-1 text-[0.6875rem] font-normal tracking-wider uppercase sm:text-xs md:font-semibold",
                      mobileInitialIndex !== undefined &&
                        "max-md:text-[clamp(0.68rem,2.8vw,1.05rem)]",
                    )}
                  >
                    {project.tag}
                  </p>
                  <h3
                    className={cn(
                      "font-heading text-xl leading-tight font-bold uppercase sm:text-2xl lg:text-[1.625rem]",
                      mobileInitialIndex !== undefined &&
                        "max-md:text-[clamp(1.1rem,4vw,1.55rem)]",
                    )}
                  >
                    {project.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {mobileMockup && (
        <>
          <button
            className={cn(
              "absolute top-1/2 left-[3.5%] z-20 grid size-7 -translate-y-1/2 place-items-center overflow-hidden rounded-full bg-brand text-white shadow-[0_4px_12px_rgb(244_122_42/.3)] transition-transform active:scale-95 md:hidden",
              mobileInitialIndex !== undefined &&
                "max-md:!size-[clamp(1.75rem,6.4vw,2.5rem)]",
            )}
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
              <span aria-hidden="true">‹</span>
            )}
          </button>
          <button
            className={cn(
              "absolute top-1/2 right-[3.5%] z-20 grid size-7 -translate-y-1/2 place-items-center overflow-hidden rounded-full bg-brand text-white shadow-[0_4px_12px_rgb(244_122_42/.3)] transition-transform active:scale-95 md:hidden",
              mobileInitialIndex !== undefined &&
                "max-md:!size-[clamp(1.75rem,6.4vw,2.5rem)]",
            )}
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
              <span aria-hidden="true">›</span>
            )}
          </button>
          <div
            className="mt-3 flex items-center justify-center gap-3 md:hidden"
            aria-hidden="true"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <span
                className={cn(
                  "size-5 rounded-full border-2",
                  mobileInitialIndex !== undefined &&
                    "max-md:!size-[clamp(1.1rem,4.2vw,1.65rem)]",
                  index === logicalActive
                    ? "border-brand bg-brand shadow-[inset_0_0_0_3px_white]"
                    : "border-charcoal bg-white",
                )}
                key={index}
              />
            ))}
          </div>
        </>
      )}

      <div
        className={cn(
          "relative z-10 mt-6 flex items-center justify-center gap-4",
          mobileMockup && "max-md:hidden",
        )}
      >
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
              className="ml-[-0.125rem]"
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
              className="mr-[-0.125rem]"
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
