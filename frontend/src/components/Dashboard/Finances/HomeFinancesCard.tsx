import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FinancingDetail } from "@/utils/interfaces";
import Link from "next/link";

const HomeFinancesCard = ({
  financing_detail,
}: {
  financing_detail: FinancingDetail;
}) => {
  return (
    <Card className="w-full drop-shadow-md">
      <CardHeader>
        <CardTitle>Finances</CardTitle>
        <CardDescription>Review of financial status.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">Monthly Expense</p>
            </div>
            <div className="text-2xl font-bold">
              {financing_detail.monthly_cost
                ? "$" + financing_detail.monthly_cost
                : "TBD"}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">Total Contribution</p>
            </div>
            <div className="text-2xl font-bold">
              {financing_detail.total_contribution
                ? "$" + financing_detail.total_contribution
                : "TBD"}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">Remaning Balance</p>
            </div>
            <div className="text-2xl font-bold">
              {financing_detail.remaining_balance
                ? "$" + financing_detail.remaining_balance
                : "TBD"}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/dashboard/projects/finances/${financing_detail.project_id}`}
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
