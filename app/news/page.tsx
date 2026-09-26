import { NewsPage } from "@/features/news/pages/NewsPage";
import { getNewsData } from "@/shared/lib/api/public-data";


export default async function Page() {
  return <NewsPage data={await getNewsData()} />;
}
