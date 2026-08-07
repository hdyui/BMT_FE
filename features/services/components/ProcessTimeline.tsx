"use client";

import Image from "next/image";
import { Reveal } from "@/lib/components/shared/Reveal";
import { processSteps } from "@/features/services/data/thiet-ke-kien-truc-noi-that";

const STEP_DELAY = 150;
const SECOND_GROUP_DELAY = 560;

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
      <article className="group/step relative min-h-[205px] rounded-[24px] bg-white p-5 pt-16 shadow-[0_10px_28px_rgb(36_33_34/.08)] lg:h-[clamp(168px,14.2vw,200px)] lg:min-h-0 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none">
        <Image
          className={`pointer-events-none absolute pb-5 top-0 hidden h-full w-[65%] object-fill transition-[filter,opacity] duration-300 group-hover/step:brightness-110 group-hover/step:saturate-150 lg:block ${
            isLeft ? "left-0" : "right-0"
          }`}
          src={
            isLeft
              ? "/images/thiet-ke-kien-truc-noi-that/process-connector-left.png"
              : "/images/thiet-ke-kien-truc-noi-that/process-connector-right.png"
          }
          alt=""
          fill
          sizes="38vw"
          aria-hidden="true"
        />

        <span
          className={`absolute top-3 grid size-11 place-items-center text-sm font-bold text-white lg:top-[-1%] lg:size-[clamp(48px,4.5vw,64px)] lg:text-base ${
            isLeft
              ? "left-3 lg:left-[-1%]"
              : "left-3 lg:right-[-1%] lg:left-auto"
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
          <span className="relative text-2xl font-extrabold">
            {step.number}
          </span>
        </span>

        <span
          className={`absolute top-3 right-4 grid size-14 place-items-center lg:top-1/2 lg:h-auto lg:w-[38%] lg:aspect-square lg:-translate-y-1/2 ${
            isLeft ? "lg:right-[-12%]" : "lg:right-auto lg:left-[-12%]"
          }`}
        >
          <Image
            className="absolute inset-0 size-full object-contain transition-[filter,transform] duration-300 ease-out group-hover/step:scale-105 group-hover/step:brightness-110 group-hover/step:saturate-125"
            src={step.circle}
            alt=""
            fill
            sizes="(max-width: 1023px) 56px, 15vw"
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

        <div
          className={`lg:absolute lg:top-[28%] ${
            isLeft
              ? "lg:right-[35%] lg:left-[15%]"
              : "lg:right-[15%] lg:left-[35%]"
          }`}
        >
          <h3 className="text-3xl leading-tight font-extrabold text-brand uppercase transition-colors duration-300 group-hover/step:text-[#ff934a] lg:text-[13px]">
            {step.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-pretty lg:text-[10.5px] lg:leading-[1.35] xl:text-[11.5px]">
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
    <div className="relative mx-auto flex w-[min(820px,calc(100%-2.25rem))] justify-center">
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-17 h-145 -translate-x-1/2 lg:block">
        <Image
          className="size-full object-fill"
          src="/images/thiet-ke-kien-truc-noi-that/process-axis.png"
          alt=""
          fill
          sizes="62px"
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
