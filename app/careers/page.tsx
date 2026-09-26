import { CareersPage } from "@/features/careers/pages/CareersPage";
import { getCareersData } from "@/shared/lib/api/public-data";

export const metadata = {
  title: "Tuyển dụng",
  description:
    "Khám phá cơ hội nghề nghiệp và gia nhập đội ngũ thiết kế, kiến trúc, thi công tại BMT Decor.",
};
export default async function Page() {
  return <CareersPage data={await getCareersData()} />;
}
