"use client";

import { CareerOpenings } from "@/features/careers/components/CareerOpenings";
import { CareersHero } from "@/features/careers/components/CareersHero";
import type { CareersPublicData } from "@/features/careers/types/careers-public";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";
import { ContactForm } from "@/shared/components/ContactForm";

export function CareersPage({ data }: { data: CareersPublicData }) {


  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden" data-scroll-snap-page>
        <CareersHero hero={data.page.hero} />
        <CareerOpenings
          jobs={data.jobs}
          title={data.page.jobsSection.title}
          dataReady
        />
        <ContactForm
          showTopNotch
          title={data.page.contactForm.title}
          description={data.page.contactForm.description}
          nameLabel={data.page.contactForm.nameLabel}
          namePlaceholder={data.page.contactForm.namePlaceholder}
          phoneLabel={data.page.contactForm.phoneLabel}
          phonePlaceholder={data.page.contactForm.phonePlaceholder}
          submitLabel={data.page.contactForm.submitLabel}
          requiredMessage={data.page.contactForm.requiredMessage}
          successMessage={data.page.contactForm.successMessage}
          submitToApi
        />
      </main>
      <SiteFooter showTopBorder={false} />
    </>
  );
}
