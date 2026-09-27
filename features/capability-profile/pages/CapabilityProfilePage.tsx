import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";
import { ContactForm } from "@/shared/components/ContactForm";
import { ContentUnavailable } from "@/shared/components/ContentUnavailable";
import { contactFormChrome } from "@/shared/components/contact-form-chrome";
import { CapabilityHero } from "../components/CapabilityHero";
import { ProfileDocumentSection } from "../components/ProfileDocumentSection";
import {
  getCapabilityProfileContent,
  getCapabilityProfilePages,
} from "../services/capability-profile.service";

export async function CapabilityProfilePage() {
  // Toàn bộ nội dung do admin quản lý và lấy từ backend; không có bản tĩnh thay thế.
  const [content, pages] = await Promise.all([
    getCapabilityProfileContent(),
    getCapabilityProfilePages(),
  ]);
  if (!content || !pages) return <ContentUnavailable />;

  return (
    <div className="min-h-[100dvh] overflow-x-clip bg-[#f7f7f7] pt-[60px]">
      <SiteHeader />
      <main>
        <CapabilityHero content={content.hero} />
        <ProfileDocumentSection pages={pages} heading={content.hero.documentHeading} />
        {/* Phần khuyết phía trên ContactForm trong suốt, nên bọc nền trùng màu
            section ngay trên (#fdfdfd) để không lộ vệt xám của nền trang. */}
        <div className="bg-[#fdfdfd]">
          <ContactForm
            showTopNotch
            {...contactFormChrome}
            title={content.contactForm.title}
            description={content.contactForm.subtitle}
            successMessage={content.contactForm.successMessage}
          />
        </div>
      </main>
      {/* Nền form đã là cam nên bỏ vạch cam 10px mặc định ở đầu footer,
          giống trang chủ và các trang dịch vụ. */}
      <SiteFooter showTopBorder={false} />
    </div>
  );
}
