import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

const HomeProjectsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>
          A summary of your active projects and their status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">Solar Panel Array</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Ongoing
              </p>
            </div>
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              75% complete
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">Roof Replacement</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Completed
              </p>
            </div>
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              100% complete
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">Battery Installation</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Ongoing
              </p>
            </div>
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              60% complete
            </div>
          </div>
        </div>
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
