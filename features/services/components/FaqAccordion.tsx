import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/components/ui/accordion";
import { frequentlyAskedQuestions } from "@/features/services/data/full-construction";

export function FaqAccordion() {
  return (
    <Accordion className="border-t border-neutral-400" defaultValue={["faq-1"]}>
      {frequentlyAskedQuestions.map((faq, index) => (
        <AccordionItem
          className="border-b border-neutral-400"
          value={`faq-${index + 1}`}
          key={faq.question}
        >
          <AccordionTrigger className="rounded-none py-4 text-base font-normal hover:text-brand hover:no-underline">
            <span className="flex gap-3">
              <span aria-hidden="true">{index === 0 ? "●" : "○"}</span>
              {faq.question}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pl-7 text-[15px] leading-relaxed">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
