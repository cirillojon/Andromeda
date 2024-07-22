import React from "react";
import { Button } from "@/components/ui/button";
import { Bar, Pie } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface CalculationResults {
  systemSizeKW?: number;
  annualProduction?: number;
  firstYearSavings?: number;
  lifetimeSavings?: number;
  paybackPeriod?: number;
}

export interface FinancialData {
  totalCostWithoutSolar: number;
  totalCostWithSolar: number;
  savings: number;
  breakEvenYear: number;
  installationSizeKw: number;
  installationCostTotal: number;
  energyCovered: number;
  yearlyEnergyDcKwh: number;
  maxYearlyEnergyDcKwh: number;
}

interface Step2Props {
  calculationResults: CalculationResults | null;
  handleBackToStep1: () => void;
  setCurrentStep: (step: number) => void;
  financialData: FinancialData | null;
}

const Step2: React.FC<Step2Props> = ({
  calculationResults,
  handleBackToStep1,
  setCurrentStep,
  financialData,
}) => {
  if (!financialData) {
    return <div>Loading...</div>;
  }

  const {
    totalCostWithoutSolar,
    totalCostWithSolar,
    savings,
    breakEvenYear,
    installationSizeKw,
    installationCostTotal,
    energyCovered,
    yearlyEnergyDcKwh,
    maxYearlyEnergyDcKwh,
  } = financialData;

  const federalTaxCredit = 6500; // Example value
  const stateTaxCredit = 2000; // Example value
  const totalCost = totalCostWithSolar + federalTaxCredit + stateTaxCredit; // Example calculation
  const netCost = totalCost - federalTaxCredit - stateTaxCredit; // Example calculation
  const monthlyPayment = 180; // Example value
  const loanTerm = 20; // Example value

  const barChartData = {
    labels: [
      "Total Cost",
      "Federal Tax Credit",
      "State Tax Credit",
      "Net Cost",
    ],
    datasets: [
      {
        label: "Amount ($)",
        data: [totalCost, federalTaxCredit, stateTaxCredit, netCost],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  const pieChartData = {
    labels: ["Solar Panels", "Inverter", "Installation", "Other Components"],
    datasets: [
      {
        data: [15000, 4000, 4500, 1500],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="pricing-page p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Solar System Pricing</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={barChartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Components</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie data={pieChartData} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financing">Financing Options</TabsTrigger>
          <TabsTrigger value="savings">Projected Savings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>
                Key details about your solar system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6">
                <li>Total Cost Without Solar: ${totalCostWithoutSolar}</li>
                <li>Total Cost With Solar: ${totalCostWithSolar}</li>
                <li>Savings: ${savings}</li>
                <li>
                  Break Even Year:{" "}
                  {breakEvenYear >= 0
                    ? `Year ${breakEvenYear}`
                    : "Not achievable within the lifespan"}
                </li>
                <li>Installation Size: {installationSizeKw} kW</li>
                <li>Installation Cost: ${installationCostTotal}</li>
                <li>Energy Covered: {Math.round(energyCovered * 100)}%</li>
                <li>
                  Yearly Energy Produced: {yearlyEnergyDcKwh.toFixed(2)}/
                  {maxYearlyEnergyDcKwh}
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="financing">
          <Card>
            <CardHeader>
              <CardTitle>Financing Options</CardTitle>
              <CardDescription>
                Explore ways to finance your solar system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-2">Solar Loan</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Monthly Payment: ${monthlyPayment}</li>
                <li>Loan Term: {loanTerm} years</li>
                <li>Interest Rate: 4.99%</li>
              </ul>
              <h4 className="font-semibold mb-2">Cash Purchase</h4>
              <p>
                Pay ${netCost.toLocaleString()} upfront and start saving
                immediately!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="savings">
          <Card>
            <CardHeader>
              <CardTitle>Projected Savings</CardTitle>
              <CardDescription>
                See how much you can save over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6">
                <li>
                  Estimated First Year Savings: $
                  {calculationResults?.firstYearSavings?.toFixed(2) ?? "N/A"}
                </li>
                <li>
                  20-Year Savings: $
                  {calculationResults?.lifetimeSavings?.toFixed(2) ?? "N/A"}
                </li>
                <li>
                  Payback Period:{" "}
                  {calculationResults?.paybackPeriod?.toFixed(1) ?? "N/A"} years
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-8">
        <Button onClick={handleBackToStep1} variant="outline">
          Back
        </Button>
        <Button onClick={() => setCurrentStep(3)}>
          Proceed to Account Creation
        </Button>
      </div>
    </div>
  );
};

export default Step2;
