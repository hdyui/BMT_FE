import { SiteFooter } from "@/lib/components/layout/SiteFooter";
import { SiteHeader } from "@/lib/components/layout/SiteHeader";
import { ContactForm } from "@/lib/components/shared/ContactForm";
import { contactFormContent } from "../data/contact-form";
import { CapabilityHero } from "../components/CapabilityHero";
import { ProfileDocumentSection } from "../components/ProfileDocumentSection";

export function CapabilityProfilePage() {
  return (
    <div className="min-h-[100dvh] overflow-x-clip bg-[#f7f7f7] pt-[60px]">
      <SiteHeader />
      <main>
        <CapabilityHero />
        <ProfileDocumentSection />
        {/* Phần khuyết phía trên ContactForm trong suốt, nên bọc nền trùng màu
            section ngay trên (#fdfdfd) để không lộ vệt xám của nền trang. */}
        <div className="bg-[#fdfdfd]">
          <ContactForm showTopNotch {...contactFormContent} />
        </div>
      </main>
      {/* Nền form đã là cam nên bỏ vạch cam 10px mặc định ở đầu footer,
          giống trang chủ và các trang dịch vụ. */}
      <SiteFooter showTopBorder={false} />
    </div>
  );
}
