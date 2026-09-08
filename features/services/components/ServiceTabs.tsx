"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/shared/components/Reveal";
import { serviceTabs } from "@/features/services/data/overview";
import { cn } from "@/shared/lib/utils";

const FADE_DURATION = 240;

// Điểm ngắt dòng cố định cho nhãn tab ở mobile, đúng theo mockup (không phụ
// thuộc browser tự xuống dòng theo bề rộng cột, vốn không ra đúng điểm ngắt
// mong muốn). Từ lg trở lên vẫn hiện nhãn gốc trên một dòng như cũ.
const MOBILE_TAB_LINES = [
  ["XÂY DỰNG", "TRỌN GÓI"],
  ["THIẾT KẾ KIẾN TRÚC &", "NỘI THẤT"],
  ["THI CÔNG", "XÂY DỰNG"],
  ["CẢI TẠO &", "SỬA CHỮA"],
] as const;

// Điện thoại hẹp cần thêm một điểm ngắt ở nhãn dài nhất để bốn tab vẫn nằm
// trọn trong viewport. Từ 481px trở lên dùng đúng bản hai dòng của mockup.
const NARROW_MOBILE_TAB_LINES = [
  ["XÂY DỰNG", "TRỌN GÓI"],
  ["THIẾT KẾ", "KIẾN TRÚC &", "NỘI THẤT"],
  ["THI CÔNG", "XÂY DỰNG"],
  ["CẢI TẠO &", "SỬA CHỮA"],
] as const;

// Điểm ngắt dòng cố định cho TIÊU ĐỀ bên cạnh số 01/02/03/04 (khác với nhãn
// tab phía trên): cả 4 tiêu đề đều nằm gọn 1 dòng (vd "GÓI"/"NỘI THẤT" không
// được rớt xuống dòng riêng) — "Thiết kế kiến trúc & nội thất" dài nhất nên
// dùng cỡ chữ nhỏ hơn riêng, xem NOWRAP_TITLE_INDEXES bên dưới.
const DETAIL_TITLE_LINES = [
  ["XÂY DỰNG TRỌN GÓI"],
  ["THIẾT KẾ KIẾN TRÚC & NỘI THẤT"],
  ["THI CÔNG XÂY DỰNG"],
  ["CẢI TẠO & SỬA CHỮA"],
] as const;

// Tiêu đề dài nhất trong 4 tiêu đề trên cần thu nhỏ cỡ chữ ở mobile/tablet để
// vẫn nằm gọn 1 dòng thay vì tự động ngắt dòng theo bề rộng cột.
const NOWRAP_SMALL_TITLE_INDEXES = new Set([1]);

/**
 * Khoảng cách ngang từ `node` tới `container`, tính theo layout (bỏ qua mọi
 * `transform` đang chạy). Cộng dồn theo chuỗi offsetParent để vẫn đúng nếu sau
 * này có lớp bọc trung gian được đặt `position: relative`.
 */
function offsetLeftWithin(node: HTMLElement, container: HTMLElement) {
  let left = 0;
  let current: HTMLElement | null = node;

  while (current && current !== container) {
    left += current.offsetLeft;
    current = current.offsetParent as HTMLElement | null;
  }

  return left;
}

export function ServiceTabs() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const [faded, setFaded] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  /* Vạch ngang dưới hàng tab: bắt đầu đúng ở chữ đầu của tab 1 và kết thúc
     đúng ở chữ cuối của tab 4, thay vì kéo hết bề rộng container như trước. */
  const [rule, setRule] = useState({ left: 0, width: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  useEffect(() => {
    const container = tabsRef.current;
    const activeLabel = labelRefs.current[active];
    const firstLabel = labelRefs.current[0];
    const lastLabel = labelRefs.current[serviceTabs.length - 1];
    if (!container || !activeLabel || !firstLabel || !lastLabel) return;

    /* Đo bằng offsetLeft/offsetWidth chứ KHÔNG dùng getBoundingClientRect:
       <Reveal from="left"> trượt nhãn vào bằng `transform`, mà rect thì tính cả
       transform — nên lần đo đầu tiên (lúc hiệu ứng chưa chạy xong) sẽ ra vị
       trí lệch sang trái 32px. offsetLeft là vị trí layout, không dính
       transform, nên đúng ngay từ khung hình đầu. */
    const measure = () => {
      setIndicator({
        left: offsetLeftWithin(activeLabel, container),
        width: activeLabel.offsetWidth,
      });

      const first = offsetLeftWithin(firstLabel, container);
      setRule({
        left: first,
        width:
          offsetLeftWithin(lastLabel, container) + lastLabel.offsetWidth - first,
      });
    };

    const frame = requestAnimationFrame(measure);
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);
    labelRefs.current.forEach((label) => label && resizeObserver.observe(label));

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [active]);

  function select(index: number) {
    if (index === active) return;
    setActive(index);
    setFaded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setShown(index);
      setFaded(false);
    }, FADE_DURATION);
  }

  const detail = serviceTabs[shown];

  return (
    <>
      <div
        ref={tabsRef}
        className="relative grid grid-cols-4 border-b-4 border-transparent"
        role="tablist"
        aria-label="Các dịch vụ"
      >
        {serviceTabs.map((service, index) => (
          <Reveal
            className="min-w-0"
            delay={index * 110}
            from="left"
            key={service.tabLabel}
          >
            <button
              className={cn(
                // Cùng font / độ đậm / viết hoa với tiêu đề trong phần nội dung
                // bên dưới (font-heading + font-extrabold + uppercase).
                "w-full px-1 py-3 text-center font-heading text-[0.625rem] leading-tight font-extrabold uppercase transition-colors duration-300 hover:text-brand sm:px-3 sm:py-4 sm:text-sm",
                index === active && "text-brand",
              )}
              onClick={() => select(index)}
              type="button"
              role="tab"
              aria-selected={index === active}
            >
              <span
                className="inline-block"
                ref={(element) => {
                  labelRefs.current[index] = element;
                }}
              >
                <span className="max-[480px]:hidden lg:hidden">
                  {MOBILE_TAB_LINES[index].map((line, lineIndex) => (
                    <span key={line}>
                      {lineIndex > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </span>
                <span className="hidden max-[480px]:inline">
                  {NARROW_MOBILE_TAB_LINES[index].map((line, lineIndex) => (
                    <span key={line}>
                      {lineIndex > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </span>
                <span className="hidden lg:inline">
                  {service.tabLabel.toUpperCase()}
                </span>
              </span>
            </button>
          </Reveal>
        ))}

        {/* Vạch xám: chạy đúng từ chữ đầu tab 1 ("XÂY DỰNG") tới chữ cuối tab 4
            ("SỬA CHỮA") ở MỌI khổ màn hình, không kéo dài lố ra hai đầu
            container như border full-width trước đây. */}
        {rule.width > 0 && (
          <span
            className="pointer-events-none absolute -bottom-1 block h-1 bg-neutral-300"
            style={rule}
            aria-hidden="true"
          />
        )}

        {/* Một gạch chân duy nhất trượt sang tab được chọn thay vì thu về 0
            rồi phóng lại ở tab mới. Bề rộng bám đúng chữ của tab đó. */}
        {indicator.width > 0 && (
          <span
            className="pointer-events-none absolute -bottom-1 z-[1] h-1 bg-brand transition-[left,width] duration-500 ease-out"
            style={indicator}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Mobile/tablet dùng bố cục mới theo mockup: ảnh panorama ở trên, toàn
          bộ nội dung ở dưới. Desktop từ lg trở lên vẫn giữ bố cục hai cột. */}
      <div
        className={cn(
          "pt-6 transition-opacity ease-out sm:pt-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-20 lg:pt-12",
          faded ? "opacity-0 duration-200" : "opacity-100 duration-500",
        )}
      >
        <Reveal
          className="group relative aspect-9/5 w-full overflow-hidden rounded-2xl lg:aspect-1600/1093 lg:overflow-visible lg:rounded-none"
          from="left"
        >
          <Image
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02] group-active:scale-[1.02] lg:hidden"
            src={detail.mobileImage}
            alt={detail.label}
            fill
            sizes="(max-width: 1024px) calc(100vw - 2.25rem), 1px"
            priority
          />
          <Image
            className="hidden object-cover transition-[transform,translate,scale,filter] duration-300 ease-out lg:block lg:drop-shadow-md lg:group-hover:-translate-y-[5px] lg:group-hover:scale-[1.02] lg:group-hover:drop-shadow-2xl lg:group-active:-translate-y-[5px] lg:group-active:scale-[1.02] lg:group-active:drop-shadow-2xl"
            src={detail.image}
            alt={detail.label}
            fill
            sizes="(min-width: 1024px) 46vw, 1px"
            priority
          />
        </Reveal>

        <div className="mt-7 grid max-w-[31.875rem] grid-cols-[clamp(4rem,11vw,5rem)_minmax(0,1fr)] gap-x-3 sm:gap-x-4 lg:mt-0 lg:block">
          <Reveal className="col-start-1 row-start-1" from="left">
            <span className="block text-[clamp(3rem,13vw,4.5rem)] leading-[0.8] font-extrabold text-[#c4c4c4] transition-colors duration-300 hover:text-brand lg:text-7xl lg:leading-none">
              {String(shown + 1).padStart(2, "0")}.
            </span>
            <span className="mt-2 block h-0.5 w-[128%] bg-brand lg:hidden" />
          </Reveal>
          <Reveal
            className="col-start-2 row-start-1 min-w-0 translate-x-2 sm:translate-x-3 lg:translate-x-0"
            delay={120}
          >
            <h2
              className={cn(
                "font-heading leading-[1.08] font-extrabold tracking-[-0.025em] uppercase lg:mt-3 lg:text-4xl lg:leading-normal lg:tracking-normal lg:text-pretty",
                NOWRAP_SMALL_TITLE_INDEXES.has(shown)
                  ? "text-[clamp(0.8125rem,4vw,1.75rem)]"
                  : "text-[clamp(1.125rem,4.6vw,1.75rem)]",
              )}
            >
              <span className="whitespace-nowrap lg:hidden lg:whitespace-normal">
                {DETAIL_TITLE_LINES[shown].map((line, lineIndex) => (
                  <span key={line}>
                    {lineIndex > 0 && <br />}
                    {line}
                  </span>
                ))}
              </span>
              <span className="hidden lg:inline">{detail.label}</span>
            </h2>
            <p
              className={cn(
                "whitespace-nowrap text-[clamp(0.625rem,2.5vw,1.1875rem)] font-medium tracking-[-0.025em] sm:text-[min(1.25rem,2.8vw)] lg:mt-2 lg:max-w-fit lg:text-2xl lg:font-extrabold lg:tracking-normal",
                shown === 1 ? "mt-1" : "mt-0.5",
              )}
            >
              {detail.tagline}
            </p>
          </Reveal>
          <Reveal className="col-span-2 row-start-2" delay={240}>
            <div className="lg:block">
              <span className="hidden h-0.5 bg-brand lg:mt-5 lg:mb-2 lg:block lg:w-36" />
              {/* Mobile căn trái để khoảng trắng giữa các từ luôn tự nhiên.
                  Desktop giữ kiểu căn đều hai lề của bố cục cũ. */}
              <p className="mt-3 text-[clamp(0.75rem,2.4vw,0.9375rem)] leading-relaxed tracking-[-0.01em] lg:mt-0 lg:text-justify lg:text-base lg:tracking-normal">
                {detail.copy}
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Chấm chọn dịch vụ: khối riêng, full-width, căn giữa, nằm dưới cả ảnh
          lẫn text (không thuộc cột nào trong lưới 2 cột phía trên). Chấm đang
          chọn: viền cam + tâm đặc cam (kiểu radio button); chấm còn lại chỉ
          là vòng viền đen rỗng. */}
      <div
        className="mt-6 flex items-center justify-center gap-2 lg:hidden"
        role="tablist"
        aria-label="Chọn dịch vụ"
      >
        {serviceTabs.map((service, index) => (
          <button
            className={cn(
              "grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors duration-300",
              index === active ? "border-brand" : "border-charcoal",
            )}
            onClick={() => select(index)}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={service.tabLabel}
            key={service.tabLabel}
          >
            {index === active && (
              <span className="size-3 rounded-full bg-brand" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>
    </>
  );
}
