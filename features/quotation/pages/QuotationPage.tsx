import { QuotationContactForm } from "@/features/quotation/components/QuotationContactForm";
import { QuotationEstimator } from "@/features/quotation/components/QuotationEstimator";
import { QuotationHero } from "@/features/quotation/components/QuotationHero";
import { contactFormContent } from "@/features/quotation/data/quotation-contact-form";
import styles from "@/features/quotation/quotation.module.css";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";
import { getQuotationPage } from "@/features/quotation/services/quotation.service";

export async function QuotationPage() {
  let content;
  try {
    content = (await getQuotationPage()).content;
  } catch {
    content = undefined;
  }

  const contactForm = content?.contactForm
    ? {
        ...contactFormContent,
        title: content.contactForm.title,
        description: content.contactForm.subtitle,
        requiredMessage: content.contactForm.requiredMessage,
        successMessage: content.contactForm.successMessage,
      }
    : contactFormContent;

  return (
    <div
      className={`min-h-dvh overflow-x-clip bg-white text-[#231f20] ${styles.page}`}
    >
      <SiteHeader />
      <main>
        <QuotationHero content={content?.hero} />
        <QuotationEstimator content={content?.estimator} />
      </main>
      <QuotationContactForm showTopNotch {...contactForm} />
      <SiteFooter />
    </div>
  );
}
