import { QuotationEstimator } from "@/features/quotation/components/QuotationEstimator";
import { QuotationHero } from "@/features/quotation/components/QuotationHero";
import styles from "@/features/quotation/quotation.module.css";
import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { ContactForm } from "@/lib/components/shared/ContactForm";

export function QuotationPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <QuotationHero />
        <QuotationEstimator />
        <ContactForm />
      </main>
      <SiteFooter />
    </div>
  );
}
