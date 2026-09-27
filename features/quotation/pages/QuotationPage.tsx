import { QuotationContactForm } from "@/features/quotation/components/QuotationContactForm";
import { QuotationEstimator } from "@/features/quotation/components/QuotationEstimator";
import { QuotationHero } from "@/features/quotation/components/QuotationHero";
import { getQuotationContent } from "@/features/quotation/services/quotation.service";
import styles from "@/features/quotation/quotation.module.css";
import { ContentUnavailable } from "@/shared/components/ContentUnavailable";
import { contactFormChrome } from "@/shared/components/contact-form-chrome";
import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";

export async function QuotationPage() {
  // Toàn bộ nội dung do admin quản lý và lấy từ backend; không có bản tĩnh thay thế.
  const content = await getQuotationContent();
  if (!content) return <ContentUnavailable />;

  return (
    <div
      className={`min-h-dvh overflow-x-clip bg-white text-[#231f20] ${styles.page}`}
    >
      <SiteHeader />
      <main>
        <QuotationHero content={content.hero} />
        <QuotationEstimator content={content.estimator} />
      </main>
      <QuotationContactForm
        showTopNotch
        {...contactFormChrome}
        title={content.contactForm.title}
        description={content.contactForm.subtitle}
        requiredMessage={content.contactForm.requiredMessage}
        successMessage={content.contactForm.successMessage}
      />
      <SiteFooter />
    </div>
  );
}
