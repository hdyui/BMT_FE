import Image from "next/image";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { BuildingRule } from "@/lib/components/shared/BuildingRule";
import { Reveal } from "@/lib/components/shared/Reveal";
import { ContactForm } from "@/lib/components/shared/ContactForm";

type DocumentPageScaffoldProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: readonly string[];
  image?: string;
};

export function DocumentPageScaffold({
  eyebrow,
  title,
  description,
  sections,
  image = "/images/bmt-hero-interior.png",
}: DocumentPageScaffoldProps) {
  return (
    <div
      className="min-h-screen overflow-x-clip pt-[60px] xl:pt-[var(--site-header-desktop-height)]"
      data-scroll-snap-page
    >
      <SiteHeader />
      <section className="relative isolate min-h-[560px]">
        <Image
          className="-z-20 object-cover"
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/80 to-white/10" />
        <Reveal
          className="mx-auto flex min-h-[560px] w-[min(1200px,calc(100%-2.25rem))] flex-col justify-center"
          from="left"
        >
          <p className="text-lg">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-normal text-brand sm:text-6xl">
            {title}
          </h1>
          <BuildingRule className="mt-5" />
          <p className="mt-5 max-w-2xl text-lg leading-relaxed">
            {description}
          </p>
        </Reveal>
      </section>
      <section className="py-20">
        <div className="mx-auto grid w-[min(1200px,calc(100%-2.25rem))] gap-px overflow-hidden bg-neutral-200 md:grid-cols-2">
          {sections.map((section, index) => (
            <Reveal
              className="min-h-48 bg-white p-8 md:p-12"
              delay={index * 100}
              key={section}
            >
              <span className="text-sm text-brand">
                {String(index + 1).padStart(2, "0")}.
              </span>
              <h2 className="mt-3 text-3xl font-normal">{section}</h2>
              <span className="mt-6 block h-0.5 w-24 bg-brand" />
            </Reveal>
          ))}
        </div>
      </section>
      <ContactForm showTopNotch />
      <SiteFooter />
    </div>
  );
}
