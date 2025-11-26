import Experience from "../../components/experience/Experience";
import { getExperiences } from "@/lib/actions";

export const revalidate = 3600; // Cache for 1 hour

export default async function ExperiencePage() {
  const experiences = await getExperiences();
  return <Experience initialExperiences={experiences} />;
}
