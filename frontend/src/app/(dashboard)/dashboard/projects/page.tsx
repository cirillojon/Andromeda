import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import fetchDbUser from "@/utils/api";
import { DbUser, Project } from "@/utils/interfaces";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Check, Minus, Plus } from "lucide-react";
import Link from "next/link";

const page = async () => {
  const user = await getKindeServerSession();
  const currentUser = await user.getUser();
  if (!currentUser) {
    // Handle this correctly
    return null;
  }

  const dbUser: DbUser | null = await fetchDbUser(currentUser.id);
  let projects: Project[] = [];

  if (dbUser != null) {
    try {
      const getProjectsUrl = new URL(
        `/api/project/user/${dbUser.id}`,
        process.env.NEXT_FRONTEND_BASE_URL
      );

      const response = await fetch(getProjectsUrl.toString());
      if (response.ok) {
        projects = await response.json();
      } else {
        console.error("Failed to fetch projects:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  console.log("PROJECTS:", projects);
  return (
    <div className="w-full p-4 md:p-8 h-screen overflow-y-auto">
      <div className="grid grid-rows-2">
        <span className="text-3xl font-bold items-start">Active Projects</span>
        <span className="text-gray-500">Your active or pending projects.</span>
      </div>
      <div className="mb-6 rounded-lg">
        {projects.filter((project) => project.status === "PENDING").length > 0 ? (
          projects
            .filter((project) => project.status === "PENDING")
            .map((project) => (
              <div key={project.id} className="mb-4">
                <Card>
                  <CardHeader className="p-2">
                    <div className="grid grid-cols-2 items-center">
                      <div>
                        <CardTitle className="mb-2">{project.project_name}</CardTitle>
                        <CardDescription>{project.status}</CardDescription>
                      </div>
                      <div className="flex flex-col justify-end items-end space-y-2">
                        <Check className="text-white rounded-full bg-green-500 p-1" />
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="text-blue-500"
                        >
                          View Project
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            ))
        ) : (
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              You have no active projects.
            </div>
            <div
              className={cn(
                buttonVariants({ variant: "outline" }),
                "bg-green-500 hover:cursor-pointer hover:bg-green-200 mt-4 inline-flex items-center rounded-full p-2"
              )}
            >
              <Plus className="mr-1" />
              <Link href="/form" className="justify-start">
                Project
              </Link>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-rows-2">
        <span className="text-3xl font-bold items-start">Inactive Projects</span>
        <span className="text-gray-500">Your completed or canceled projects.</span>
      </div>
      <div className="mb-36 rounded-lg">
        {projects.filter((project) => project.status === "COMPLETE").length > 0 ? (
          projects
            .filter((project) => project.status === "COMPLETE")
            .map((project) => (
              <div key={project.id} className="mb-4">
                <Card>
                  <CardHeader className="p-2">
                    <div className="grid grid-cols-2 items-center">
                      <div>
                        <CardTitle>{project.project_name}</CardTitle>
                        <CardDescription>{project.status}</CardDescription>
                      </div>
                      <div className="flex flex-col justify-end items-end space-y-2">
                        <Minus className="text-white rounded-full bg-gray-500 p-1" />
                        <Link
                          href={`/dashboard/projects/${project.id}`}
                          className="text-blue-500"
                        >
                          View Project
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            ))
        ) : (
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              You have no inactive projects.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;