import { ProjectsPage } from "@/features/projects/pages/ProjectsPage";
import { getProjectsData } from "@/shared/lib/api/public-data";


export default async function Page() {
  return <ProjectsPage data={await getProjectsData()} />;
}
