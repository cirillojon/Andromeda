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

const HomeProjectsCard = async () => {
  const user = await getKindeServerSession();
  const currentUser = await user.getUser();
  if (!currentUser) {
    //handle this correctly
    return null;
  }
  const dbUser: DbUser | null = await fetchDbUser(currentUser.id);
  let projects: Project[] = [];
  
  if(dbUser != null){
    const getProjectsUrl = new URL(
      `/api/project/user/1`,
      process.env.NEXT_FRONTEND_BASE_URL
    );

    console.log("Fetching data from " + getProjectsUrl.toString());
    projects = await fetch(getProjectsUrl.toString())
      .then((res) => res.json())
      .then((data) => data);

    console.log("Projects:", projects)
  }

  return (
    <Card className="w-full drop-shadow-md">
      <CardHeader>
        <CardTitle>Active Projects Summary</CardTitle>
        <CardDescription>
          A summary of your active projects and their status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectPreview key={project.id} project={project} />
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
  );
};

export default HomeProjectsCard;

const ProjectPreview = ({ project }: { project: Project }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-lg font-medium">{project.project_name}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {project.status}
        </p>
      </div>
      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
        75% complete
      </div>
    </div>
  );
};
