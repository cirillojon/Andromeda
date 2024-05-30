import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const HomeDashboard = () => {
  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-800 py-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <Card>
          <CardHeader>
            <CardTitle>Finances</CardTitle>
            <CardDescription>
              A summary of your financial performance and key metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium">Monthly Expense</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Out of pocket cost
                  </p>
                </div>
                <div className="text-2xl font-bold">$154.30</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium">Total Contribution</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    All time contributions
                  </p>
                </div>
                <div className="text-2xl font-bold">$12,345.67</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium">Remaining Balance</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Outstanding cost
                  </p>
                </div>
                <div className="text-2xl font-bold">$32,886.22</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link
              href="/dashboard/finances"
              className="text-blue-500 hover:underline"
              prefetch={false}
            >
              View financial reports
            </Link>
          </CardFooter>
        </Card>
        <Card>
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
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Done
                  </p>
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
      </div>
    </div>
  );
};

export default HomeDashboard;
