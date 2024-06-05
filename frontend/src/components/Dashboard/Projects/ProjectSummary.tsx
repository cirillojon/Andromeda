import { Installer, Project } from "@/utils/interfaces";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import HomeFinancesCard from "../Finances/HomeFinancesCard";
import HomeInstallersCard from "../Installers/HomeInstallersCard";
import HomeTimeline from "../Home/HomeTimeline";

const ProjectSummary = async ({ project }: { project: Project }) => {
  let getInstallerUrl = "";
  let installer: Installer | null = null;
  if(project.installer_id){
    getInstallerUrl = new URL(
      `/api/installer/${project.installer_id}`,
      process.env.NEXT_FRONTEND_BASE_URL
    ).toString();

    installer = await fetch(getInstallerUrl)
      .then((res) => res.json())
      .then((data) => data);
  } 

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-900 text-white rounded-tr-md rounded-tl-md mb-4">
        <CardTitle>{project.project_name}</CardTitle>
        <CardDescription>{project?.status}</CardDescription>
      </CardHeader>
      <CardContent>
        <HomeTimeline />
        <div className="m-2" />
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="-mr-4 md:mr-4 -ml-4 md:ml-4 mt-4 lg:mt-0">
            <HomeFinancesCard financing_detail={project.financing_detail} />
          </div>
          <div className="-mr-4 md:mr-4 -ml-4 md:ml-4 mt-4 lg:mt-0">
            <HomeInstallersCard installer={installer} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/dashboard/projects/${project.id}`}
          className="text-blue-500"
        >
          View Project
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProjectSummary;