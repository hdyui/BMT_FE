import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/components/ui/accordion";
import { processSteps } from "@/features/services/data/overview";

const arrowMask = {
  maskImage: "url(/images/services/arrow.png)",
  maskPosition: "center",
  maskRepeat: "no-repeat",
  maskSize: "contain",
  WebkitMaskImage: "url(/images/services/arrow.png)",
  WebkitMaskPosition: "center",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskSize: "contain",
} as const;

export function ProcessAccordion() {
  return (
    <Accordion
      className="mx-auto w-[min(75rem,calc(100%-2.25rem))]"
      defaultValue={["step-1"]}
    >
      {processSteps.map((step, index) => (
        <AccordionItem
          className="group/step border-b border-neutral-300"
          value={`step-${index + 1}`}
          key={step.title}
        >
          <div className="grid grid-cols-[3.5rem_1fr] items-center gap-3 py-4 sm:grid-cols-[13.75rem_1fr] lg:grid-cols-[21.25rem_1fr] lg:gap-6">
            {/* Chỉ khung ảnh cao lên; object-cover luôn bị giới hạn theo chiều
                ngang nên ảnh giữ nguyên tỉ lệ, chỉ lộ thêm phần trên dưới.
                Chiều cao = bề rộng cột × 320/1420 (thu gọn) và × 639/1420 (mở);
                bo góc bằng CSS vì lúc thu gọn phần bo sẵn trong ảnh bị cắt mất. */}
            <AccordionTrigger className="relative block h-4.25 w-full overflow-hidden rounded-[0.1875rem] transition-[height] duration-300 ease-out group-data-open/step:h-[2.125rem] sm:h-[3.125rem] sm:rounded-[0.5625rem] sm:group-data-open/step:h-[6.1875rem] lg:h-[4.8125rem] lg:rounded-[0.875rem] lg:group-data-open/step:h-[9.5625rem]">
              <Image
                className="object-cover"
                src={step.imageOpen}
                alt=""
                fill
                sizes="340px"
                loading="eager"
              />
            </AccordionTrigger>

            <div>
              <AccordionTrigger className="grid w-full grid-cols-[2.625rem_1fr_auto] items-center gap-3 rounded-none py-0 hover:no-underline sm:grid-cols-[3.25rem_1fr_auto] lg:grid-cols-[4.5rem_1fr_auto] lg:gap-6 **:data-[slot=accordion-trigger-icon]:hidden">
                <span className="text-base lg:text-lg text-charcoal">
                  {String(index + 1).padStart(2, "0")}.
                </span>
                <span className="pr-4 font-heading text-left text-base font-bold sm:text-2xl lg:text-[2.125rem]">
                  {step.title}
                </span>
                <span
                  className="h-6 w-4.75 shrink-0 bg-charcoal transition-[background-color,rotate] duration-300 ease-out group-aria-expanded/accordion-trigger:rotate-180 group-aria-expanded/accordion-trigger"
                  style={arrowMask}
                  aria-hidden="true"
                />
              </AccordionTrigger>

              <AccordionContent className="pt-2 pb-0 pl-13.5 sm:pl-16 lg:pl-24">
                <span className="block w-full max-w-125 animate-in fade-in slide-in-from-bottom-2 text-[0.9375rem] leading-relaxed text-pretty duration-500 ease-out lg:text-base">
                  {step.copy}
                </span>
              </AccordionContent>
            </div>
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
