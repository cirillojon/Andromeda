import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AccountTypePieChart = ({ data }: { data: any }) => {
  const accountTypes = data.accounts.reduce((acc: any, account: any) => {
    acc[account.type] = acc[account.type] ? acc[account.type] + 1 : 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(accountTypes),
    datasets: [
      {
        data: Object.values(accountTypes),
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default AccountTypePieChart;
