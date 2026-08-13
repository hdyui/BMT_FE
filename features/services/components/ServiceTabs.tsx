"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/lib/components/shared/Reveal";
import { serviceTabs } from "@/features/services/data/overview";
import { cn } from "@/lib/utils";

const FADE_DURATION = 240;

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
        className="relative grid border-b-4 border-neutral-300 sm:grid-cols-2 lg:grid-cols-4 lg:border-transparent"
        role="tablist"
        aria-label="Các dịch vụ"
      >
        {serviceTabs.map((service, index) => (
          <Reveal delay={index * 110} from="left" key={service.label}>
            <button
              className={cn(
                // Cùng font / độ đậm / viết hoa với tiêu đề trong phần nội dung
                // bên dưới (font-heading + font-extrabold + uppercase).
                "w-full px-3 py-4 text-center font-heading text-sm font-extrabold uppercase transition-colors duration-300 hover:text-brand",
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
                {service.label.toUpperCase()}
              </span>
            </button>
          </Reveal>
        ))}

        {/* Vạch xám: từ lg trở lên chỉ chạy đúng từ chữ đầu tab 1 tới chữ cuối
            tab 4. Dưới lg các tab xếp chồng nên vẫn dùng border full width. */}
        {rule.width > 0 && (
          <span
            className="pointer-events-none absolute -bottom-1 hidden h-1 bg-neutral-300 lg:block"
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

      <div
        className={cn(
          "grid items-center gap-8 pt-8 transition-opacity ease-out sm:gap-12 sm:pt-12 lg:grid-cols-2 lg:gap-20",
          faded ? "opacity-0 duration-200" : "opacity-100 duration-500",
        )}
      >
        <Reveal className="group" from="left">
          <Image
            className="h-auto w-full drop-shadow-md transition-[transform,filter] duration-500 ease-out group-hover:scale-[1.03] group-hover:drop-shadow-2xl"
            src={detail.image}
            alt={detail.label}
            width={1600}
            height={1093}
            sizes="(max-width: 1024px) 92vw, 46vw"
            priority
          />
        </Reveal>

        <div className="max-w-[31.875rem]">
          <Reveal from="left">
            <span className="block text-5xl leading-none font-extrabold text-neutral-400 sm:text-7xl">
              {String(shown + 1).padStart(2, "0")}.
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mt-3 font-heading text-2xl font-extrabold uppercase sm:text-3xl lg:text-4xl">
              {detail.label}
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-3 text-md font-extrabold max-w-fit">{detail.tagline}</p>
            <span className="mt-5 mb-2 block h-0.5 w-36 bg-brand" />
            <p className="text-base leading-relaxed text-pretty">{detail.copy}</p>
          </Reveal>
        </div>
      </div>
    </>
  );
}
