"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";

type Stage = 0 | 1 | 2;
type SheetIndex = 0 | 1;
type Side = "left" | "right";

/* Nút lật trang dùng đúng nút cam + hiệu ứng hover của carousel dự án trong
   4 trang dịch vụ con (features/services/components/ProjectCarousel.tsx):
   cùng class và cùng cặp icon nav-prev/nav-next. */
const navButtonClass =
  "grid size-9 place-items-center overflow-hidden rounded-full bg-brand text-white shadow-[0_4px_10px_rgba(244,122,42,0.25)] transition-all duration-300 hover:scale-110 hover:brightness-110 hover:saturate-105 hover:shadow-[0_6px_14px_rgba(244,122,42,0.35)] active:scale-95 disabled:pointer-events-none max-md:size-6";
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

const labels = {
  cover: "Bìa hồ sơ năng lực BMT Decor",
  contents: "Mục lục hồ sơ doanh nghiệp BMT Decor",
  letter: "Lời ngỏ trong hồ sơ doanh nghiệp BMT Decor",
  back: "Bìa sau hồ sơ năng lực BMT Decor",
} as const;

/* Cuốn hồ sơ là 2 TỜ GIẤY vật lý, mỗi tờ in 2 mặt:
     tờ 0 = bìa trước / mục lục  → lật qua lại giữa stage 0 và 1
     tờ 1 = lời ngỏ / bìa sau    → lật qua lại giữa stage 1 và 2
   Mặt trước luôn nằm nửa phải khi chưa lật, mặt sau nằm nửa trái sau khi lật
   xong — đúng như cầm cuốn sách thật. */
const sheets = [
  { front: pages.cover, back: pages.contents, frontLabel: labels.cover, backLabel: labels.contents },
  { front: pages.letter, back: pages.back, frontLabel: labels.letter, backLabel: labels.back },
] as const;

/* Tờ giấy được cắt thành nhiều dải dọc, mỗi dải xoay lệch nhau một chút để
   ghép lại thành mặt cong — đây là mấu chốt để trang lật cong như giấy thật
   thay vì xoay phẳng cứng như một tấm bìa. 18 dải là mức đủ mượt mà GPU vẫn
   nhẹ. */
const STRIP_COUNT = 18;
/* Tổng độ cong (độ) của tờ giấy, đạt đỉnh ở giữa cú lật rồi phẳng lại ở 2 đầu. */
const MAX_BEND = 76;
/* Trần của độ cong khi tờ giấy dựng gần vuông góc: cong tối đa gấp `FOLD_GUARD`
   lần khoảng cách từ giữa cú lật. Không có trần này thì ở giữa cú lật một nửa
   số dải đã quay quá mốc 90° trong khi nửa kia chưa — tờ giấy GẤP ĐÔI ngay
   giữa mặt. Quanh nếp gấp mọi dải đều gần vuông góc với màn hình nên chiếu
   xuống chỉ còn bề ngang dưới 1px, không dải nào phủ kín nổi cột pixel đó và
   nền lọt qua thành vệt trắng (chồng mí cũng bị bóp về 0 nên vô hiệu). Để dưới
   360 là cả tờ luôn nghiêng về cùng một phía, không bao giờ có nếp gấp. */
const FOLD_GUARD = 300;
/* Mỗi dải được nới rộng thêm chừng này (theo tỉ lệ bề ngang dải) về mỗi bên để
   CHỒNG MÍ lên dải kế bên. Hai dải liền nhau nghiêng khác góc nên mỗi mối nối
   là một cạnh 3D được khử răng cưa riêng: nếu chúng chỉ chạm nhau đúng mép thì
   pixel ở mối nối không được phủ kín, lộ ra thành vệt dọc làm ảnh trông như bị
   rách.

   Mức chồng mí phải tính theo tỉ lệ (không dùng px) thì phép bù ảnh nền trong
   `faceStyle` mới khớp tuyệt đối ở mọi khổ. Nhưng bề ngang dải co theo màn
   hình, nên tỉ lệ phải đủ lớn để cả khổ nhỏ nhất vẫn còn dư:
     desktop khung ~940px -> nửa trang 470 -> dải 26,1px  -> chồng mí 2,35px
     mobile  khung ~294px -> nửa trang 147 -> dải  8,2px  -> chồng mí 0,74px
   Mức 3% cũ chỉ cho 0,25px ở mobile — mỏng hơn cả vệt khử răng cưa (1 pixel
   THẬT của màn, tức 0,33px CSS ở dpr 3) nên mối nối lại hở ra. 9% phủ kín được
   cả hai đầu. */
const OVERLAP = 0.09;
/* Nhấc tờ giấy khỏi mặt sách chừng này px để nó không nằm trùng mặt phẳng với
   trang tĩnh bên dưới — 2 mặt trùng nhau trong không gian 3D sẽ chớp giật. */
const LIFT = 1;
/* Độ hé của mép ngoài khi rê chuột lên bìa — gợi ý "trang này lật được". */
const PEEK = 0.05;
const EASE = [0.4, 0.02, 0.22, 1] as const;

/* Góc của dải đầu tiên (sát gáy) và độ lệch góc giữa 2 dải liền nhau.
   Mép ngoài đi trước, mép gáy theo sau — giống hệt khi ta nhấc mép trang lên. */
function bend(progress: number, maxBend: number = MAX_BEND) {
  const sweep = -180 * progress;
  const arc = Math.min(maxBend * Math.sin(Math.PI * progress), FOLD_GUARD * Math.abs(progress - 0.5));
  return { base: sweep + arc / 2, step: -arc / (STRIP_COUNT - 1) };
}

/* Trang lật mobile chỉ có 1 dải cong tại một thời điểm (không có tờ đối
   diện bù trừ thị giác như bản desktop) nên cần cong rõ hơn mới thấy được
   hiệu ứng giấy thật. */
const MOBILE_MAX_BEND = 104;

/* Độ tối của một mặt giấy theo góc nó đang quay: quay nghiêng khỏi mắt thì tối
   dần, kèm một vệt sáng hẹp giả phản chiếu lúc giấy dựng gần vuông góc. */
function shade(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const curve = 0.42 * (1 - Math.abs(Math.cos(rad)));
  const gloss = 0.2 * Math.pow(Math.max(0, Math.cos(rad + Math.PI / 6)), 6);
  return Math.max(0, Math.min(0.55, curve - gloss));
}

/* Mép trong của dải (phía gáy) và mép ngoài được nới thêm để chồng lên hàng
   xóm; 2 mép ngoài cùng của cả tờ thì không nới, nếu không sẽ thừa ra ngoài
   khổ giấy. */
function pads(index: number) {
  return { left: index === 0 ? 0 : OVERLAP, right: index === STRIP_COUNT - 1 ? 0 : OVERLAP };
}

/* Một mặt giấy chỉ là lát cắt dọc thứ `index` của ảnh trang, lấy bằng
   background-size/position nên cả 18 dải dùng chung đúng 1 file ảnh đã tải.
   Vì dải được nới rộng ra 2 bên, ảnh nền phải thu nhỏ và dịch lại đúng bằng
   phần nới đó thì lát cắt mới nằm khớp tuyệt đối vào chỗ của nó trên trang —
   nới mà không bù thì các dải lệch nhau, lại thành đứt nét kiểu khác. Mọi con
   số đều là tỉ lệ nên khớp ở mọi khổ màn hình. */
function faceStyle(src: string, index: number, mirrored: boolean) {
  const { left, right } = pads(index);
  const slot = mirrored ? STRIP_COUNT - 1 - index : index;
  const span = STRIP_COUNT - 1 - left - right;
  return {
    left: `${-left * 100}%`,
    right: `${-right * 100}%`,
    backgroundImage: `url(${src})`,
    backgroundSize: `${(STRIP_COUNT * 100) / (1 + left + right)}% 100%`,
    backgroundPosition: `${((slot - left) * 100) / span}% 0`,
  };
}

function TurningSheet({ sheet, progress }: { sheet: SheetIndex; progress: MotionValue<number> }) {
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* Cập nhật thẳng vào DOM theo từng frame thay vì setState, để 18 dải × 2 mặt
     không kéo React re-render trong suốt cú lật. */
  useEffect(() => {
    function draw(value: number) {
      const { base, step } = bend(value);
      for (let i = 0; i < STRIP_COUNT; i += 1) {
        const strip = stripRefs.current[i];
        if (strip) strip.style.transform = `rotateY(${i === 0 ? base : step}deg)`;
        const angle = base + step * i;
        const front = shadeRefs.current[i * 2];
        const back = shadeRefs.current[i * 2 + 1];
        if (front) front.style.opacity = shade(angle).toFixed(3);
        if (back) back.style.opacity = shade(angle + 180).toFixed(3);
      }
    }

    draw(progress.get());
    return progress.on("change", draw);
  }, [progress]);

  const { front, back } = sheets[sheet];

  /* Dải i là con của dải i-1 và dựng ở mép phải của nó, nên góc xoay cộng dồn
     dần từ gáy ra mép ngoài — dựng từ trong ra ngoài rồi lồng ngược lại. */
  let stack: React.ReactNode = null;
  for (let i = STRIP_COUNT - 1; i >= 0; i -= 1) {
    const index = i;
    stack = (
      <div
        key={index}
        ref={(node) => {
          stripRefs.current[index] = node;
        }}
        className={`absolute inset-y-0 origin-left transform-3d ${index === 0 ? "left-0" : "left-full"}`}
        style={{ width: index === 0 ? `${100 / STRIP_COUNT}%` : "100%" }}
      >
        <div className="absolute inset-y-0 bg-no-repeat backface-hidden" style={faceStyle(front, index, false)}>
          <span
            className="absolute inset-0 bg-black"
            ref={(node) => {
              shadeRefs.current[index * 2] = node;
            }}
            style={{ opacity: 0 }}
          />
        </div>
        <div
          className="absolute inset-y-0 bg-no-repeat backface-hidden transform-[rotateY(180deg)]"
          style={faceStyle(back, index, true)}
        >
          <span
            className="absolute inset-0 bg-black"
            ref={(node) => {
              shadeRefs.current[index * 2 + 1] = node;
            }}
            style={{ opacity: 0 }}
          />
        </div>
        {stack}
      </div>
    );
  }

  return (
    <div
      className="absolute inset-y-0 right-0 z-30 w-1/2 transform-3d"
      style={{ transform: `translateZ(${LIFT}px)` }}
      aria-hidden="true"
    >
      {stack}
    </div>
  );
}

/* Nửa trang đứng yên bên dưới tờ đang lật. */
function StaticPage({ src, label, side }: { src: string; label: string; side: Side }) {
  return (
    <div
      className={`absolute inset-y-0 z-10 w-1/2 bg-white bg-cover bg-center ${side === "left" ? "left-0 shadow-[-5px_12px_28px_rgb(41_34_30/.18)]" : "right-0 shadow-[5px_12px_28px_rgb(41_34_30/.18)]"}`}
      style={{ backgroundImage: `url(${src})` }}
      role="img"
      aria-label={label}
    />
  );
}

function shiftFor(stage: Stage) {
  /* Sách đóng thì chỉ có 1 nửa hiện ra, nên đẩy cả khung đi 1/4 bề ngang để
     nửa đó nằm giữa màn hình — mở ra là khung trượt về 0.
     Bìa trước nằm ở nửa PHẢI nên phải kéo sang trái, bìa sau nằm ở nửa TRÁI nên
     đẩy sang phải. */
  return stage === 0 ? "-25%" : stage === 2 ? "25%" : "0%";
}

export function ProfileBook() {
  return (
    <>
      <div className="lg:hidden">
        <MobileProfileBook />
      </div>
      <div className="hidden lg:block">
        <DesktopProfileBook />
      </div>
    </>
  );
}

/* Bề ngang lớn (gần full màn hình) khiến bố cục "trang đôi" của desktop
   (2 trang A4 nằm cạnh nhau) không còn hợp lý ở mobile — trang lúc này quá
   to để hiện đủ 2 trang cùng lúc mà không bị cắt. Mobile dùng mô hình khác:
   CHỈ 1 trang hiện ra tại một thời điểm, lật từng trang một (kiểu lật app
   đọc PDF) thay vì mở ra như quyển sách vật lý của desktop. */
/* Trang lật mobile dùng lại đúng kỹ thuật "cắt dải cong" của TurningSheet
   (desktop) — chỉ khác là 1 dải phủ full bề ngang trang (không chia đôi
   spread) và mặt sau chỉ là màu giấy trơn (trang đơn không có nội dung in ở
   mặt sau). `progress` chạy 0→1 theo chiều thao tác của người dùng; `dir`
   quyết định lật xuôi (0°→-180°) hay lật ngược (-180°→0°) nên cùng một hàm
   `bend()` gốc (vốn chỉ biết lật xuôi) dùng lại được cho cả hai chiều bằng
   cách đảo ngược tham số truyền vào. */
function MobileTurningFlap({ src, progress, dir }: { src: string; progress: MotionValue<number>; dir: 1 | -1 }) {
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    function draw(value: number) {
      const t = dir === 1 ? value : 1 - value;
      const { base, step } = bend(t, MOBILE_MAX_BEND);
      for (let i = 0; i < STRIP_COUNT; i += 1) {
        const strip = stripRefs.current[i];
        if (strip) strip.style.transform = `rotateY(${i === 0 ? base : step}deg)`;
        const angle = base + step * i;
        const front = shadeRefs.current[i * 2];
        const back = shadeRefs.current[i * 2 + 1];
        if (front) front.style.opacity = shade(angle).toFixed(3);
        if (back) back.style.opacity = shade(angle + 180).toFixed(3);
      }
    }

    draw(progress.get());
    return progress.on("change", draw);
  }, [progress, dir]);

  let stack: React.ReactNode = null;
  for (let i = STRIP_COUNT - 1; i >= 0; i -= 1) {
    const index = i;
    stack = (
      <div
        key={index}
        ref={(node) => {
          stripRefs.current[index] = node;
        }}
        className={`absolute inset-y-0 origin-left transform-3d ${index === 0 ? "left-0" : "left-full"}`}
        style={{ width: index === 0 ? `${100 / STRIP_COUNT}%` : "100%" }}
      >
        <div className="absolute inset-y-0 bg-no-repeat backface-hidden" style={faceStyle(src, index, false)}>
          <span
            className="absolute inset-0 bg-black"
            ref={(node) => {
              shadeRefs.current[index * 2] = node;
            }}
            style={{ opacity: 0 }}
          />
        </div>
        <div className="absolute inset-y-0 bg-neutral-100 backface-hidden transform-[rotateY(180deg)]">
          <span
            className="absolute inset-0 bg-black"
            ref={(node) => {
              shadeRefs.current[index * 2 + 1] = node;
            }}
            style={{ opacity: 0 }}
          />
        </div>
        {stack}
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 z-20 transform-3d"
      style={{ transform: `translateZ(${LIFT}px)` }}
      aria-hidden="true"
    >
      {stack}
    </div>
  );
}

function MobileProfileBook() {
  const order = [pages.cover, pages.contents, pages.letter, pages.back] as const;
  const orderLabels = [labels.cover, labels.contents, labels.letter, labels.back] as const;

  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<{ from: number; dir: 1 | -1 } | null>(null);
  const reduceMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const busyRef = useRef(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ dir: 1 | -1; startX: number; width: number; moved: number } | null>(null);
  const draggedRef = useRef(false);

  const settle = useCallback(
    (dir: 1 | -1, to: number) => {
      const distance = Math.abs(to - progress.get());
      const duration = 0.32 + 0.5 * distance;
      busyRef.current = true;
      animate(progress, to, {
        duration,
        ease: EASE,
        onComplete: () => {
          busyRef.current = false;
          if (to === 1) {
            setIndex((current) => Math.min(order.length - 1, current + dir));
          }
          setTurn(null);
          progress.set(0);
        },
      });
    },
    [progress, order.length],
  );

  const flip = useCallback(
    (dir: 1 | -1) => {
      if (busyRef.current) return;
      const next = index + dir;
      if (next < 0 || next >= order.length) return;

      if (reduceMotion) {
        setIndex(next);
        return;
      }

      setTurn({ from: index, dir });
      progress.set(0);
      settle(dir, 1);
    },
    [index, order.length, progress, reduceMotion, settle],
  );

  function beginDrag(event: ReactPointerEvent<HTMLButtonElement>, dir: 1 | -1) {
    if (busyRef.current || reduceMotion) return;
    const next = index + dir;
    if (next < 0 || next >= order.length) return;
    const frame = frameRef.current;
    if (!frame) return;

    draggedRef.current = false;
    busyRef.current = true;
    dragRef.current = { dir, startX: event.clientX, width: frame.getBoundingClientRect().width, moved: 0 };
    setTurn({ from: index, dir });
    progress.set(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    drag.moved = Math.max(drag.moved, Math.abs(dx));
    const raw = drag.dir === 1 ? -dx / drag.width : dx / drag.width;
    progress.set(Math.min(1, Math.max(0, raw)));
  }

  function endDrag(event: ReactPointerEvent<HTMLButtonElement>, cancelled = false) {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (cancelled) {
      draggedRef.current = true;
      settle(drag.dir, 0);
      return;
    }

    if (drag.moved < 6) {
      settle(drag.dir, 1);
      return;
    }
    draggedRef.current = true;
    settle(drag.dir, progress.get() > 0.5 ? 1 : 0);
  }

  const flapIndex = turn ? (turn.dir === 1 ? turn.from : turn.from - 1) : null;
  const staticIndex = turn ? (turn.dir === 1 ? Math.min(order.length - 1, turn.from + 1) : turn.from) : index;

  return (
    <div className="relative mx-auto flex max-w-[45rem] flex-col items-center gap-4">
      {Object.values(pages).map((src) => (
        <link key={src} rel="preload" as="image" href={src} />
      ))}

      <div
        className="relative aspect-[1.414/2] w-full overflow-hidden shadow-[0_18px_45px_rgb(65_57_51/.15)] [perspective:1600px]"
        ref={frameRef}
      >
        <div
          className="absolute inset-0 z-10 bg-white bg-cover bg-center"
          style={{ backgroundImage: `url(${order[staticIndex]})` }}
          role="img"
          aria-label={orderLabels[staticIndex]}
        />

        {turn && flapIndex !== null && flapIndex >= 0 && flapIndex < order.length && (
          <MobileTurningFlap src={order[flapIndex]} progress={progress} dir={turn.dir} />
        )}

        {index > 0 && (
          <button
            className="absolute inset-y-0 left-0 z-30 w-1/4 cursor-grab touch-pan-y bg-transparent active:cursor-grabbing"
            type="button"
            aria-label="Trang trước"
            onPointerDown={(event) => beginDrag(event, -1)}
            onPointerMove={moveDrag}
            onPointerUp={(event) => endDrag(event)}
            onPointerCancel={(event) => endDrag(event, true)}
            onClick={() => {
              if (!draggedRef.current) flip(-1);
              draggedRef.current = false;
            }}
          />
        )}
        {index < order.length - 1 && (
          <button
            className="absolute inset-y-0 right-0 z-30 w-1/4 cursor-grab touch-pan-y bg-transparent active:cursor-grabbing"
            type="button"
            aria-label="Trang sau"
            onPointerDown={(event) => beginDrag(event, 1)}
            onPointerMove={moveDrag}
            onPointerUp={(event) => endDrag(event)}
            onPointerCancel={(event) => endDrag(event, true)}
            onClick={() => {
              if (!draggedRef.current) flip(1);
              draggedRef.current = false;
            }}
          />
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          className={navButtonClass}
          type="button"
          aria-label="Trang trước"
          disabled={index === 0}
          onClick={() => flip(-1)}
        >
          <Image className="size-full object-cover" src={navIcons.prev} alt="" width={48} height={48} aria-hidden="true" />
        </button>
        <button
          className={`${navButtonClass} ${index === order.length - 1 ? "opacity-25" : "opacity-100"}`}
          type="button"
          aria-label="Trang sau"
          disabled={index === order.length - 1}
          onClick={() => flip(1)}
        >
          <Image className="size-full object-cover" src={navIcons.next} alt="" width={48} height={48} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function DesktopProfileBook() {
  const [stage, setStage] = useState<Stage>(0);
  const [turning, setTurning] = useState<SheetIndex | null>(null);
  const reduceMotion = useReducedMotion();

  const progress = useMotionValue(0);
  const shift = useMotionValue(shiftFor(0));
  /* Bóng tờ đang lật hắt xuống 2 trang bên dưới, đậm nhất lúc tờ giấy dựng
     đứng giữa cú lật. */
  const castShadow = useTransform(progress, (value) => Math.sin(Math.PI * value));
  /* Độ đậm của mặt bàn lộ ra dưới tờ đang lật. Tờ 0 lật xuôi thì nửa TRÁI dần
     có trang nên nền hiện dần theo `progress`; tờ 1 lật xuôi thì nửa PHẢI dần
     trống nên nền mờ dần đi. Nhờ vậy lúc sách đóng hẳn (chỉ còn 1 nửa) nền tắt
     hẳn, không bị nhảy bụp. */
  const deskFade = useTransform(progress, (value) => 1 - value);

  const frameRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const dragRef = useRef<{ sheet: SheetIndex; from: 0 | 1; startX: number; width: number; moved: number } | null>(null);
  const draggedRef = useRef(false);

  const settle = useCallback(
    (sheet: SheetIndex, to: 0 | 1) => {
      const nextStage = (sheet === 0 ? to : to + 1) as Stage;
      const distance = Math.abs(to - progress.get());
      const duration = 0.42 + 0.62 * distance;

      busyRef.current = true;
      animate(shift, shiftFor(nextStage), { duration, ease: EASE });
      animate(progress, to, {
        duration,
        ease: EASE,
        onComplete: () => {
          busyRef.current = false;
          setStage(nextStage);
          setTurning(null);
        },
      });
    },
    [progress, shift],
  );

  const turnPage = useCallback(
    (direction: -1 | 1) => {
      if (busyRef.current) return;
      const next = stage + direction;
      if (next < 0 || next > 2) return;

      if (reduceMotion) {
        setStage(next as Stage);
        shift.set(shiftFor(next as Stage));
        return;
      }

      /* Đi tới thì lật tờ đang nằm bên phải, đi lui thì lật tờ đang nằm bên trái. */
      const sheet = (direction > 0 ? stage : stage - 1) as SheetIndex;
      setTurning(sheet);
      progress.stop();
      progress.set(direction > 0 ? 0 : 1);
      settle(sheet, direction > 0 ? 1 : 0);
    },
    [progress, reduceMotion, settle, shift, stage],
  );

  function peek(on: boolean) {
    if (busyRef.current || reduceMotion || stage !== 0) return;
    if (on) {
      setTurning(0);
      animate(progress, PEEK, { duration: 0.45, ease: "easeOut" });
      return;
    }
    animate(progress, 0, {
      duration: 0.35,
      ease: "easeOut",
      onComplete: () => {
        if (!busyRef.current) setTurning(null);
      },
    });
  }

  function beginDrag(event: ReactPointerEvent<HTMLButtonElement>, side: Side) {
    if (busyRef.current || reduceMotion) return;
    const sheet = side === "right" ? stage : stage - 1;
    const frame = frameRef.current;
    if (sheet < 0 || sheet > 1 || !frame) return;

    draggedRef.current = false;
    busyRef.current = true;
    dragRef.current = {
      sheet: sheet as SheetIndex,
      from: side === "right" ? 0 : 1,
      startX: event.clientX,
      width: frame.getBoundingClientRect().width / 2,
      moved: 0,
    };
    setTurning(sheet as SheetIndex);
    /* Dừng hẳn animation hé trang đang chạy, nếu không nó sẽ ghi đè lên vị trí
       ngón tay trong mấy frame đầu. */
    progress.stop();
    progress.set(side === "right" ? 0 : 1);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    drag.moved = Math.max(drag.moved, Math.abs(dx));
    /* Kéo trang phải sang trái (dx âm) hoặc trang trái sang phải (dx dương)
       đều đẩy tờ giấy đi đúng quãng đường ngón tay đã kéo. */
    const raw = drag.from === 0 ? -dx / drag.width : 1 - dx / drag.width;
    progress.set(Math.min(1, Math.max(0, raw)));
  }

  function endDrag(event: ReactPointerEvent<HTMLButtonElement>, cancelled = false) {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    /* Vuốt dọc để cuộn trang thì trình duyệt huỷ cú chạm này — phải trả trang
       về chỗ cũ, không được hiểu nhầm thành thao tác lật. */
    if (cancelled) {
      draggedRef.current = true;
      settle(drag.sheet, drag.from);
      return;
    }

    /* Nhấp nhẹ (gần như không kéo) thì lật trọn trang; kéo thật thì thả về
       phía gần hơn, kéo chưa quá nửa là trang tự rơi lại chỗ cũ. */
    if (drag.moved < 6) {
      settle(drag.sheet, drag.from === 0 ? 1 : 0);
      return;
    }
    draggedRef.current = true;
    settle(drag.sheet, progress.get() > 0.5 ? 1 : 0);
  }

  const spreadOpen = stage === 1 || turning !== null;
  /* Nửa nào đang có tờ giấy bay qua thì phần dưới nó là trang tĩnh sẽ lộ ra
     sau cú lật; nửa còn lại giữ nguyên trang hiện tại. */
  const leftPage = turning === 1 ? pages.contents : turning === 0 ? null : stage === 1 ? pages.contents : stage === 2 ? pages.back : null;
  const rightPage = turning === 0 ? pages.letter : turning === 1 ? null : stage === 0 ? pages.cover : stage === 1 ? pages.letter : null;
  const leftLabel = leftPage === pages.back ? labels.back : labels.contents;
  const rightLabel = rightPage === pages.cover ? labels.cover : labels.letter;

  const grabbable = !reduceMotion;

  return (
    <div className="relative mx-auto grid max-w-[1080px] grid-cols-2 items-center gap-3 [grid-template-areas:'frame_frame'_'prev_next'] md:min-h-[500px] md:grid-cols-[36px_minmax(0,1fr)_36px] md:gap-1.5 md:[grid-template-areas:'prev_frame_next'] xl:min-h-[660px]">
      {/* Mobile xếp ảnh sách phía trên, 2 nút lật nằm thành 1 hàng ngay dưới
          (giữa khung), khớp mockup — desktop giữ nguyên bố cục 3 cột cũ (nút
          nằm 2 bên khung) qua vùng grid-area riêng cho từng khổ màn hình. */}
      {/* Nạp sẵn cả 4 mặt giấy để cú lật đầu tiên không bị trắng trang. */}
      {Object.values(pages).map((src) => (
        <link key={src} rel="preload" as="image" href={src} />
      ))}

      <button
        className={`${navButtonClass} [grid-area:prev] justify-self-end md:justify-self-end`}
        type="button"
        aria-label="Trang trước"
        disabled={stage === 0}
        onClick={() => turnPage(-1)}
      >
        <Image className="size-full object-cover" src={navIcons.prev} alt="" width={48} height={48} aria-hidden="true" />
      </button>

      {/* Khung = khổ TRANG ĐÔI (2 trang A4 dọc cạnh nhau, tỉ lệ 1.414). Bìa khi
          đóng rộng đúng nửa khung ≈ 470px — nhỉnh hơn dòng tiêu đề
          "HỒ SƠ DOANH NGHIỆP" một chút, giữ đúng khổ đã canh trước đó. */}
      <div className="relative mx-auto aspect-[1.414] w-full max-w-[940px] [grid-area:frame] [perspective:2200px] [perspective-origin:50%_45%]" ref={frameRef}>
        <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ x: shift }}>
          {/* Tờ giấy nghiêng lên thì bề ngang chiếu xuống màn hình của nó hẹp
              lại, hở ra nửa sách nằm sau nó — mà nửa đó không có trang tĩnh nào
              (trang của nó chính là mặt đang nằm trên tờ giấy đang lật). Trải
              lớp nền này để chỗ hở trông như mặt bàn dưới cuốn sách chứ không
              phải một vệt trắng bị rách. */}
          {turning === 0 && (
            <motion.span
              className="pointer-events-none absolute inset-y-0 left-0 z-0 w-1/2 bg-[linear-gradient(90deg,rgb(41_34_30/.16)_0%,rgb(41_34_30/.11)_52%,rgb(41_34_30/.24)_100%)]"
              style={{ opacity: progress }}
              aria-hidden="true"
            />
          )}
          {turning === 1 && (
            <motion.span
              className="pointer-events-none absolute inset-y-0 right-0 z-0 w-1/2 bg-[linear-gradient(270deg,rgb(41_34_30/.16)_0%,rgb(41_34_30/.11)_52%,rgb(41_34_30/.24)_100%)]"
              style={{ opacity: deskFade }}
              aria-hidden="true"
            />
          )}

          {leftPage && <StaticPage src={leftPage} label={leftLabel} side="left" />}
          {rightPage && <StaticPage src={rightPage} label={rightLabel} side="right" />}

          {turning !== null && !reduceMotion && <TurningSheet sheet={turning} progress={progress} />}

          {/* Bóng tờ giấy hắt xuống trang bên dưới, toả ra từ gáy sách. Chỉ vẽ
              trên nửa nào thực sự có trang, nếu không sẽ thành vệt đen lơ lửng
              trên nền lúc sách còn đóng. */}
          {leftPage && (
            <motion.span
              className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/2 bg-[linear-gradient(to_left,rgb(0_0_0/.3),transparent_62%)]"
              style={{ opacity: castShadow }}
              aria-hidden="true"
            />
          )}
          {rightPage && (
            <motion.span
              className="pointer-events-none absolute inset-y-0 right-0 z-20 w-1/2 bg-[linear-gradient(to_right,rgb(0_0_0/.3),transparent_62%)]"
              style={{ opacity: castShadow }}
              aria-hidden="true"
            />
          )}

          {/* Gáy sách: vệt tối mềm loang vào 2 trang, không phải đường kẻ 1px.
              Tách làm 2 nửa để nửa nào chưa có trang thì không hiện. */}
          <span
            className={`pointer-events-none absolute inset-y-0 right-1/2 z-20 w-[4.5%] bg-[linear-gradient(90deg,transparent_0%,rgb(0_0_0/.05)_28%,rgb(0_0_0/.22)_100%)] transition-opacity duration-500 ${spreadOpen && leftPage ? "opacity-100" : "opacity-0"}`}
            aria-hidden="true"
          />
          <span
            className={`pointer-events-none absolute inset-y-0 left-1/2 z-20 w-[4.5%] bg-[linear-gradient(90deg,rgb(0_0_0/.22)_0%,rgb(0_0_0/.05)_72%,transparent_100%)] transition-opacity duration-500 ${spreadOpen && rightPage ? "opacity-100" : "opacity-0"}`}
            aria-hidden="true"
          />

          {grabbable && stage > 0 && (
            <button
              className="absolute inset-y-0 left-0 z-40 w-1/2 cursor-grab touch-pan-y bg-transparent active:cursor-grabbing"
              type="button"
              aria-label="Lật về trang trước"
              onPointerDown={(event) => beginDrag(event, "left")}
              onPointerMove={moveDrag}
              onPointerUp={(event) => endDrag(event)}
              onPointerCancel={(event) => endDrag(event, true)}
              onClick={() => {
                if (!draggedRef.current) turnPage(-1);
                draggedRef.current = false;
              }}
            />
          )}
          {grabbable && stage < 2 && (
            <button
              className="absolute inset-y-0 right-0 z-40 w-1/2 cursor-grab touch-pan-y bg-transparent active:cursor-grabbing"
              type="button"
              aria-label={stage === 0 ? "Mở hồ sơ doanh nghiệp BMT Decor" : "Lật sang trang sau"}
              onPointerDown={(event) => beginDrag(event, "right")}
              onPointerMove={moveDrag}
              onPointerUp={(event) => endDrag(event)}
              onPointerCancel={(event) => endDrag(event, true)}
              onPointerEnter={() => peek(true)}
              onPointerLeave={() => peek(false)}
              onClick={() => {
                if (!draggedRef.current) turnPage(1);
                draggedRef.current = false;
              }}
            />
          )}
        </motion.div>
      </div>

      <button
        className={`${navButtonClass} [grid-area:next] justify-self-start md:justify-self-start ${stage === 2 ? "opacity-25" : "opacity-100"}`}
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
