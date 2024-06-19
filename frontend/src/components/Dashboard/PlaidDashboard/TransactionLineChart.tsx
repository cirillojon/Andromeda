import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const TransactionLineChart = ({ data }: { data: any }) => {
  const transactionDates = data.transactions.map(
    (transaction: any) => transaction.date
  );
  const transactionAmounts = data.transactions.map(
    (transaction: any) => transaction.amount
  );

  const chartData = {
    labels: transactionDates,
    datasets: [
      {
        label: "Transactions",
        data: transactionAmounts,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default TransactionLineChart;
