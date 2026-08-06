"use client";

import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";

export function CareersContactForm() {
  const [errors, setErrors] = useState({ name: false, phone: false });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const next = {
      name: !String(data.get("name") ?? "").trim(),
      phone: !String(data.get("phone") ?? "").trim(),
    };
    setErrors(next);
    if (next.name || next.phone) return;
    toast.success("Cảm ơn bạn! BMT Decor sẽ liên hệ trong thời gian sớm nhất.");
    form.reset();
  }

  const inputClass = "h-12 w-full rounded-full border-2 border-transparent bg-white px-5 text-charcoal outline-none placeholder:text-neutral-500 transition-shadow focus:border-white focus:shadow-[0_0_0_4px_rgba(255,255,255,.28)]";

  return (
    <section
      className="relative overflow-hidden bg-brand pt-[clamp(5rem,5.5vw,7rem)] pb-14 text-white"
      id="contact-form"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-px -top-px h-10 w-[calc(50%+2px)] rounded-bl-[2.25rem] [transform:translateZ(0)] bg-white sm:h-11 sm:rounded-bl-[2.75rem] lg:h-12 lg:rounded-bl-[3rem]"
      />
      <div className="relative z-10 mx-auto w-[min(1180px,calc(100%-2.25rem))]">
        <div className="flex items-end gap-6">
          <Reveal className="shrink-0"><h2 className="text-2xl font-bold uppercase sm:text-3xl">Liên hệ tư vấn</h2></Reveal>
          <BuildingRule className="max-w-none" delay={120} light />
        </div>
        <form className="mt-7" onSubmit={submit} noValidate>
          <Reveal delay={220}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-8">
              <label>
                <span className="sr-only">Tên khách hàng</span>
                <input className={inputClass} name="name" placeholder="Tên khách hàng..." aria-invalid={errors.name} onChange={() => setErrors((value) => ({ ...value, name: false }))} />
                {errors.name && <span className="mt-1 block pl-4 text-sm text-red-950">Vui lòng nhập tên khách hàng.</span>}
              </label>
              <label>
                <span className="sr-only">Số điện thoại</span>
                <input className={inputClass} name="phone" placeholder="Số điện thoại..." type="tel" aria-invalid={errors.phone} onChange={() => setErrors((value) => ({ ...value, phone: false }))} />
                {errors.phone && <span className="mt-1 block pl-4 text-sm text-red-950">Vui lòng nhập số điện thoại.</span>}
              </label>
            </div>
            <button className="mt-4 h-12 w-full rounded-full bg-charcoal font-semibold text-white transition-[background-color,box-shadow,transform] duration-300 hover:scale-[1.01] hover:bg-neutral-700 hover:shadow-xl active:scale-[.985]" type="submit">Gửi ngay</button>
          </Reveal>
        </form>
      </div>
    </section>
  );
}
