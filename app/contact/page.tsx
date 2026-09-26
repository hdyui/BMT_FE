import type { Metadata } from "next";
import { ContactPage } from "@/features/contact/pages/ContactPage";
import { getContactData } from "@/shared/lib/api/public-data";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ BMT Decor để được tư vấn thiết kế kiến trúc, nội thất, xây dựng, cải tạo và sửa chữa nhà.",
};
export default async function Page() {
  return <ContactPage data={await getContactData()} />;
}
