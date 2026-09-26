import { SiteFooter } from "@/shared/components/layout/SiteFooter";
import { SiteHeader } from "@/shared/components/layout/SiteHeader";

/** Hiện khi không lấy được nội dung trang từ backend (không có nội dung dự phòng). */
export function ServiceUnavailable() {
  return (
    <div className="min-h-screen bg-white text-charcoal">
      <SiteHeader />
      <main className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-6 py-32 text-center">
        <p className="text-base leading-relaxed">
          Nội dung trang đang được cập nhật, vui lòng quay lại sau ít phút.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
