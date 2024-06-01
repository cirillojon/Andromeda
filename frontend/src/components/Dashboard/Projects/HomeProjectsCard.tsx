import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import fetchDbUser from "@/utils/api";
import { DbUser, Project } from "@/utils/interfaces";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import ProjectSummary from "./ProjectSummary";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const HomeProjectsCard = async () => {
  const user = await getKindeServerSession();
  const currentUser = await user.getUser();
  if (!currentUser) {
    //handle this correctly
    return null;
  }
  const dbUser: DbUser | null = await fetchDbUser(currentUser.id);
  let projects: Project[] = [];

  if (dbUser != null) {
    const getProjectsUrl = new URL(
      `/api/project/user/${dbUser.id}`,
      process.env.NEXT_FRONTEND_BASE_URL
    );

    projects = await fetch(getProjectsUrl.toString())
      .then((res) => res.json())
      .then((data) => data);

    console.log("HOMEPROJECTS CARD:", projects);
  }

  return (
    <div className="w-full">
      <div className="grid grid-rows-2">
        <span className="text-3xl font-bold items-start">Active Projects</span>
        <span className="text-gray-500">
          A summary of your active projects and their status.
        </span>
      </div>
      <div className="mb-6 rounded-lg h-screen pb-48 overflow-y-auto">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectSummary key={project.id} project={project} />
          ))
        ) : (
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              You have no active projects.
            </div>
            <div className={cn(buttonVariants({variant: "outline"}), " bg-green-500 hover:cursor-pointer hover:bg-green-200 mt-4 flex items-center rounded-full w-1/4")}>
              <Plus className="flex" />
              <Link href="/" className="justify-start">
                Start a new Project
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeProjectsCard;

/*

  <Card className="w-full drop-shadow-md h-[80vh]">
      <CardHeader>
        <CardTitle>Active Projects Summary</CardTitle>
        <CardDescription>
          A summary of your active projects and their status.
        </CardDescription>
        <div className="text-gray-500 dark:text-gray-400 border-b-2 w-full"/>
      </CardHeader>
      <CardContent className="h-96 overflow-y-auto">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectSummary key={project.id} project={project} />
          ))
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            You have no active projects.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href="/dashboard/projects"
          className="text-blue-500 hover:underline"
          prefetch={false}
        >
          View all projects
        </Link>
      </CardFooter>
    </Card>
*/
