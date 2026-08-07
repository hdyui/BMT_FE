import { CareerOpenings } from "@/features/careers/components/CareerOpenings";
import { CareersHero } from "@/features/careers/components/CareersHero";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { ContactForm } from "@/lib/components/shared/ContactForm";

export function CareersPage() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden">
        <CareersHero />
        <CareerOpenings />
        <ContactForm />
      </main>
      <SiteFooter />
    </>
  );
}
