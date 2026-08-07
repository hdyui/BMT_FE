"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";

type FieldName = "name" | "phone";
type Errors = Partial<Record<FieldName, string>>;

const requiredMessage = "Vui lòng nhập thông tin.";

type ContactFormProps = {
  /** Bo góc phải phía trên: nửa trái nhô lên, nửa phải để lộ nền section trên.
   *  Tắt khi section phía trên đã tự thò xuống che phần này. */
  topNotch?: boolean;
};

export function ContactForm({ topNotch = true }: ContactFormProps = {}) {
  const [errors, setErrors] = useState<Errors>({});

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

    if (!String(form.get("name") ?? "").trim()) {
      nextErrors.name = requiredMessage;
    }
    if (!String(form.get("phone") ?? "").trim()) {
      nextErrors.phone = requiredMessage;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    toast.success(
      "Cảm ơn bạn đã gửi thông tin. BMT Decor sẽ liên hệ với bạn trong thời gian sớm nhất.",
    );
    formElement.reset();
    setErrors({});
  }

  const inputClassName =
    "h-12 rounded-full border-2 border-transparent bg-white px-5 text-base text-charcoal shadow-sm placeholder:text-neutral-500 transition-[border-color,box-shadow] duration-300 focus-visible:border-white focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:shadow-[0_0_0_4px_rgb(255_255_255/.2),0_12px_30px_rgb(36_33_34/.22)] aria-invalid:border-red-600 aria-invalid:ring-4 aria-invalid:ring-red-950/15";

  return (
    <section className="relative bg-brand py-14 text-white" id="contact-form">
      {/* Dải cam nhô lên khỏi mép trên, phủ nửa trái và bo lõm ở góc phải
          (đường tròn bán kính 44px tâm tại góc phải-trên của dải) nên phần
          còn lại vẫn để lộ nền của section phía trên. */}
      {topNotch && (
        <span
          className="pointer-events-none absolute bottom-full left-0 z-20 hidden h-11 w-[calc(50%+2.75rem)] bg-[radial-gradient(circle_at_top_right,transparent_2.75rem,var(--brand)_calc(2.75rem+0.5px))] lg:block"
          aria-hidden="true"
        />
      )}

      <div className="mx-auto w-[min(1200px,calc(100%-2.25rem))]">
        <div className="block w-full">
          <Reveal>
            <h2 className="mb-2 text-3xl font-bold uppercase sm:text-[32px]">
              Liên hệ tư vấn
            </h2>
          </Reveal>
          <BuildingRule className="max-w-none" light fullWidth delay={180} />
        </div>
        <form className="mt-7" onSubmit={handleSubmit} noValidate>
          <Reveal delay={220}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-x-8">
              <label>
                <span className="sr-only">Tên khách hàng</span>
                <Input
                  className={inputClassName}
                  aria-describedby={
                    errors.name ? "contact-name-error" : undefined
                  }
                  aria-invalid={Boolean(errors.name)}
                  name="name"
                  onChange={() => clearFieldError("name")}
                  placeholder="Tên khách hàng..."
                />
                {errors.name && (
                  <span
                    className="mt-1.5 block pl-4 text-sm font-medium text-red-950"
                    id="contact-name-error"
                  >
                    {errors.name}
                  </span>
                )}
              </label>

              <label>
                <span className="sr-only">Số điện thoại</span>
                <Input
                  className={inputClassName}
                  aria-describedby={
                    errors.phone ? "contact-phone-error" : undefined
                  }
                  aria-invalid={Boolean(errors.phone)}
                  name="phone"
                  onChange={() => clearFieldError("phone")}
                  placeholder="Số điện thoại..."
                  type="tel"
                />
                {errors.phone && (
                  <span
                    className="mt-1.5 block pl-4 text-sm font-medium text-red-950"
                    id="contact-phone-error"
                  >
                    {errors.phone}
                  </span>
                )}
              </label>
            </div>
          </Reveal>

          <Reveal delay={380}>
            <Button
              className="mt-4 h-12 w-full rounded-full bg-charcoal text-base font-semibold text-white shadow-md transition-[background-color,box-shadow,transform] duration-300 ease-out hover:scale-[1.015] hover:bg-neutral-600 hover:shadow-[0_12px_28px_rgb(36_33_34/.25)] active:scale-[.985] active:shadow-sm"
              type="submit"
            >
              Gửi ngay
            </Button>
          </Reveal>
        </form>
      </div>
    </section>
  );
}
