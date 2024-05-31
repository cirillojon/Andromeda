import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

const HomeInstallersCard = () => {
  return (
    <Card className="w-full drop-shadow-md">
      <CardHeader>
        <CardTitle>Installers</CardTitle>
        <CardDescription>
          A summary of your active installers and their completion.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">Sun Power</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Writing approvals
              </p>
            </div>
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              95% on-time
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">RoofTek</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Done</p>
            </div>
            <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              85% on-time
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">Backed Up Inc</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Batteries in-route
              </p>
            </div>
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              92% on-time
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href="/dashboard/installers"
          className="text-blue-500 hover:underline"
          prefetch={false}
        >
          View all installers
        </Link>
      </CardFooter>
    </Card>
  );
};

export default HomeInstallersCard;
