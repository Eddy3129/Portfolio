import Projects from "../../components/projects/Projects";
import { getProjects } from "@/lib/actions";

export const revalidate = 3600; // Cache for 1 hour

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <Projects initialProjects={projects} />;
}
