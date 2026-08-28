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
import { cn } from "@/shared/lib/utils";

export type FeaturedProject = {
  id: string;
  image: string;
  tag: string;
  title: string;
  fit?: "contain" | "cover";
  zoom?: boolean;
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

const getCardDepthClass = (distance: number, isMobileMockup: boolean) => {
  if (distance === 0) {
    return "[--card-scale-x:1] [--card-scale-y:1]";
  }

  /* Mobile bám mockup: thẻ phụ chỉ thu nhỏ đều 0.82 như bản cũ, không bóp riêng
     trục ngang — nhờ vậy chúng nằm trọn ngoài khung nhìn thay vì ló mép vào. */
  if (distance === 1) {
    return cn(
      "[--card-scale-x:0.78] [--card-scale-y:0.94]",
      isMobileMockup &&
        "max-md:[--card-scale-x:0.82] max-md:[--card-scale-y:0.82]",
    );
  }

  return cn(
    "[--card-scale-x:0.64] [--card-scale-y:0.82]",
    isMobileMockup &&
      "max-md:[--card-scale-x:0.82] max-md:[--card-scale-y:0.82]",
  );
};

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
  const [animate, setAnimate] = useState(true);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dragStartX = useRef<number | null>(null);
  const wrapSettleFrameRef = useRef<number | null>(null);
  const wrapResetFrameRef = useRef<number | null>(null);
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
    if (wrapSettleFrameRef.current !== null) {
      cancelAnimationFrame(wrapSettleFrameRef.current);
      wrapSettleFrameRef.current = null;
    }
    if (wrapResetFrameRef.current !== null) {
      cancelAnimationFrame(wrapResetFrameRef.current);
      wrapResetFrameRef.current = null;
    }
    setAnimate(true);
    setActive((current) => current + direction);
  }, []);

  /* Căn track trực tiếp trong layout phase để cú đổi từ bản sao ngoài về bộ giữa
     không tạo thêm một render lệch vị trí, vốn nhìn giống như carousel reload. */
  useLayoutEffect(() => {
    const align = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const card = cardRefs.current[active];
      if (!viewport || !track || !card) return;
      const nextOffset =
        viewport.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
      track.style.transform = `translate3d(${nextOffset}px, 0, 0)`;
    };

    align();
    const observer = new ResizeObserver(align);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [active]);

  /* Giữ transition tắt trọn một frame sau khi đổi bản sao, rồi mới bật lại.
     Hai requestAnimationFrame đảm bảo trình duyệt đã vẽ vị trí reset ổn định. */
  useEffect(() => {
    if (animate) return;
    let enableFrame = 0;
    const resetFrame = requestAnimationFrame(() => {
      enableFrame = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(resetFrame);
      cancelAnimationFrame(enableFrame);
    };
  }, [animate]);

  useEffect(
    () => () => {
      if (wrapSettleFrameRef.current !== null) {
        cancelAnimationFrame(wrapSettleFrameRef.current);
      }
      if (wrapResetFrameRef.current !== null) {
        cancelAnimationFrame(wrapResetFrameRef.current);
      }
    },
    [],
  );

  /* Chỉ nhận transition của track. Transition từ card con cũng bubble lên và
     có thể khiến vòng lặp reset trước khi track trượt xong. */
  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== "transform"
    ) {
      return;
    }
    if (active >= count && active < count * 2) return;

    /* Đợi trạng thái cuối của card được vẽ trọn một frame rồi mới teleport.
       Nhờ vậy thẻ phụ không bị chốt scale sớm hơn một nhịp ở điểm nối vòng. */
    wrapSettleFrameRef.current = requestAnimationFrame(() => {
      wrapResetFrameRef.current = requestAnimationFrame(() => {
        setAnimate(false);
        setActive((current) => {
          if (current >= count && current < count * 2) return current;
          return count + (((current % count) + count) % count);
        });
        wrapSettleFrameRef.current = null;
        wrapResetFrameRef.current = null;
      });
    });
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
      <Image
        className="-z-10 object-cover object-bottom"
        src={backgroundImage || "/images/home/blueprint-background.png"}
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
      />

      <div
        ref={viewportRef}
        className={cn(
          "relative left-1/2 w-screen -translate-x-1/2 touch-pan-y overflow-hidden py-4 select-none sm:py-5 lg:py-6",
          mobileMockup && "max-md:py-0",
        )}
        style={{
          perspective: "1600px",
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d",
        }}
        tabIndex={0}
        role="group"
        aria-label="Dự án tiêu biểu"
        onTouchStart={(event) => {
          dragStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => endDrag(event.changedTouches[0].clientX)}
        onPointerDown={(event) => {
          if (event.pointerType === "touch") return;
          event.currentTarget.setPointerCapture(event.pointerId);
          dragStartX.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (event.pointerType === "touch") return;
          endDrag(event.clientX);
        }}
        onPointerCancel={() => {
          dragStartX.current = null;
        }}
      >
        <div
          ref={trackRef}
          className={cn(
            "flex w-max items-end [transform-style:preserve-3d]",
            animate &&
              "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          )}
          style={{
            transform: "translate3d(0, 0, 0)",
            transformStyle: "preserve-3d",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((project, index) => {
            const isActive = index === active;
            const distance = Math.abs(index - active);
            const relativePosition = index - active;
            const rotateY =
              relativePosition < 0 ? 17 : relativePosition > 0 ? -17 : 0;
            const translateZ =
              distance === 0 ? 0 : distance === 1 ? -50 : -110;
            const transformOriginClass =
              relativePosition < 0
                ? "[transform-origin:right_center]"
                : relativePosition > 0
                  ? "[transform-origin:left_center]"
                  : "[transform-origin:center_center]";

            return (
              <div
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                className={cn(
                  "relative -mr-8 aspect-[1.257] w-[74vw] shrink-0 overflow-hidden rounded-[1.25rem] sm:-mr-[6vw] sm:w-[48vw] sm:rounded-[1.5rem] lg:w-[38vw] lg:max-w-[34rem] lg:rounded-[2rem]",
                  "[--card-3d:1] [backface-visibility:hidden] [transform-style:preserve-3d]",
                  transformOriginClass,
                  animate &&
                    "transition-[transform,opacity,filter] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  getCardDepthClass(distance, mobileMockup),
                  /* Mockup mobile chỉ có đúng một thẻ: rộng 86vw, chừa khoảng
                     dương với thẻ kế, không nghiêng và không lùi chiều sâu — nhờ
                     vậy hai thẻ bên cạnh nằm hẳn ngoài mép màn hình thay vì ló
                     vào một dải. Desktop giữ nguyên lớp 3D. */
                  mobileMockup &&
                    "max-md:mr-4 max-md:w-[86vw] max-md:rounded-[1.75rem] max-md:[--card-3d:0] max-md:[transform-origin:center_center]",
                  mobileInitialIndex !== undefined && "max-md:!w-[86vw]",
                  distance === 0 && "opacity-100 saturate-100",
                  distance === 1 &&
                    "cursor-pointer opacity-94 saturate-[0.94] hover:opacity-100 active:opacity-100",
                  distance >= 2 &&
                    "pointer-events-none opacity-0 saturate-[0.88]",
                )}
                key={`${project.id}-${index}`}
                /* Độ sâu và độ nghiêng nhân với hệ số `--card-3d`, đặt bằng
                   class nên nấc max-md hạ được về 0 — inline style thì media
                   query không với tới. */
                style={
                  {
                    transform:
                      "perspective(1600px) translateZ(calc(var(--card-depth) * var(--card-3d))) rotateY(calc(var(--card-tilt) * var(--card-3d))) scale3d(var(--card-scale-x), var(--card-scale-y), 1)",
                    transformStyle: "preserve-3d",
                    zIndex: Math.max(1, slides.length - distance),
                    "--card-depth": `${translateZ}px`,
                    "--card-tilt": `${rotateY}deg`,
                  } as React.CSSProperties
                }
                onClick={() => {
                  if (!isActive) {
                    move(index - active);
                  }
                }}
              >
                <div className="absolute inset-0">
                  <Image
                    className="scale-105 object-cover opacity-45 blur-xl"
                    src={project.image}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 86vw, (max-width: 1023px) 48vw, min(38vw, 544px)"
                    draggable={false}
                    aria-hidden="true"
                  />
                  <Image
                    className={cn(
                      project.fit === "cover"
                        ? "object-cover"
                        : "object-contain",
                      project.zoom && "scale-[1.025]",
                    )}
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 767px) 86vw, (max-width: 1023px) 48vw, min(38vw, 544px)"
                    draggable={false}
                  />

                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#F47A2A] via-[#F47A2A]/88 to-transparent"
                    aria-hidden="true"
                  />

                  <div
                    className={cn(
                      "absolute bottom-0 flex flex-col items-center justify-end p-5 pb-6 text-center text-white",
                      relativePosition < 0 && "right-[18%] left-0",
                      relativePosition === 0 && "inset-x-0",
                      relativePosition > 0 && "right-0 left-[18%]",
                    )}
                  >
                    <p
                      className={cn(
                        "mb-1 text-xs font-light tracking-[0.035em] uppercase sm:text-sm",
                        mobileInitialIndex !== undefined &&
                          "max-md:text-[clamp(0.75rem,3vw,1.05rem)]",
                      )}
                    >
                      {project.tag}
                    </p>
                    <h3
                      className={cn(
                        "font-heading text-lg leading-tight font-bold uppercase sm:text-xl lg:text-[1.375rem]",
                        mobileInitialIndex !== undefined &&
                          "max-md:text-[clamp(1rem,3.7vw,1.4rem)]",
                      )}
                    >
                      {project.title}
                    </h3>
                  </div>
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
          "relative z-10 mt-3 flex items-center justify-center gap-5 sm:mt-4 sm:gap-6",
          mobileMockup && "max-md:hidden",
        )}
      >
        <button
          className="grid size-9 place-items-center overflow-hidden rounded-full bg-brand text-white shadow-[0_4px_10px_rgba(244,122,42,0.25)] transition-all duration-300 ease-out hover:-translate-y-[5px] hover:scale-110 hover:brightness-110 hover:saturate-105 hover:shadow-[0_6px_14px_rgba(244,122,42,0.35)] active:translate-y-[2px] active:scale-95"
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
          className="grid size-9 place-items-center overflow-hidden rounded-full bg-brand text-white shadow-[0_4px_10px_rgba(244,122,42,0.25)] transition-all duration-300 ease-out hover:-translate-y-[5px] hover:scale-110 hover:brightness-110 hover:saturate-105 hover:shadow-[0_6px_14px_rgba(244,122,42,0.35)] active:translate-y-[2px] active:scale-95"
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
