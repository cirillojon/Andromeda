import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

const HomeFinancesCard = () => {
  return (
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
  );
};
export default HomeFinancesCard;
