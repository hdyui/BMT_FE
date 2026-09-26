import { AboutPage } from "@/features/about/pages/AboutPage";
import { getAboutData } from "@/shared/lib/api/public-data";


export default async function Page() {
  return <AboutPage data={await getAboutData()} />;
}
