import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/components/ui/accordion";
import { Reveal } from "@/lib/components/shared/Reveal";
import { frequentlyAskedQuestions } from "@/features/services/data/overview";

export function FaqAccordion() {
  return (
    <Accordion className="border-t border-neutral-300" defaultValue={["faq-1"]}>
      {frequentlyAskedQuestions.map((faq, index) => (
        <Reveal delay={Math.min(index * 70, 420)} key={faq.question}>
          <AccordionItem
            className="border-b border-neutral-300"
            value={`faq-${index + 1}`}
          >
            <AccordionTrigger className="w-full rounded-none py-3.5 text-left text-[15px] font-normal text-pretty hover:text-brand hover:no-underline group-aria-expanded/accordion-trigger:text-brand **:data-[slot=accordion-trigger-icon]:hidden">
              <span className="flex items-start gap-3">
                <span
                  className="mt-1.5 size-2.5 shrink-0 rounded-full border border-charcoal transition-colors duration-300 group-aria-expanded/accordion-trigger:border-charcoal group-aria-expanded/accordion-trigger:bg-charcoal"
                  aria-hidden="true"
                />
                {faq.question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pl-[26px] text-sm leading-relaxed text-pretty">
              <span className="block animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
                {faq.answer}
              </span>
            </AccordionContent>
          </AccordionItem>
        </Reveal>
      ))}
    </Accordion>
  );
}
