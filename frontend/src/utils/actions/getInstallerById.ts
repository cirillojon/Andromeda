"use server";
import { Installer } from "../interfaces";

const getInstallerById = async (
  installerId: string
): Promise<Installer | null> => {
  const getInstallerUrl = new URL(
    `/api/installer/${installerId}`,
    process.env.NEXT_FRONTEND_BASE_URL
  ).toString();

  try {
    const response = await fetch(getInstallerUrl);
    if (!response.ok) {
      throw new Error(`Error fetching installer: ${response.statusText}`);
    }
    const installer: Installer = await response.json();
    return installer;
  } catch (error) {
    console.error(`Failed to fetch installer with id: ${installerId}`, error);
    return null;
  }
};

export default getInstallerById;
