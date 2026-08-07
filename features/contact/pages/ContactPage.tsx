import { ContactForm } from "@/lib/components/shared/ContactForm";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { ContactHero } from "@/features/contact/components/ContactHero";
import { ContactMap } from "@/features/contact/components/ContactMap";

export function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative overflow-hidden pt-[65px]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-[85px] opacity-0 animate-[fade-in_700ms_80ms_ease-out_forwards] motion-reduce:animate-none motion-reduce:opacity-100 xl:block"
          aria-hidden="true"
        >
          <span className="absolute inset-y-0 left-[43.4%] w-[8.07%] bg-[#ef7b30]" />
          <span className="absolute inset-y-0 left-[51.52%] w-[4.28%] bg-[#dfddde]" />
        </div>
        <div className="relative z-20">
          <ContactHero />
        </div>
        <ContactForm revealPreviousBackground />
        <ContactMap />
      </main>
      <SiteFooter showTopBorder={false} />
    </>
  );
}
