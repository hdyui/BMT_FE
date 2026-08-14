"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/components/ui/accordion";
import { Reveal } from "@/lib/components/shared/Reveal";
import { frequentlyAskedQuestions } from "@/features/services/data/overview";

// Bản thiết kế chỉ hiển thị 4 câu đầu; dữ liệu vẫn giữ đủ 10 câu trong
// data/overview.ts, tăng số này lên là hiện thêm.
const VISIBLE_QUESTIONS = 4;

export function FaqAccordion() {
  // Accordion mặc định multiple=false (chỉ 1 câu mở tại 1 thời điểm) nên
  // chuyển câu hỏi có thể set value thẳng, không cần tự đóng hết rồi mới mở
  // lại (cách cũ gây khoảng "sập về 0" giữa 2 lần đổi câu, làm khung bị nhảy).
  const [value, setValue] = useState<string[]>(["faq-1"]);

  return (
    <Accordion
      className="border-t border-neutral-300 w-full max-w-md"
      value={value}
      onValueChange={setValue}
    >
      {frequentlyAskedQuestions.slice(0, VISIBLE_QUESTIONS).map((faq, index) => (
        <Reveal delay={Math.min(index * 70, 420)} key={faq.question}>
          <AccordionItem
            className="border-b border-neutral-300"
            value={`faq-${index + 1}`}
          >
            <AccordionTrigger className="w-full rounded-none py-2.5 text-left text-[0.9375rem] font-normal text-pretty hover:text-brand active:text-brand hover:no-underline aria-expanded:text-brand **:data-[slot=accordion-trigger-icon]:hidden">
              <span className="flex items-start gap-3 font-bold ">
                <span
                  className="mt-1.5 size-2.5 shrink-0 rounded-full border border-charcoal transition-colors duration-300 group-aria-expanded/accordion-trigger:border-charcoal group-aria-expanded/accordion-trigger:bg-charcoal"
                  aria-hidden="true"
                />
                {faq.question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pl-6.5 text-sm leading-relaxed text-pretty">
              {/* 378px (khoảng hợp lệ 370-384) để câu trả lời ngắt đúng 3 hàng,
                  xuống dòng ngay sau "nhà ở,"; text-wrap ghi đè text-pretty
                  thừa hưởng từ khối cha để trình duyệt không tự cân lại dòng. */}
              {/* min-h cố định (đủ cho câu trả lời dài nhất, ~3 hàng) để cả 4 câu
                  đều mở ra cùng một chiều cao nội dung — tránh khung section bị
                  đẩy lên/xuống khác nhau tuỳ câu hỏi đang mở. */}
              <span className="block w-full max-w-94.5 animate-in fade-in slide-in-from-bottom-2 text-wrap duration-500 ease-out lg:min-h-24 lg:text-justify">
                {faq.answer}
              </span>
            </AccordionContent>
          </AccordionItem>
        </Reveal>
      ))}
    </Accordion>
  );
}
