"use client";

import Image from "next/image";
import { Reveal } from "@/lib/components/shared/Reveal";
import { processSteps } from "@/features/services/data/xay-dung-tron-goi";

export function ProcessStepsGrid() {
  return (
    <div className="mx-auto grid w-[min(1200px,calc(100%-2.25rem))] gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {processSteps.map((step, index) => (
        <Reveal delay={index * 110} from="left" key={step.number}>
          <div className="group/step relative h-full rounded-3xl bg-white p-6 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgb(36_33_34/.12)]">
            <div className="flex items-center gap-4">
              <Reveal from="left" delay={index * 110 + 60}>
                <span className="relative grid size-16 shrink-0 place-items-center">
                  <Image
                    className="absolute inset-0 object-contain"
                    src="/images/xay-dung-tron-goi/icon-circle-bg.png"
                    alt=""
                    fill
                    aria-hidden="true"
                  />
                  <Image
                    className="relative size-8 object-contain brightness-0 invert"
                    src={step.icon}
                    alt=""
                    width={64}
                    height={64}
                  />
                </span>
              </Reveal>
              <span
                className="h-12 w-6 shrink-0 bg-[#d4d4d4] transition-colors duration-300 group-hover/step:bg-brand"
                style={{
                  maskImage: `url(${step.numeralImage})`,
                  maskPosition: "center",
                  maskRepeat: "no-repeat",
                  maskSize: "contain",
                  WebkitMaskImage: `url(${step.numeralImage})`,
                  WebkitMaskPosition: "center",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskSize: "contain",
                }}
                aria-hidden="true"
              />
            </div>

            <h3 className="mt-5 text-lg font-bold uppercase transition-colors duration-300 group-hover/step:text-brand">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
              {step.copy}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
