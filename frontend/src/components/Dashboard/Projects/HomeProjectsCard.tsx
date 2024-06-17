import fetchDbUser from "@/utils/api";
import { DbUser, Project } from "@/utils/interfaces";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import ProjectSummary from "./ProjectSummary";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import getAllProjectsByUserId from "@/utils/actions/getAllProjectsByUserId";

const HomeProjectsCard = async () => {
  const user = await getKindeServerSession();
  const currentUser = await user.getUser();
  if (!currentUser) {
    //handle this correctly
    return null;
  }
  const dbUser: DbUser | null = await fetchDbUser(currentUser.id);
  let projects: Project[] | null = null;

  if (dbUser != null) {
    projects = await getAllProjectsByUserId(dbUser.id)
  }

  return (
    <div className="w-full">
      <div className="grid grid-rows-2">
        <span className="text-3xl font-bold items-start">Active Projects</span>
        <span className="text-gray-500">
          A summary of your active projects and their status.
        </span>
      </div>
      <div className="pb-40 md:pb-32 rounded-lg">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <ProjectSummary key={project.id} project={project} />
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
              <Plus className="flex" />
              <Link href="/form" className="justify-start">
                Project
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeProjectsCard;
