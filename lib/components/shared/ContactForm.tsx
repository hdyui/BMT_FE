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
  revealPreviousBackground?: boolean;
};

export function ContactForm({
  revealPreviousBackground = false,
}: ContactFormProps = {}) {
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
    <section
      className="relative isolate overflow-hidden bg-brand pt-[clamp(5rem,5.5vw,7rem)] pb-14 text-white"
      id="contact-form"
    >
      {!revealPreviousBackground && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-px -top-px h-10 w-[calc(50%+1px)] rounded-bl-[2.25rem] [transform:translateZ(0)] bg-white sm:h-11 sm:rounded-bl-[2.75rem] lg:h-12 lg:rounded-bl-[3rem]"
        />
      )}
      <div className="relative z-30 mx-auto w-[min(92%,78rem)] xl:w-[62.5%]">
        <div className="grid gap-1 [&_h2]:text-[clamp(1.5rem,1.9vw,2.4rem)] [&_h2]:!font-bold">
          <Reveal className="shrink-0">
            <h2 className="text-2xl font-bold uppercase">
              Liên hệ tư vấn
            </h2>
          </Reveal>
          <BuildingRule className="max-w-none" light delay={180} />
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
