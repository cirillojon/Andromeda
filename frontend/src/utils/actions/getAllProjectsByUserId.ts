"use server";
import { Project } from "../interfaces";

const getAllProjectsByUserId = async (
  userId: string
): Promise<Project[] | null> => {
  const getProjectsUrl = new URL(
    `/api/project/user/${userId}`,
    process.env.NEXT_FRONTEND_BASE_URL
  );

  try {
    const response = await fetch(getProjectsUrl.toString());
    if (!response.ok) {
      throw new Error(`Error fetching projects: ${response.statusText}`);
    }
    const projects: Project[] = await response.json();
    return projects;
  } catch (error) {
    console.error(`Failed to fetch projects for user, id: ${userId}`, error);
    return null;
  }
};

export default getAllProjectsByUserId;
