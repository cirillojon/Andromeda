import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Installer } from "@/utils/interfaces";
import Link from "next/link";

const HomeInstallersCard = ({ installer }: { installer: Installer | null }) => {
  return (
    <Card className="w-full drop-shadow-md">
      <CardHeader>
        <CardTitle>Installer</CardTitle>
        <CardDescription>
          The current installer working on the project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-medium mb-1">{installer?.name ?? "TBD"}</div>
              <div className="text-gray-500 text-md mb-2">
                Agent:{" "}
                <span className="font-bold text-gray-700">
                  {installer?.contact_agent ? installer.contact_agent : "TBD"}
                </span>
              </div>
              <div className="text-gray-500 mb-2 text-md">
                Email:{" "}
                <span className="font-bold text-gray-700">
                  {installer?.contact_email ? installer.contact_email : "TBD"}
                </span>
              </div>
              <div className="text-gray-500 mb-2 text-md">
                Phone:{" "}
                <span className="font-bold text-gray-700">
                  {installer?.contact_phone ? installer.contact_phone : "TBD"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {installer === null ? (
          <Link href="#" aria-disabled={true} className="text-gray-300">
            View Installer
          </Link>
        ) : 
        (
        <Link
          href={`/dashboard/projects/installers/${installer?.id}`}
          className="text-blue-500 hover:underline"
          prefetch={false}
        >
          View installer
        </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default HomeInstallersCard;
