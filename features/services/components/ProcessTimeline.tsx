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
      <article className="group/step relative min-h-[12.8125rem] rounded-[1.5rem] bg-white p-4 pt-14 sm:p-5 sm:pt-16 shadow-[0_10px_28px_rgb(36_33_34/.08)] lg:h-(--step-h) lg:min-h-0 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none">
        {/* Ảnh `fill` tự set inline width/height/inset = 100%, nên bắt buộc
            phải bọc trong một span đã định vị sẵn; đặt w-[65%] thẳng lên
            <Image> sẽ bị inline style của next/image đè mất và khung kéo dài
            full ô, trùm luôn lên vòng tròn cam. */}
        <span
          className={`pointer-events-none absolute top-0 hidden h-(--frame-h) w-[65%] lg:block ${
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
          className={`absolute top-3 grid size-11 place-items-center text-sm font-bold text-white lg:top-[calc(var(--frame-h)*-0.097)] lg:size-[calc(var(--frame-h)*0.329)] ${
            isLeft
              ? "left-3 lg:left-[1.2%]"
              : "left-3 lg:right-[1.2%] lg:left-auto"
          }`}
        >
          <Image
            className="absolute inset-0 size-full object-contain"
            src="/images/thiet-ke-kien-truc-noi-that/process-number-bg.png"
            alt=""
            fill
            sizes="64px"
            aria-hidden="true"
          />
          <span className="relative text-2xl font-extrabold lg:text-[calc(var(--frame-h)*0.125)]">
            {step.number}
          </span>
        </span>

        {/* Vòng tròn cam = đúng chiều cao khung, canh giữa dọc nên nó phủ trọn
            từ mép trên tới mép dưới khung. Nằm HẲN ngoài khung: khung hết ở
            65%, vòng tròn chạy 68.5% -> 112.7% (tràn vào khoảng hở hướng trục
            giữa, còn chừa 4px trước vạch trục). */}
        <span
          className={`absolute top-3 right-4 grid size-14 place-items-center lg:top-[calc(var(--frame-h)/2)] lg:h-auto lg:aspect-square lg:w-(--frame-h) lg:-translate-y-1/2 ${
            isLeft ? "lg:right-[-12.7%]" : "lg:right-auto lg:left-[-12.7%]"
          }`}
        >
          <Image
            className="absolute inset-0 size-full object-contain transition-[filter,transform] duration-300 ease-out group-hover/step:scale-105 group-hover/step:brightness-110 group-hover/step:saturate-125"
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
          className={`lg:absolute lg:top-[calc(var(--frame-h)/2)] lg:-translate-y-1/2 ${
            isLeft
              ? "lg:right-[36%] lg:left-[17%]"
              : "lg:right-[17%] lg:left-[36%]"
          }`}
        >
          <h3 className="font-heading text-xl leading-tight sm:text-3xl font-extrabold text-brand uppercase transition-colors duration-300 group-hover/step:text-[#ff934a] lg:text-[calc(var(--frame-h)*0.0767)] lg:leading-[1.15] lg:whitespace-nowrap">
            {step.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-pretty lg:mt-[calc(var(--frame-h)*0.035)] lg:text-[calc(var(--frame-h)*0.0652)] lg:leading-[1.4]">
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
    <div
      className="relative mx-auto flex w-[min(51.25rem,calc(100%-2.25rem))] justify-center"
      style={TIMELINE_STYLE}
    >
      {/* 3 chấm trên process-axis.png nằm ở 14.79% / 50.10% / 85.09% chiều cao
          ảnh (đo trực tiếp từ file). Muốn chấm rơi đúng tâm từng hàng thì
          khoảng cách 2 chấm ngoài (70.30% ảnh) phải bằng 2 x --step-h:
            cao ảnh = 2 x --step-h / 0.7030 = --step-h x 2.845
            top     = --frame-h/2 - 0.1479 x cao ảnh = --frame-h/2 - --step-h x 0.4208
          Hạ chủ động xuống 2.6 (thay vì 2.845 đúng toán học) để ảnh đỡ bị kéo
          dãn dọc quá mức; chấm lệch tâm hàng một chút nhưng không đáng kể. */}
      <div className="pointer-events-none absolute left-1/2 z-10 hidden w-12 -translate-x-1/2 lg:block lg:top-[calc(var(--frame-h)/2_-_var(--step-h)*0.3845)] lg:h-[calc(var(--step-h)*2.6)]">
        <Image
          className="size-full object-fill"
          src="/images/thiet-ke-kien-truc-noi-that/process-axis.png"
          alt=""
          fill
          sizes="48px" // Bạn có thể giảm sizes này xuống tương ứng cho chuẩn (ví dụ w-12 là 48px)
          aria-hidden="true"
        />
      </div>
      <div className="grid w-full gap-4 lg:grid-cols-2 lg:gap-40">
        <div className="grid gap-4 lg:gap-0">
          {firstGroup.map((step, index) => (
            <TimelineStep
              step={step}
              side="left"
              delay={index * STEP_DELAY}
              key={step.number}
            />
          ))}
        </div>

        <div className="grid gap-4 lg:gap-0">
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
  );
}
