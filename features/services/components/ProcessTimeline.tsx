"use client";

import Image from "next/image";
import { Reveal } from "@/lib/components/shared/Reveal";
import { processSteps } from "@/features/services/data/thiet-ke-kien-truc-noi-that";

const ROW_DELAY = 150;
const RIGHT_COLUMN_START_DELAY = 620;

function StepCard({
  step,
  from,
  delay,
}: {
  step: (typeof processSteps)[number];
  from: "left" | "right";
  delay: number;
}) {
  return (
    <Reveal from={from} delay={delay}>
      <div className="group/step flex items-start gap-4">
        <div className="relative shrink-0">
          <span className="grid size-20 place-items-center rounded-full bg-brand transition-colors duration-300 group-hover/step:bg-[#ff9852]">
            <Image
              className="size-9 object-contain brightness-0 invert transition-transform duration-300 ease-out group-hover/step:scale-105"
              src={step.icon}
              alt=""
              width={64}
              height={64}
            />
          </span>
          <span className="absolute -top-1.5 -left-1.5 grid size-7 place-items-center rounded-full bg-brand text-xs font-bold text-white ring-4 ring-white transition-colors duration-300 group-hover/step:bg-[#ff9852]">
            {step.number}
          </span>
        </div>
        <div className="pt-1">
          <h3 className="text-base font-bold text-brand uppercase transition-colors duration-300 group-hover/step:text-[#ff9852]">
            {step.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-pretty">
            {step.copy}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export function ProcessTimeline() {
  const leftSteps = processSteps.slice(0, 3);
  const rightSteps = processSteps.slice(3, 6);

  return (
    <div className="relative mx-auto w-[min(1100px,calc(100%-2.25rem))]">
      <div className="absolute inset-y-4 left-1/2 hidden w-px -translate-x-1/2 bg-neutral-300 lg:block" />

      <div className="grid gap-y-10 lg:gap-y-14">
        {leftSteps.map((step, index) => (
          <div
            className="grid items-center gap-x-8 lg:grid-cols-[1fr_auto_1fr]"
            key={step.number}
          >
            <StepCard step={step} from="right" delay={index * ROW_DELAY} />
            <span
              className="relative z-10 mx-auto hidden size-2.5 rounded-full bg-charcoal lg:block"
              aria-hidden="true"
            />
            <StepCard
              step={rightSteps[index]}
              from="left"
              delay={RIGHT_COLUMN_START_DELAY + index * ROW_DELAY}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
