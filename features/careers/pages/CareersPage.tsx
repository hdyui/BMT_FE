import { CareerOpenings } from "@/features/careers/components/CareerOpenings";
import { CareersHero } from "@/features/careers/components/CareersHero";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";
import { ContactForm } from "@/shared/components/ContactForm";

export function CareersPage() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden" data-scroll-snap-page>
        <CareersHero />
        <CareerOpenings />
        <ContactForm showTopNotch />
      </main>
      <SiteFooter showTopBorder={false} />
    </>
  );
}
