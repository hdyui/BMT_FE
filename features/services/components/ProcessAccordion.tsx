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
      className="mx-auto w-[min(1200px,calc(100%-2.25rem))]"
      defaultValue={["step-1"]}
    >
      {processSteps.map((step, index) => (
        <AccordionItem
          className="group/step border-b border-neutral-300"
          value={`step-${index + 1}`}
          key={step.title}
        >
          <div className="grid grid-cols-[76px_1fr] items-center gap-3 py-4 sm:grid-cols-[220px_1fr] lg:grid-cols-[340px_1fr] lg:gap-6">
            {/* Chỉ khung ảnh cao lên; object-cover luôn bị giới hạn theo chiều
                ngang nên ảnh giữ nguyên tỉ lệ, chỉ lộ thêm phần trên dưới.
                Chiều cao = bề rộng cột × 320/1420 (thu gọn) và × 639/1420 (mở);
                bo góc bằng CSS vì lúc thu gọn phần bo sẵn trong ảnh bị cắt mất. */}
            <AccordionTrigger className="relative block h-4.25 w-full overflow-hidden rounded-[3px] transition-[height] duration-300 ease-out group-data-open/step:h-[34px] sm:h-[50px] sm:rounded-[9px] sm:group-data-open/step:h-[99px] lg:h-[77px] lg:rounded-[14px] lg:group-data-open/step:h-[153px]">
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
              <AccordionTrigger className="grid w-full grid-cols-[42px_1fr_auto] items-center gap-3 rounded-none py-0 hover:no-underline sm:grid-cols-[52px_1fr_auto] lg:grid-cols-[72px_1fr_auto] lg:gap-6 **:data-[slot=accordion-trigger-icon]:hidden">
                <span className="text-base lg:text-lg text-charcoal">
                  {String(index + 1).padStart(2, "0")}.
                </span>
                <span className="pr-4 font-heading text-left text-lg font-bold sm:text-2xl lg:text-[34px]">
                  {step.title}
                </span>
                <span
                  className="h-6 w-4.75 shrink-0 bg-charcoal transition-[background-color,rotate] duration-300 ease-out group-aria-expanded/accordion-trigger:rotate-180 group-aria-expanded/accordion-trigger"
                  style={arrowMask}
                  aria-hidden="true"
                />
              </AccordionTrigger>

              <AccordionContent className="pt-2 pb-0 pl-13.5 sm:pl-16 lg:pl-24">
                <span className="block max-w-125 animate-in fade-in slide-in-from-bottom-2 text-[15px] leading-relaxed text-pretty duration-500 ease-out lg:text-base">
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
