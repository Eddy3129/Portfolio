import { PROJECT_QUERY, EXPERIENCE_QUERY } from "./hygraph";

async function fetchHygraph(query) {
  const res = await fetch(process.env.HYGRAPH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error("Hygraph Error:", json.errors);
    throw new Error("Failed to fetch data from Hygraph");
  }

  return json.data;
}

export async function getProjects() {
  const data = await fetchHygraph(PROJECT_QUERY);
  return data.projects;
}

export async function getExperiences() {
  const data = await fetchHygraph(EXPERIENCE_QUERY);
  return data.experiences;
}
