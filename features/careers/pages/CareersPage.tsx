import { CareerOpenings } from "@/features/careers/components/CareerOpenings";
import { CareersContactForm } from "@/features/careers/components/CareersContactForm";
import { CareersHero } from "@/features/careers/components/CareersHero";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";

export function CareersPage() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden pt-[85px]">
        <CareersHero />
        <CareerOpenings />
        <CareersContactForm />
      </main>
      <SiteFooter />
    </>
  );
}
