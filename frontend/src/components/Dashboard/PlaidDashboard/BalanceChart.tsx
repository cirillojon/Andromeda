import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BalanceChart = ({ data }: { data: any }) => {
  const chartData = {
    labels: data.accounts.map((account: any) => account.name),
    datasets: [
      {
        label: "Current Balance",
        data: data.accounts.map((account: any) => account.balances.current),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Available Balance",
        data: data.accounts.map((account: any) => account.balances.available),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Bar data={chartData} />
    </div>
  );
};

export default BalanceChart;
