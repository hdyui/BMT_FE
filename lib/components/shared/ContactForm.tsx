"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";

type FieldName = "name" | "phone";
type Errors = Partial<Record<FieldName, string>>;

const requiredMessage = "Vui lòng nhập thông tin.";

type ContactFormProps = {
  /** Bo góc phải phía trên: nửa trái nhô lên, nửa phải để lộ nền section trên.
   *  Tắt khi section phía trên đã tự thò xuống che phần này. */
  topNotch?: boolean;
  /** Giữ tương thích với các trang dịch vụ dùng biến thể mobile của PR #15. */
  mobileServiceMockup?: boolean;
};

export function ContactForm({
  topNotch = true,
  mobileServiceMockup = false,
}: ContactFormProps = {}) {
  const [errors, setErrors] = useState<Errors>({});
  const [entered, setEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reveal = () => setEntered(true);
    const rect = section.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight * 0.94) {
      const frame = window.requestAnimationFrame(reveal);
      return () => window.cancelAnimationFrame(frame);
    }

    if (!("IntersectionObserver" in window)) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        reveal();
        observer.disconnect();
      },
      { threshold: 0.08, rootMargin: "0px 0px -6%" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function clearFieldError(field: FieldName) {
    setErrors((current) => {
      if (!current[field]) return current;
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const nextErrors: Errors = {};

    if (!String(form.get("name") ?? "").trim()) nextErrors.name = requiredMessage;
    if (!String(form.get("phone") ?? "").trim()) nextErrors.phone = requiredMessage;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    toast.success("Cảm ơn bạn đã gửi thông tin. BMT Decor sẽ liên hệ với bạn trong thời gian sớm nhất.");
    formElement.reset();
    setErrors({});
  }

  const inputClassName =
    "h-12 rounded-full border-2 border-transparent bg-white px-5 text-base text-charcoal shadow-sm placeholder:text-neutral-500 transition-[border-color,box-shadow] duration-300 focus-visible:border-white focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:shadow-[0_0_0_4px_rgb(255_255_255/.2),0_12px_30px_rgb(36_33_34/.22)] aria-invalid:border-red-600 aria-invalid:ring-4 aria-invalid:ring-red-950/15 max-lg:h-7 max-lg:px-3 max-lg:py-0 max-lg:text-[11px] max-lg:leading-none max-lg:focus-visible:ring-2 max-lg:aria-invalid:ring-2 md:max-lg:text-[11px]";
  const errorClassName =
    "mt-1 block pl-3 text-[11px] font-medium leading-4 text-red-950 lg:mt-1.5 lg:pl-4 lg:text-sm lg:leading-normal";

  return (
    <section
      className="relative bg-brand py-14 text-white max-lg:z-10 max-lg:overflow-hidden max-lg:bg-transparent max-lg:pt-8 max-lg:pb-[31px]"
      data-mobile-service-mockup={mobileServiceMockup || undefined}
      id="contact-form"
      ref={sectionRef}
    >
      {topNotch && (
        <span
          className="pointer-events-none absolute bottom-full left-0 z-20 hidden h-11 w-[calc(50%+2.75rem)] bg-[radial-gradient(circle_at_top_right,transparent_2.75rem,var(--brand)_calc(2.75rem+0.5px))] lg:block"
          aria-hidden="true"
        />
      )}
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[2.342945vw] hidden bg-[#ee7b30] max-lg:block"
        aria-hidden="true"
      />
      <Image
        className="absolute left-0 top-0 hidden h-auto w-full max-lg:block"
        src="/images/contact/mobile/form-background.png"
        alt=""
        width={3884}
        height={2109}
        decoding="sync"
        loading="eager"
        sizes="(max-width: 1023px) 100vw, 1px"
        unoptimized
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-[min(1200px,calc(100%-2.25rem))] max-lg:w-[calc(100%-2rem)]">
        <div className="block w-full">
          <div className={`transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${entered ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
            <h2 className="mb-2 text-3xl font-bold uppercase lg:text-[32px] max-lg:text-[17px] max-lg:font-extrabold max-lg:leading-[1.15]">
              Liên hệ tư vấn
            </h2>
          </div>
          <div className="relative h-4 w-full lg:h-10" aria-hidden="true">
            <span
              className={`absolute inset-x-0 bottom-0 h-px origin-left bg-white transition-transform duration-700 ease-out motion-reduce:scale-x-100 motion-reduce:transition-none lg:h-0.5 ${entered ? "scale-x-100" : "scale-x-0"}`}
              style={{ transitionDelay: "120ms" }}
            />
            <span
              className={`absolute right-0 bottom-0 h-4 w-6 overflow-hidden transition-[opacity,translate,scale] duration-500 ease-out motion-reduce:translate-x-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none lg:h-10 lg:w-12 ${entered ? "translate-x-0 scale-100 opacity-100" : "translate-x-2 scale-90 opacity-0"}`}
              style={{ transitionDelay: "480ms" }}
            >
              <Image
                className="absolute right-0 bottom-0 h-4 w-auto max-w-none brightness-0 invert lg:h-10"
                src="/images/home/section-rule.png"
                alt=""
                width={1388}
                height={128}
                decoding="sync"
                loading="eager"
                sizes="(max-width: 1023px) 174px, 434px"
                unoptimized
              />
            </span>
          </div>
        </div>

        <form className="mt-7 max-lg:mt-[clamp(0.75rem,3.1116vw,2rem)]" onSubmit={handleSubmit} noValidate>
          <div
            className={`transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${entered ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
            style={{ transitionDelay: "220ms" }}
          >
            <div className="grid gap-[13px] lg:grid-cols-2 lg:gap-x-8">
              <label>
                <span className="sr-only">Tên khách hàng</span>
                <Input
                  className={inputClassName}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  aria-invalid={Boolean(errors.name)}
                  name="name"
                  onChange={() => clearFieldError("name")}
                  placeholder="Tên khách hàng..."
                />
                {errors.name && <span className={errorClassName} id="contact-name-error">{errors.name}</span>}
              </label>

              <label>
                <span className="sr-only">Số điện thoại</span>
                <Input
                  className={inputClassName}
                  aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                  aria-invalid={Boolean(errors.phone)}
                  name="phone"
                  onChange={() => clearFieldError("phone")}
                  placeholder="Số điện thoại..."
                  type="tel"
                />
                {errors.phone && <span className={errorClassName} id="contact-phone-error">{errors.phone}</span>}
              </label>
            </div>
          </div>

          <div
            className={`transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            style={{ transitionDelay: "360ms" }}
          >
            <Button
              className="mt-4 h-12 w-full rounded-full bg-charcoal text-base font-semibold text-white shadow-md transition-[background-color,box-shadow,transform] duration-300 ease-out hover:scale-[1.015] hover:bg-neutral-600 hover:shadow-[0_12px_28px_rgb(36_33_34/.25)] active:scale-[.985] active:shadow-sm max-lg:mt-[13px] max-lg:ml-auto max-lg:block max-lg:h-7 max-lg:w-[clamp(6.5rem,27vw,8.75rem)] max-lg:min-w-0 max-lg:text-[11px] max-lg:font-extrabold"
              type="submit"
            >
              Gửi ngay
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
