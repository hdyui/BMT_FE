"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/lib/components/shared/Reveal";
import { serviceTabs } from "@/features/services/data/overview";
import { cn } from "@/lib/utils";

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

// Điểm ngắt dòng cố định cho TIÊU ĐỀ bên cạnh số 01/02/03/04 (khác với nhãn
// tab phía trên): chỉ "Thiết kế kiến trúc & nội thất" cần 2 dòng, 3 tiêu đề
// còn lại nằm gọn 1 dòng (vd "GÓI" không được rớt xuống dòng riêng).
const DETAIL_TITLE_LINES = [
  ["XÂY DỰNG TRỌN GÓI"],
  ["THIẾT KẾ KIẾN TRÚC &", "NỘI THẤT"],
  ["THI CÔNG XÂY DỰNG"],
  ["CẢI TẠO & SỬA CHỮA"],
] as const;

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
          <Reveal delay={index * 110} from="left" key={service.label}>
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
                <span className="lg:hidden">
                  {MOBILE_TAB_LINES[index].map((line, lineIndex) => (
                    <span key={line}>
                      {lineIndex > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </span>
                <span className="hidden lg:inline">
                  {service.label.toUpperCase()}
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

      {/* Mockup mobile chia đúng 50/50: ảnh bo góc đổ bóng bên trái cao bằng
          hẳn cột chữ bên phải (đúng bằng phần tiêu đề/tagline/mô tả, KHÔNG
          tính hàng chấm — hàng chấm là một khối riêng, full-width, nằm dưới
          CẢ ảnh lẫn text), nhờ `items-stretch` + ảnh dùng `fill` không khoá
          aspect-ratio riêng. Từ lg trở lên giữ nguyên bố cục/kích thước cũ
          (ảnh tự nhiên không bo góc, 2 cột đều, item căn giữa theo chiều dọc
          thay vì kéo giãn). */}
      <div
        className={cn(
          "grid grid-cols-2 items-stretch gap-4 pt-8 transition-opacity ease-out sm:gap-6 sm:pt-12 lg:items-center lg:gap-20",
          faded ? "opacity-0 duration-200" : "opacity-100 duration-500",
        )}
      >
        <Reveal
          className="group relative w-full overflow-hidden rounded-2xl shadow-lg lg:aspect-1600/1093 lg:overflow-visible lg:rounded-none lg:shadow-none"
          from="left"
        >
          <Image
            className="object-cover transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.03] lg:drop-shadow-md lg:group-hover:drop-shadow-2xl"
            src={detail.image}
            alt={detail.label}
            fill
            sizes="(max-width: 1024px) 46vw, 46vw"
            priority
          />
        </Reveal>

        <div className="max-w-[31.875rem]">
          <Reveal from="left">
            <span className="block text-[clamp(2rem,9vw,3rem)] leading-none font-extrabold text-neutral-400 lg:text-7xl">
              {String(shown + 1).padStart(2, "0")}.
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mt-2 font-heading text-[clamp(1.125rem,4.6vw,1.75rem)] font-extrabold uppercase lg:mt-3 lg:text-4xl">
              <span className="lg:hidden">
                {DETAIL_TITLE_LINES[shown].map((line, lineIndex) => (
                  <span key={line}>
                    {lineIndex > 0 && <br />}
                    {line}
                  </span>
                ))}
              </span>
              <span className="hidden lg:inline">{detail.label}</span>
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-2 text-[clamp(0.75rem,2.6vw,0.9375rem)] font-medium max-w-fit lg:mt-3 lg:font-extrabold lg:text-md">{detail.tagline}</p>
            <span className="mt-3 mb-1.5 block h-0.5 w-16 bg-brand lg:mt-5 lg:mb-2 lg:w-36" />
            <p className="text-[clamp(0.75rem,2.4vw,0.9375rem)] leading-relaxed text-pretty lg:text-base">{detail.copy}</p>
          </Reveal>
        </div>
      </div>

      {/* Chấm chọn dịch vụ: khối riêng, full-width, căn giữa, nằm dưới cả ảnh
          lẫn text (không thuộc cột nào trong lưới 2 cột phía trên). Chấm đang
          chọn: viền cam + tâm đặc cam (kiểu radio button); chấm còn lại chỉ
          là vòng viền đen rỗng. */}
      <div
        className="mt-6 flex items-center justify-center gap-2.5 lg:hidden"
        role="tablist"
        aria-label="Chọn dịch vụ"
      >
        {serviceTabs.map((service, index) => (
          <button
            className={cn(
              "grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-300",
              index === active ? "border-brand" : "border-charcoal",
            )}
            onClick={() => select(index)}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={service.label}
            key={service.label}
          >
            {index === active && (
              <span className="size-3.5 rounded-full bg-brand" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>
    </>
  );
}
