"use client";

import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/components/ui/accordion";
import { Reveal } from "@/lib/components/shared/Reveal";
import { frequentlyAskedQuestions } from "@/features/services/data/overview";

const CLOSE_DURATION = 300;
// Bản thiết kế chỉ hiển thị 4 câu đầu; dữ liệu vẫn giữ đủ 10 câu trong
// data/overview.ts, tăng số này lên là hiện thêm.
const VISIBLE_QUESTIONS = 4;

export function FaqAccordion() {
  const [value, setValue] = useState<string[]>(["faq-1"]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function handleValueChange(next: string[]) {
    if (timer.current) clearTimeout(timer.current);
    const isSwitchingQuestion = value.length > 0 && next.length > 0 && next[0] !== value[0];
    if (isSwitchingQuestion) {
      setValue([]);
      timer.current = setTimeout(() => setValue(next), CLOSE_DURATION);
      return;
    }
    setValue(next);
  }

  return (
    <Accordion
      className="border-t border-neutral-300"
      value={value}
      onValueChange={handleValueChange}
    >
      {frequentlyAskedQuestions.slice(0, VISIBLE_QUESTIONS).map((faq, index) => (
        <Reveal delay={Math.min(index * 70, 420)} key={faq.question}>
          <AccordionItem
            className="border-b border-neutral-300"
            value={`faq-${index + 1}`}
          >
            <AccordionTrigger className="w-full rounded-none py-2.5 text-left text-[15px] font-normal text-pretty hover:text-brand hover:no-underline group-aria-expanded/accordion-trigger:text-brand **:data-[slot=accordion-trigger-icon]:hidden">
              <span className="flex items-start gap-3">
                <span
                  className="mt-1.5 size-2.5 shrink-0 rounded-full border border-charcoal transition-colors duration-300 group-aria-expanded/accordion-trigger:border-charcoal group-aria-expanded/accordion-trigger:bg-charcoal"
                  aria-hidden="true"
                />
                {faq.question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pl-[26px] text-sm leading-relaxed text-pretty">
              {/* 378px (khoảng hợp lệ 370-384) để câu trả lời ngắt đúng 3 hàng,
                  xuống dòng ngay sau "nhà ở,"; text-wrap ghi đè text-pretty
                  thừa hưởng từ khối cha để trình duyệt không tự cân lại dòng. */}
              <span className="block max-w-[378px] animate-in fade-in slide-in-from-bottom-2 text-wrap duration-500 ease-out">
                {faq.answer}
              </span>
            </AccordionContent>
          </AccordionItem>
        </Reveal>
      ))}
    </Accordion>
  );
}
