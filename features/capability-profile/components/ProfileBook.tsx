"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "motion/react";

type BookStage = 0 | 1 | 2;
type TurnSide = "left" | "right";

/* Nút lật trang dùng đúng nút cam + hiệu ứng hover của carousel dự án trong
   4 trang dịch vụ con (features/services/components/ProjectCarousel.tsx):
   cùng class và cùng cặp icon nav-prev/nav-next. */
const navButtonClass =
  "grid size-9 place-items-center overflow-hidden rounded-full bg-brand text-white shadow-[0_4px_10px_rgba(244,122,42,0.25)] transition-all duration-300 hover:scale-110 hover:brightness-110 hover:saturate-105 hover:shadow-[0_6px_14px_rgba(244,122,42,0.35)] active:scale-95 disabled:pointer-events-none max-md:size-7";
const navIcons = {
  prev: "/images/cai-tao-sua-chua/nav-prev.png",
  next: "/images/cai-tao-sua-chua/nav-next.png",
} as const;

const pages = {
  cover: "/images/capability-profile/profile-page-17.webp",
  contents: "/images/capability-profile/profile-page-18.webp",
  letter: "/images/capability-profile/profile-page-19.webp",
  back: "/images/capability-profile/profile-page-20.webp",
} as const;

function DraggablePage({
  side,
  src,
  alt,
  onTurn,
  flipRef,
}: {
  side: TurnSide;
  src: string;
  alt: string;
  onTurn: () => void;
  flipRef: MutableRefObject<(() => void) | null>;
}) {
  const controls = useDragControls();
  const x = useMotionValue(0);
  const rotateY = useTransform(
    x,
    side === "right" ? [-320, 0] : [0, 320],
    side === "right" ? [-178, 0] : [0, 178],
  );

  /* Mũi tên lật trang chạy đúng animation của cú kéo tay: đẩy x tới hết biên
     để trang xoay quanh gáy sách, thay vì đổi stage đột ngột. */
  useEffect(() => {
    flipRef.current = () => {
      animate(x, side === "right" ? -320 : 320, {
        duration: 0.78,
        ease: [0.32, 0, 0.28, 1],
        onComplete: onTurn,
      });
    };
    return () => {
      flipRef.current = null;
    };
  }, [flipRef, onTurn, side, x]);

  function finishDrag(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const completed = side === "right" ? info.offset.x < -72 : info.offset.x > 72;
    if (completed) {
      animate(x, side === "right" ? -320 : 320, {
        type: "spring",
        stiffness: 240,
        damping: 30,
        onComplete: onTurn,
      });
      return;
    }

    animate(x, 0, { type: "spring", stiffness: 320, damping: 34 });
  }

  return (
    <>
      <motion.div
        className={`absolute top-0 bottom-0 z-20 w-1/2 overflow-hidden shadow-[0_8px_18px_rgb(44_38_34/.14)] [backface-visibility:hidden] [transform-style:preserve-3d] ${side === "right" ? "right-0 origin-left" : "left-0 origin-right"}`}
        drag="x"
        dragControls={controls}
        dragListener={false}
        dragConstraints={side === "right" ? { left: -320, right: 0 } : { left: 0, right: 320 }}
        dragElastic={0.04}
        onDragEnd={finishDrag}
        style={{ rotateY }}
      >
        <Image className="h-full w-full object-cover" src={src} alt={alt} width={1240} height={1754} sizes="(max-width: 767px) 44vw, 470px" draggable={false} />
        <span className={`pointer-events-none absolute inset-y-0 w-12 ${side === "right" ? "left-0 bg-gradient-to-r from-black/10 to-transparent" : "right-0 bg-gradient-to-l from-black/10 to-transparent"}`} aria-hidden="true" />
      </motion.div>
      <button
        className={`absolute inset-y-0 z-30 w-[16%] cursor-grab touch-none bg-transparent active:cursor-grabbing ${side === "right" ? "right-0" : "left-0"}`}
        type="button"
        aria-label={side === "right" ? "Kéo để lật sang trang sau" : "Kéo để lật về trang trước"}
        onPointerDown={(event) => controls.start(event)}
      />
    </>
  );
}

export function ProfileBook() {
  const [stage, setStage] = useState<BookStage>(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const reduceMotion = useReducedMotion();

  /* Hai hàm lật trang do DraggablePage đăng ký; null khi không ở trang đôi
     hoặc khi người dùng bật giảm chuyển động. */
  const flipLeftRef = useRef<(() => void) | null>(null);
  const flipRightRef = useRef<(() => void) | null>(null);
  const flippingRef = useRef(false);

  useEffect(() => {
    flippingRef.current = false;
  }, [stage]);

  function goTo(next: BookStage) {
    if (next === stage) return;
    setDirection(next > stage ? 1 : -1);
    setStage(next);
  }

  /* Ở trang đôi, mũi tên chạy hiệu ứng lật trang thật (dùng lại animation của
     thao tác kéo); ở bìa trước/bìa sau thì đổi stage như cũ. */
  function turnPage(direction: -1 | 1) {
    if (flippingRef.current) return;
    const flip = direction < 0 ? flipLeftRef.current : flipRightRef.current;
    if (stage === 1 && flip) {
      flippingRef.current = true;
      flip();
      return;
    }
    goTo((stage + direction) as BookStage);
  }

  const turnDuration = reduceMotion ? 0 : 0.7;

  /* Khổ được canh theo TRANG BÌA: bìa (aspect .707, cao 94% khung) rộng
     ≈ 0.468 × bề ngang khung, nên khung ~992px cho bìa ~465px — nhỉnh hơn
     dòng tiêu đề "HỒ SƠ DOANH NGHIỆP" một chút. Khi mở ra, trang đôi tự
     rộng gấp đôi bìa. */
  return (
    <div className="relative mx-auto grid min-h-[300px] max-w-[1080px] grid-cols-[36px_minmax(0,1fr)_36px] items-center gap-1.5 max-md:grid-cols-[28px_minmax(0,1fr)_28px] max-md:gap-1 md:min-h-[520px] xl:min-h-[700px]">
      <button
        className={`${navButtonClass} justify-self-end ${stage === 0 ? "opacity-0" : "opacity-100"}`}
        type="button"
        aria-label="Trang trước"
        disabled={stage === 0}
        onClick={() => turnPage(-1)}
      >
        <Image className="size-full object-cover" src={navIcons.prev} alt="" width={48} height={48} aria-hidden="true" />
      </button>

      <div className="relative mx-auto aspect-[1.42] w-full max-w-[1000px] [perspective:1800px]">
        <AnimatePresence mode="wait" initial={false}>
          {stage === 0 && (
            <motion.button
              className="absolute inset-y-[3%] left-1/2 aspect-[.707] -translate-x-1/2 cursor-pointer overflow-hidden bg-white shadow-[0_10px_24px_rgb(41_34_30/.20)] [transform-style:preserve-3d]"
              key="cover"
              type="button"
              aria-label="Mở hồ sơ doanh nghiệp BMT Decor"
              initial={reduceMotion ? false : { opacity: 0, scale: 1.05, rotateY: direction < 0 ? -75 : 0 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotateY: -78, scale: 0.96 }}
              transition={{ duration: turnDuration, ease: [0.16, 1, 0.3, 1] }}
              whileHover={reduceMotion ? undefined : { scale: 1.015 }}
              onClick={() => goTo(1)}
            >
              <Image className="h-full w-full object-cover" src={pages.cover} alt="Bìa hồ sơ năng lực BMT Decor" width={1240} height={1754} sizes="(max-width: 767px) 56vw, 470px" priority />
            </motion.button>
          )}

          {stage === 1 && (
            <motion.div
              className="absolute inset-x-[1%] top-1/2 aspect-[1.414] -translate-y-1/2 bg-white shadow-[0_10px_26px_rgb(41_34_30/.18)] [transform-style:preserve-3d]"
              key="spread"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97, rotateY: direction > 0 ? 20 : -20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, rotateY: direction > 0 ? -20 : 20 }}
              transition={{ duration: turnDuration, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="absolute inset-0 grid grid-cols-2 overflow-hidden">
                <Image className="h-full w-full object-cover" src={pages.contents} alt="Mục lục hồ sơ doanh nghiệp BMT Decor" width={1240} height={1754} sizes="(max-width: 767px) 44vw, 470px" />
                <Image className="h-full w-full object-cover" src={pages.letter} alt="Lời ngỏ trong hồ sơ doanh nghiệp BMT Decor" width={1240} height={1754} sizes="(max-width: 767px) 44vw, 470px" />
              </div>
              {!reduceMotion && (
                <>
                  <DraggablePage side="left" src={pages.contents} alt="Mục lục hồ sơ doanh nghiệp BMT Decor" onTurn={() => goTo(0)} flipRef={flipLeftRef} />
                  <DraggablePage side="right" src={pages.letter} alt="Lời ngỏ trong hồ sơ doanh nghiệp BMT Decor" onTurn={() => goTo(2)} flipRef={flipRightRef} />
                </>
              )}
              <span className="pointer-events-none absolute inset-y-0 left-1/2 z-40 w-px -translate-x-1/2 bg-black/15 shadow-[0_0_12px_3px_rgb(0_0_0/.12)]" aria-hidden="true" />
            </motion.div>
          )}

          {stage === 2 && (
            <motion.div
              className="absolute inset-y-[3%] left-1/2 aspect-[.707] -translate-x-1/2 overflow-hidden bg-white shadow-[0_10px_24px_rgb(41_34_30/.20)] [transform-style:preserve-3d]"
              key="back"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97, rotateY: -78 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotateY: 78, scale: 0.96 }}
              transition={{ duration: turnDuration, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image className="h-full w-full object-cover" src={pages.back} alt="Bìa sau hồ sơ năng lực BMT Decor" width={1240} height={1754} sizes="(max-width: 767px) 56vw, 470px" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        className={`${navButtonClass} justify-self-start ${stage === 0 ? "opacity-0" : stage === 2 ? "opacity-25" : "opacity-100"}`}
        type="button"
        aria-label="Trang sau"
        disabled={stage === 2}
        onClick={() => turnPage(1)}
      >
        <Image className="size-full object-cover" src={navIcons.next} alt="" width={48} height={48} aria-hidden="true" />
      </button>
    </div>
  );
}
