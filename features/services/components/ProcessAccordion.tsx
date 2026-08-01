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
          className="border-b border-neutral-300"
          value={`step-${index + 1}`}
          key={step.title}
        >
          <AccordionTrigger className="grid grid-cols-[76px_42px_1fr_auto] items-center gap-3 rounded-none py-4 hover:no-underline sm:grid-cols-[220px_52px_1fr_auto] lg:grid-cols-[340px_72px_1fr_auto] lg:gap-6 **:data-[slot=accordion-trigger-icon]:hidden">
            <span className="relative block aspect-[1420/320] w-full overflow-hidden transition-[aspect-ratio] duration-300 ease-out group-aria-expanded/accordion-trigger:aspect-[1420/639]">
              <Image
                className="object-cover opacity-100 transition-opacity duration-300 group-aria-expanded/accordion-trigger:opacity-0"
                src={step.image}
                alt=""
                fill
                sizes="340px"
                loading="eager"
              />
              <Image
                className="object-cover opacity-0 transition-opacity duration-300 group-aria-expanded/accordion-trigger:opacity-100"
                src={step.imageOpen}
                alt=""
                fill
                sizes="340px"
                loading="eager"
              />
            </span>
            <span className="text-base font-bold text-brand lg:text-lg">
              {String(index + 1).padStart(2, "0")}.
            </span>
            <span className="pr-4 text-left text-lg font-normal sm:text-2xl lg:text-[34px]">
              {step.title}
            </span>
            <span
              className="h-6 w-[19px] shrink-0 bg-charcoal transition-[background-color,rotate] duration-300 ease-out group-aria-expanded/accordion-trigger:rotate-180 group-aria-expanded/accordion-trigger:bg-brand"
              style={arrowMask}
              aria-hidden="true"
            />
          </AccordionTrigger>
          <AccordionContent className="pb-6 pl-[130px] text-[15px] leading-relaxed text-pretty sm:pl-[296px] lg:pl-[435px] lg:text-base">
            <span className="block animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
              {step.copy}
            </span>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
