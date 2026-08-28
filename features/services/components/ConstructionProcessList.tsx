"use client";

import Image from "next/image";
import { Reveal } from "@/shared/components/Reveal";
import { processSteps } from "../data/construction";

/**
 * Khối nội dung màu cam trong mockup là một hình chữ nhật bo góc có "tai" lồi
 * ra ở giữa cạnh trái, kèm một đường viền đen cùng hình nhưng lệch lên trên và
 * sang phải. Vẽ bằng SVG để giữ đúng đường cong; `preserveAspectRatio="none"`
 * cho phép kéo giãn theo chiều cao nội dung, còn `vector-effect` giữ nét viền
 * không bị dày lên khi giãn.
 */
const BLOCK_PATH =
  "M 8.4 0 L 259.6 0 A 8.4 8.4 0 0 1 268 8.4 L 268 91.6 A 8.4 8.4 0 0 1 259.6 100 L 8.4 100 A 8.4 8.4 0 0 1 0 91.6 L 0 71 C 0 66 -10.2 68 -10.2 63 L -10.2 37 C -10.2 32 0 34 0 29 L 0 8.4 A 8.4 8.4 0 0 1 8.4 0 Z";

function ProcessBlockShape() {
  return (
    <svg
      className="absolute inset-0 -z-10 size-full overflow-visible"
      viewBox="-10.2 0 278.2 103"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g transform="translate(0 3)">
        <path d={BLOCK_PATH} fill="#EE7B30" />
      </g>
      <g transform="translate(5.4 0)">
        <path
          d={BLOCK_PATH}
          fill="none"
          stroke="#242122"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}

export function ConstructionProcessList() {
  return (
    <div className="relative mx-auto w-[min(58rem,calc(100%-2.25rem))]">
      {/* Thanh dọc màu xám chạy suốt danh sách, canh theo cột thứ hai */}
      <span
        className="absolute top-0 bottom-10 left-[22.5%] hidden w-2 -translate-x-1/2 rounded-full bg-[#C9C9C9] md:block"
        aria-hidden="true"
      >
        <span className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-[#C9C9C9]" />
      </span>

      <div className="flex flex-col gap-6 md:gap-8">
        {processSteps.map((step, index) => {
          const base = index * 220;

          return (
            <div
              className="group/step relative grid items-center gap-4 md:grid-cols-[13%_5%_30.5%_11%_3%_37.5%] md:gap-0"
              key={step.number}
            >
              {/* 1. Số thứ tự: zoom nhẹ kết hợp fade */}
              <Reveal
                className="mx-auto md:mx-0 md:translate-x-22 md:translate-y-4"
                delay={base}
                from="zoom"
              >
                <div className="relative grid aspect-square w-20 place-items-center sm:w-27.5 md:w-[76%]">
                  <Image
                    className="absolute inset-0 size-full object-contain"
                    src="/images/thi-cong-xay-dung/circle-ring.png"
                    alt=""
                    width={300}
                    height={300}
                    aria-hidden="true"
                  />
                  <span className="relative text-5xl leading-none font-normal text-charcoal sm:text-7xl md:text-5xl">
                    {step.number}
                  </span>
                </div>
              </Reveal>

              {/* 2. Chấm tròn cam trên thanh timeline */}
              <div className="hidden justify-center md:flex ml-22 mt-9">
                <Reveal delay={base} from="zoom">
                  <span className="grid size-7 place-items-center rounded-full border-1 border-brand bg-[#F2F2F3]">
                    <span className="block size-4.5 rounded-full bg-brand" />
                  </span>
                </Reveal>
              </div>

              {/* 3. Tiêu đề: trượt từ trái sang phải, đổi màu cam khi rê chuột */}
              <Reveal
                className="text-center md:pl-16 md:text-left"
                delay={base + 120}
                from="left"
              >
                <h3 className="font-heading text-lg leading-snug font-extrabold text-charcoal transition-colors duration-300 group-hover/step:text-brand group-active/step:text-brand md:text-lg">
                  {step.title}
                  <br className="hidden md:block" />{" "}
                  {step.subtitle}
                </h3>
                <span
                  className="mt-3 hidden w-[78%] border-b-2 border-dotted border-charcoal/70 md:-ml-4 md:block"
                  aria-hidden="true"
                />
              </Reveal>

              {/* 4. Icon: trượt từ dưới lên */}
              <Reveal
                className="mx-auto md:mx-0"
                delay={base + 240}
                from="bottom"
              >
                <Image
                  className="size-14 object-contain sm:size-20 md:size-full"
                  src={step.icon}
                  alt={step.title}
                  width={300}
                  height={298}
                />
              </Reveal>

              <span className="hidden md:block" aria-hidden="true" />

              {/* 5. Khối nội dung cam: trượt từ trái sang phải, đổ bóng khi hover */}
              <Reveal delay={base + 360} from="left">
                <div className="relative isolate transition-[filter] duration-300 group-hover/step:drop-shadow-[0_14px_26px_rgb(238_123_48/.45)] group-active/step:drop-shadow-[0_14px_26px_rgb(238_123_48/.45)] md:w-[78%]">
                  <ProcessBlockShape />
                  <p className="px-6 py-5 text-sm leading-relaxed text-justify text-white md:px-6 md:py-5">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>
    </div>
  );
}
