import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-800 py-4 pb-24">
      <div className="mr-2 ml-2 md:mr-12 md:ml-12">
        <div className="w-full mx-auto flex mb-6 h-full">
          <div className="w-full">
            <div className="grid grid-rows-2">
              <span className="text-3xl font-bold items-start">
                Active Projects
              </span>
              <span className="text-gray-500">
                A summary of your active projects and their status.
              </span>
            </div>
            <div className="pb-40 md:pb-32 rounded-lg">
              <Card className="mb-6">
                <CardHeader className="bg-gray-900 rounded-tr-md rounded-tl-md mb-4">
                  <CardTitle>
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </CardTitle>
                  <CardDescription>
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="m-2" />
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="-mr-4 md:mr-4 -ml-4 md:ml-4 mt-4 lg:mt-0">
                      <Card className="w-full drop-shadow-md">
                        <CardHeader>
                          <CardTitle>Finances</CardTitle>
                          <CardDescription>
                            Review of financial status.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                              <Skeleton className="h-8 w-full rounded-full bg-gray-300" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Skeleton className="h-8 w-full rounded-full bg-gray-300" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Skeleton className="h-8 w-full rounded-full bg-gray-300" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="-mr-4 md:mr-4 -ml-4 md:ml-4 mt-4 lg:mt-0">
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
                              <Skeleton className="h-8 w-full rounded-full bg-gray-300" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Skeleton className="h-8 w-full rounded-full bg-gray-300" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Skeleton className="h-8 w-full rounded-full bg-gray-300" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
