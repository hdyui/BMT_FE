import { ContactForm } from "@/lib/components/shared/ContactForm";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { ContactHero } from "@/features/contact/components/ContactHero";
import { ContactMap } from "@/features/contact/components/ContactMap";

export function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden pt-[85px]">
        <div className="relative z-20">
          <ContactHero />
        </div>
        {/* Hero đã phủ sẵn mép trên nên không cần dải nhô của form. */}
        <ContactForm topNotch={false} />
        <ContactMap />
      </main>
      <SiteFooter showTopBorder={false} />
    </>
  );
}
