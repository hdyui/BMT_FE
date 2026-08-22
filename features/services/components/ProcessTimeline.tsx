"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { Reveal } from "@/lib/components/shared/Reveal";
import { processSteps } from "@/features/services/data/thiet-ke-kien-truc-noi-that";

const STEP_DELAY = 150;
const SECOND_GROUP_DELAY = 560;

/* Ở lg+ khối này luôn rộng đúng 820px (w-[min(820px,...)]), cột = (820-160)/2
   = 330px, khung bracket = 65% cột = 214.5px. Chốt --frame-h = 146px để khung
   giữ đúng tỉ lệ ảnh gốc (1349/919 = 1.468) -> không bị kéo méo, và quan trọng
   hơn là chiều cao khung không đổi theo viewport nữa nên vòng tròn cam (= đúng
   chiều cao khung) không bao giờ đụng trục giữa.

   Ngân sách ngang của nửa trái (0 -> 410px, trục giữa chiếm 376->444):
     khung 0->214.5 | hở 11.5 | vòng tròn 226->372 | chừa 4px | trục 376
   Mọi kích thước bên trong đều tính bằng calc() trên --frame-h nên chỉ cần
   sửa một con số là cả cụm co giãn theo đúng tỉ lệ. */
const TIMELINE_STYLE = {
  "--frame-h": "9.125rem",
  "--step-h": "calc(var(--frame-h) + 1.25rem)",
} as CSSProperties;

type ProcessStep = (typeof processSteps)[number];

const MOBILE_ROWS = [
  [processSteps[0], processSteps[3]],
  [processSteps[1], processSteps[4]],
  [processSteps[2], processSteps[5]],
] as const;

function MobileProcessTimeline() {
  /* `scale` không đổi ô layout: khối vẫn chiếm đủ chiều cao chưa thu nhỏ
     nhưng chỉ vẽ 95% từ mép trên, chừa ra 5% chiều cao khoảng chết ở đáy
     (~24px ở màn 390px). Margin âm bù đúng lượng đó: chiều cao = bề rộng x
     4648/3593, nên 5% chiều cao = 6,47% bề rộng. */
  return (
    <div className="relative mx-auto mb-[calc((100vw-1.25rem)*-0.0647)] aspect-[3593/4648] w-[calc(100%-1.25rem)] origin-top scale-[0.95] overflow-hidden md:hidden">
      <Image
        className="absolute inset-0 size-full object-fill"
        src="/images/thiet-ke-kien-truc-noi-that/mobile/process-framework.png"
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
      />

      {MOBILE_ROWS.map((row, rowIndex) =>
        row.map((step, columnIndex) => {
          const isLeft = columnIndex === 0;

          return (
            <Reveal
              className="group/step absolute h-1/3 w-1/2 transition-transform duration-300 ease-out active:scale-[.98]"
              delay={(rowIndex * 2 + columnIndex) * STEP_DELAY}
              from={isLeft ? "right" : "left"}
              style={{
                top: `${rowIndex * 33.333}%`,
                left: isLeft ? 0 : "50%",
              }}
              key={step.number}
            >
              <span
                className={`absolute top-[1.5%] text-[clamp(1.9rem,8.6vw,2.6rem)] leading-none font-extrabold text-[#b8babc] ${
                  isLeft ? "right-[37%]" : "left-[37%]"
                }`}
                aria-hidden="true"
              >
                {step.number}.
              </span>

              <div
                className={`absolute top-[37%] bottom-0 flex flex-col ${
                  isLeft ? "right-[8%] left-[14%]" : "right-[14%] left-[8%]"
                }`}
              >
                <h3
                  className={`font-heading text-[clamp(0.55rem,2.72vw,0.83rem)] leading-none font-extrabold whitespace-nowrap text-brand uppercase transition-colors duration-300 group-active/step:text-[#ff934a] ${
                    isLeft ? "text-right" : "text-left"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className="mt-1 text-[clamp(0.55rem,2.5vw,0.75rem)] leading-[1.15] text-charcoal"
                  style={{
                    textAlign: "justify",
                    textAlignLast: isLeft ? "right" : "left",
                    textJustify: "inter-word",
                  }}
                >
                  {step.copy.replace(/\n/g, " ")}
                </p>
              </div>
            </Reveal>
          );
        }),
      )}
    </div>
  );
}

function TimelineStep({
  step,
  side,
  delay,
}: {
  step: ProcessStep;
  side: "left" | "right";
  delay: number;
}) {
  const isLeft = side === "left";

  return (
    <Reveal from={isLeft ? "right" : "left"} delay={delay}>
      <article className="group/step relative min-h-[12.8125rem] rounded-[1.5rem] bg-white p-4 pt-14 shadow-[0_10px_28px_rgb(36_33_34/.08)] max-md:h-56 max-md:min-h-0 max-md:rounded-none max-md:bg-transparent max-md:p-0 max-md:shadow-none sm:p-5 sm:pt-16 lg:h-(--step-h) lg:min-h-0 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none">
        {/* Ảnh `fill` tự set inline width/height/inset = 100%, nên bắt buộc
            phải bọc trong một span đã định vị sẵn; đặt w-[65%] thẳng lên
            <Image> sẽ bị inline style của next/image đè mất và khung kéo dài
            full ô, trùm luôn lên vòng tròn cam. */}
        <span
          className={`pointer-events-none absolute top-0 hidden h-(--frame-h) w-[65%] max-md:block max-md:h-52 max-md:w-[calc(100%+0.5rem)] lg:block ${
            isLeft ? "left-0" : "right-0"
          }`}
        >
          <Image
            className="size-full object-fill transition-[filter,opacity] duration-300 group-hover/step:brightness-110 group-hover/step:saturate-150"
            src={
              isLeft
                ? "/images/thiet-ke-kien-truc-noi-that/process-connector-left.png"
                : "/images/thiet-ke-kien-truc-noi-that/process-connector-right.png"
            }
            alt=""
            fill
            sizes="220px"
            aria-hidden="true"
          />
        </span>

        {/* Số thứ tự cưỡi lên nét cong phía trên-trái của khung. Tâm đặt cao
            (0.067 x khung) và lệch trái để phần rìa phải của vòng tròn số luôn
            dừng trước mép trái khối chữ (17%) — không bao giờ đè lên tiêu đề. */}
        <span
          className={`absolute top-3 grid size-11 place-items-center text-sm font-bold text-white max-md:top-0 max-md:size-auto max-md:text-[2.25rem] max-md:leading-none max-md:text-[#b8babc] lg:top-[calc(var(--frame-h)*-0.097)] lg:size-[calc(var(--frame-h)*0.329)] ${
            isLeft
              ? "left-3 max-md:right-16 max-md:left-auto lg:left-[1.2%]"
              : "left-3 max-md:left-16 lg:right-[1.2%] lg:left-auto"
          }`}
        >
          <Image
            className="absolute inset-0 size-full object-contain max-md:hidden"
            src="/images/thiet-ke-kien-truc-noi-that/process-number-bg.png"
            alt=""
            fill
            sizes="64px"
            aria-hidden="true"
          />
          <span className="relative text-2xl font-extrabold max-md:text-[2.25rem] lg:text-[calc(var(--frame-h)*0.125)]">
            {step.number}
          </span>
        </span>

        {/* Vòng tròn cam = đúng chiều cao khung, canh giữa dọc nên nó phủ trọn
            từ mép trên tới mép dưới khung. Nằm HẲN ngoài khung: khung hết ở
            65%, vòng tròn chạy 68.5% -> 112.7% (tràn vào khoảng hở hướng trục
            giữa, còn chừa 4px trước vạch trục). */}
        <span
          className={`absolute top-3 right-4 grid size-14 place-items-center max-md:top-0 lg:top-[calc(var(--frame-h)/2)] lg:h-auto lg:aspect-square lg:w-(--frame-h) lg:-translate-y-1/2 ${
            isLeft
              ? "max-md:-right-2 lg:right-[-12.7%]"
              : "max-md:right-auto max-md:-left-2 lg:right-auto lg:left-[-12.7%]"
          }`}
        >
          <Image
            /* Vòng tròn cam đứng yên, chỉ sáng lên — cú zoom dành riêng cho
               icon bên trong (xem <Image> ngay dưới). Vì vậy ở đây chỉ
               transition `filter`, không đụng tới scale. */
            className="absolute inset-0 size-full object-contain transition-[filter] duration-300 ease-out group-hover/step:brightness-110 group-hover/step:saturate-125"
            src={step.circle}
            alt=""
            fill
            sizes="(max-width: 1023px) 56px, 150px"
            aria-hidden="true"
          />
          <Image
            className="relative size-[48%] object-contain transition-transform duration-300 ease-out group-hover/step:scale-105"
            src={step.icon}
            alt=""
            width={485}
            height={485}
            aria-hidden="true"
          />
        </span>

        {/* Khối chữ rộng 47% cột = 155px, vừa đúng bề ngang tiêu đề dài nhất
            ("LÊN PHƯƠNG ÁN THIẾT KẾ" = 13.36em -> 149.7px ở cỡ 11.2px) nên
            tiêu đề đứng trọn một dòng và phần mô tả xuống dòng đúng bằng chiều
            dài tiêu đề. Canh giữa dọc để bài dài ngắn khác nhau đều nằm gọn
            trong khung. */}
        <div
          className={`max-md:absolute max-md:top-[4.5rem] lg:absolute lg:top-[calc(var(--frame-h)/2)] lg:-translate-y-1/2 ${
            isLeft
              ? "max-md:right-4 max-md:left-5 max-md:text-right lg:right-[36%] lg:left-[17%]"
              : "max-md:right-5 max-md:left-4 max-md:text-left lg:right-[17%] lg:left-[36%]"
          }`}
        >
          <h3 className="font-heading text-xl leading-tight font-extrabold text-brand uppercase transition-colors duration-300 group-hover/step:text-[#ff934a] max-md:text-[0.78rem] max-md:leading-tight sm:text-3xl lg:text-[calc(var(--frame-h)*0.0767)] lg:leading-[1.15] lg:whitespace-nowrap">
            {step.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-pretty max-md:mt-1 max-md:leading-[1.22] lg:mt-[calc(var(--frame-h)*0.035)] lg:text-[calc(var(--frame-h)*0.0652)] lg:leading-[1.4]">
            {step.copy}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

export function ProcessTimeline() {
  const firstGroup = processSteps.slice(0, 3);
  const secondGroup = processSteps.slice(3, 6);

  return (
    <>
      <MobileProcessTimeline />
      <div
        className="relative mx-auto hidden w-[min(51.25rem,calc(100%-2.25rem))] justify-center md:flex"
        style={TIMELINE_STYLE}
      >
      <span
        className="pointer-events-none absolute left-1/2 z-10 hidden -translate-x-1/2 lg:top-[calc(var(--frame-h)/2_-_var(--step-h)*0.3845)] lg:block lg:h-[calc(var(--step-h)*2.8)]"
        aria-hidden="true"
      >
        <Image
          className="h-full w-auto"
          src="/images/thiet-ke-kien-truc-noi-that/process-axis.png"
          alt=""
          width={358}
          height={2955}
          aria-hidden="true"
        />
      </span>
      <div className="grid w-full gap-4 max-md:grid-cols-2 max-md:gap-14 lg:grid-cols-2 lg:gap-40">
        <div className="grid gap-4 max-md:gap-0 lg:gap-0">
          {firstGroup.map((step, index) => (
            <TimelineStep
              step={step}
              side="left"
              delay={index * STEP_DELAY}
              key={step.number}
            />
          ))}
        </div>

        <div className="grid gap-4 max-md:gap-0 lg:gap-0">
          {secondGroup.map((step, index) => (
            <TimelineStep
              step={step}
              side="right"
              delay={SECOND_GROUP_DELAY + index * STEP_DELAY}
              key={step.number}
            />
          ))}
        </div>
      </div>
      </div>
    </>
  );
}
