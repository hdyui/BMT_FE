import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/components/ui/accordion";
import { processSteps } from "@/features/services/data/full-construction";

export function ProcessAccordion() {
  return (
    <Accordion
      className="mx-auto w-[min(1200px,calc(100%-2.25rem))]"
      defaultValue={["step-1"]}
    >
      {processSteps.map((step, index) => (
        <AccordionItem
          className="border-b border-neutral-400"
          value={`step-${index + 1}`}
          key={step.title}
        >
          <AccordionTrigger className="grid min-h-24 grid-cols-[76px_42px_1fr] items-center gap-3 rounded-none py-4 hover:no-underline sm:grid-cols-[220px_52px_1fr] lg:grid-cols-[340px_72px_1fr] lg:gap-6">
            <span className="relative h-16 w-[76px] overflow-hidden rounded-2xl sm:w-[220px] lg:w-[340px]">
              <Image
                className="object-cover transition-transform duration-500 hover:scale-105"
                src={step.image}
                alt=""
                fill
                sizes="340px"
              />
            </span>
            <span className="text-base font-bold lg:text-lg">
              {String(index + 1).padStart(2, "0")}.
            </span>
            <span className="pr-4 text-lg font-normal sm:text-2xl lg:text-[34px]">
              {step.title}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-6 pl-[130px] text-[15px] leading-relaxed sm:pl-[296px] lg:pl-[435px] lg:text-base">
            {step.copy}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
