import { HomePage } from "@/features/home/pages/HomePage";
import { getHomeData } from "@/shared/lib/api/public-data";


export default async function Page() {
  return <HomePage data={await getHomeData()} />;
}
