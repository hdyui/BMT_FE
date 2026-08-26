import { QuotationContactForm } from "@/features/quotation/components/QuotationContactForm";
import { QuotationEstimator } from "@/features/quotation/components/QuotationEstimator";
import { QuotationHero } from "@/features/quotation/components/QuotationHero";
import { contactFormContent } from "@/features/quotation/data/quotation-contact-form";
import styles from "@/features/quotation/quotation.module.css";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";

export function QuotationPage() {
  return (
    <div
      className={`min-h-dvh overflow-x-clip bg-white text-[#231f20] ${styles.page}`}
    >
      <SiteHeader />
      <main>
        <QuotationHero />
        <QuotationEstimator />
      </main>
      <QuotationContactForm showTopNotch {...contactFormContent} />
      <SiteFooter />
    </div>
  );
}
